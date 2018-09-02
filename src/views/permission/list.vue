<template>
  <div v-loading="loading" class="app-container">
    <el-row :gutter="20">
      <el-col :span="10">
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
            highlight-current
            default-expand-all
            show-checkbox>
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>
                <span class="mgl-10">{{ data.title }}</span>
                <!--<span class="mgl-10 tips-text">{{ data.path }}</span>-->
                <el-tag class="mgl-10" type="success" size="mini">菜单</el-tag>
                <el-tag v-if="syncMenu.indexOf(data.absolute_path) === -1" class="mgl-10" type="danger" size="mini">未同步</el-tag>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>

    <el-tooltip placement="top" content="去顶部">
      <back-to-top :visibility-height="300" :back-position="50" transition-name="fade"/>
    </el-tooltip>
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
import BackToTop from '@/components/BackToTop'

export default{
  name: 'PermissionList',
  components: { BackToTop },
  data() {
    return {
      // 菜单权限树
      menuTree: [],
      treeProps: {
        label: 'title',
        children: 'children'
      },
      activeName: 'menu',
      syncMenu: [],
      loading: true,
      filterMenuPermText: ''
    }
  },
  computed: {
    ...mapGetters([
      'permission'
    ])
  },
  watch: {
    'filterMenuPermText': debounce(function(val) {
      this.$refs.menuPermTreeRef.filter(val)
    }, 600)
  },

  created() {
    this.refreshSyncedMenu()

    this.menuTree = [{
      'path': '/',
      'absolute_path': '/',
      'name': '根',
      'title': '根',
      'children': this.generateMenuTree()
    }]
    // this.menuTree = this.generateMenuTree()
  },

  methods: {
    generateTitle,
    refreshSyncedMenu() {
      getMenuPermissionData().then((response) => {
        this.syncMenu = response.data || []
        this.loading = false
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
          'name': typeof childenItem.name !== undefined ? childenItem.name : '',
          'title': (childenItem.meta && childenItem.meta.title) ? this.generateTitle(childenItem.meta.title) : ''
        }
        if (childenItem.children) {
          newChilden.children = this.getChildren(childenItem.children, newChilden)
        }
        return newChilden
      })
    },
    SyncMenuPermissionData() {
      const menus = this.menuTree
      SyncMenuPermissionData({ 'menus': menus }).then((result) => {
        // console.log(result)
        this.refreshSyncedMenu()
        this.$message({
          message: '恭喜你，同步成功',
          type: 'success'
        })
      })
    },
    assignPermissions() {
      let checkedMenus = this.$refs.menuPermTreeRef.getCheckedNodes()
      checkedMenus = checkedMenus.map((item) => {
        return item.absolute_path
      })
      assignRolePermissions(1, checkedMenus).then((result) => {
        return initializePermission(1)
      }).then((response) => {
        this.$message({
          message: '权限分配成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style>
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
