<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <div class="title-box">
          <el-tooltip content="同步权限数据到后端" placement="top">
            <el-button type="primary" size="mini" round @click="SyncMenuPermissionData">同步数据</el-button>
          </el-tooltip>
          <el-tooltip content="分配权限" placement="top">
            <el-button type="success" size="mini" round @click="assignPermissions">分配权限</el-button>
          </el-tooltip>
        </div>
      </div>
      <el-input v-model="filterMenuPermText" class="mgb-15" placeholder="筛选菜单"/>
      <el-tree
        ref="menuPermTreeRef"
        :data="menuTree"
        :props="treeProps"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :default-checked-keys="permission"
        node-key="absolute_path"
        default-expand-all
        show-checkbox>
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span class="mgl-10">
            {{ data.title }}
            <el-tooltip content="菜:指代菜单,钮:指代按钮" placement="top">
              <el-tag v-if="data.per_type == 2" class="mgl-10" type="success" size="mini">菜</el-tag>
              <el-tag v-else-if="data.per_type == 3" class="mgl-10" type="success" size="mini">钮</el-tag>
            </el-tooltip>
            <el-tag v-if="syncMenu.indexOf(data.absolute_path) === -1" class="mgl-10" type="danger" size="mini">未同步</el-tag>
          </span>
          <span class="mgl-10">
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-caret-bottom el-icon--right"/>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-button type="text" size="mini" icon="el-icon-plus" @click="showdialog('add', node, 'BUTTON')"/>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button class="update-btn" type="text" size="mini" icon="el-icon-edit"/>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button class="delete-btn" type="text" size="mini" icon="el-icon-delete"/>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
    </el-card>
    <permission-add v-if="dialog.visible" :current-node="dialog.node" :dialog-visible.sync="dialog.visible" :dialog-type="dialog.type" :business-type="dialog.businessType"/>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import { asyncRouterMap } from '@/router'
import { SyncMenuPermissionData, getMenuPermissionData, assignRolePermissions } from '@/api/rbac'
import { initializePermission } from '@/utils/permission'
import path from 'path'
import debounce from 'lodash/debounce'
import { mapGetters } from 'vuex'
import PermissionAdd from './add'

export default {
  name: 'Permission',
  components: { PermissionAdd },
  props: {
    // 业务类型 1-角色 2-用户
    businessType: {
      type: Number,
      default: 1
    },
    // 业务ID 分配类型为1时为角色ID 类型为2是为用户ID
    businessId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 菜单权限树
      menuTree: [],
      treeProps: {
        label: 'title',
        children: 'children'
      },
      syncMenu: [],
      filterMenuPermText: '',
      dialog: {
        visible: false,
        type: 'add',
        node: {},
        businessType: 'BUTTON'
      }
    }
  },
  computed: {
    ...mapGetters([
      'permission'
    ])
  },
  watch: {
    'filterMenuPermText': debounce(function(val) {
      // tree筛选
      this.$refs.menuPermTreeRef.filter(val)
    }, 600)
  },

  created() {
    this.refreshSyncedMenu()

    this.menuTree = [{
      'path': '/',
      'absolute_path': '/',
      'name': '根对象',
      'title': '根对象',
      'per_type': 2,
      'children': this.generateMenuTree()
    }]
  },

  methods: {
    showdialog(type, node, businessType) {
      this.dialog.visible = true
      this.dialog.type = type
      this.dialog.node = node
      this.dialog.businessType = businessType
    },
    generateTitle,
    refreshSyncedMenu() {
      getMenuPermissionData().then((response) => {
        this.syncMenu = response.data || []
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1 || data.path.indexOf(value) !== -1 || data.title.indexOf(value) !== -1
    },
    generateMenuTree() {
      return asyncRouterMap.map((item, index) => {
        const newVar = {
          'path': item.path,
          'absolute_path': item.path,
          'per_type': 2,
          'name': item.name
        }
        if ((!item.meta || !item.meta.title) && item.children && item.children.length === 1) {
          item.meta = item.children[0].meta
        }
        if (item.meta && item.meta.title) {
          newVar.title = this.generateTitle(item.meta.title)
          newVar.name = newVar.name ? newVar.name : item.meta.title
        }
        if (item.children && item.children.length > 0) {
          newVar.children = this.getChildren(item.children, newVar)
        }
        return newVar
      }).filter(item => {
        return item.path !== '*' || item.alwaysShow
      })
    },
    getChildren(childrens, parentNode) {
      return childrens.map((childenItem) => {
        const newChilden = {
          'path': childenItem.path,
          'absolute_path': path.join('/', parentNode.path, childenItem.path),
          'per_type': 2,
          'name': typeof childenItem.name !== undefined ? childenItem.name : '',
          'title': (childenItem.meta && childenItem.meta.title) ? this.generateTitle(childenItem.meta.title) : ''
        }
        if (childenItem.children) {
          newChilden.children = this.getChildren(childenItem.children, newChilden)
        }
        return newChilden
      })
    },
    // 同步路由到后端
    SyncMenuPermissionData() {
      const menus = this.menuTree
      SyncMenuPermissionData({ 'menus': menus }).then((result) => {
        this.refreshSyncedMenu()
        this.$message({
          message: '恭喜你，同步成功',
          type: 'success'
        })
      })
    },
    // 分配权限
    assignPermissions() {
      let checkedMenus = this.$refs.menuPermTreeRef.getCheckedNodes()
      checkedMenus = checkedMenus.map((item) => {
        return item.absolute_path
      })
      if (this.businessType === 1) {
        assignRolePermissions(this.businessId, checkedMenus).then((result) => {
          return initializePermission(this.businessId)
        }).then((response) => {
          this.$message({
            message: '权限分配成功',
            type: 'success'
          })
        })
      } else {
        this.$message({
          message: '暂不支持其他类型',
          type: 'success'
        })
      }
    }
  }
}
</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .mgb-15 {
        margin-bottom: 15px;
    }
</style>
