<template>
  <div class="app-container">

    <sticky class-name="box-card" style="margin-bottom:20px;">
      <label class="el-form-item__label">通用功能:</label>
      <el-tooltip class="item" effect="dark" content="添加角色" placement="top-start">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate"/>
      </el-tooltip>
      <el-dropdown trigger="click">
        <el-tooltip class="item" effect="dark" content="双击清空选中" placement="top-start">
          <el-button plain>
            已选中 <em style="color: red">1</em> 项目<i class="el-icon-caret-bottom el-icon--right"/>
          </el-button>
        </el-tooltip>
        <el-dropdown-menu slot="dropdown">
          <el-input v-model="temp" placeholder="已选中项目" class="filter-item"/>
        </el-dropdown-menu>
      </el-dropdown>
    </sticky>

    <sticky class-name="box-card" style="margin-bottom:20px;">
      <label class="el-form-item__label">筛选项:</label>
      <el-input :placeholder="$t('role.name')" v-model="listQuery.name" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </sticky>

    <el-table v-loading.body="listLoading" ref="roleListTable" :data="list" border fit style="width: 100%" @row-click="handleRowClick" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        label="ID"/>
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.enable | statusFilter">{{ scope.row.enable | enableStatusName }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click.stop="handleUpdate(scope.row.id)"/>
          <el-button type="primary" size="small" icon="el-icon-circle-check" @click.stop="assignPermissions(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        :current-page="listQuery.page"
        :page-sizes="[15,30,50]"
        :page-size="listQuery.limit"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <el-collapse-transition>
      <role-detail :is-edit="dialogForm.isEdit" :dialog-visible.sync="dialogForm.visible" :id="dialogForm.payload.id" @handleSuccess="getList"/>
    </el-collapse-transition>
    <el-collapse-transition>
      <el-dialog :visible.sync="permissionDialogForm.visible" title="分配权限" width="30%">
        <permission :business-type="permissionDialogForm.businessType" :business-id="permissionDialogForm.payload.id"/>
      </el-dialog>
    </el-collapse-transition>
    <el-tooltip placement="top" content="去顶部">
      <back-to-top :visibility-height="300" :back-position="50" transition-name="fade"/>
    </el-tooltip>
  </div>
</template>

<script>
import { getRoles } from '@/api/rbac'
import RoleDetail from './components/RoleDetail'
import BackToTop from '@/components/BackToTop'
import Permission from '@/components/Permission'
import waves from '@/directive/waves' // 水波纹指令
import Sticky from '@/components/Sticky'

export default {
  name: 'RoleList',
  components: { RoleDetail, BackToTop, Permission, Sticky },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        name: '',
        page: 1,
        limit: 10
      },
      dialogForm: {
        visible: false,
        isEdit: false,
        payload: {
          id: 0
        }
      },
      permissionDialogForm: {
        visible: false,
        businessType: 1,
        payload: {
          id: 0
        }
      },
      temp: ''
    }
  },
  computed: {
  },
  watch: {
    dialogForm(val) {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleRowClick(row, event, column) {
      this.$refs.roleListTable.toggleRowSelection(row)
      console.log(row, event, column)
      // this.$refs.roleListTable.selection.map(item => item.id).join(',')
    },
    handleSelectionChange(selection) {
      this.temp = selection.map(item => item.id).join(',')
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      getRoles(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.paginate.total
        this.listLoading = false
      })
    },
    assignPermissions(id) {
      this.permissionDialogForm.payload.id = id
      this.permissionDialogForm.visible = true
    },
    handleUpdate(id) {
      this.dialogForm.payload.id = id
      this.dialogForm.visible = true
      this.dialogForm.isEdit = true
    },
    handleCreate() {
      this.dialogForm.payload.id = 0
      this.dialogForm.visible = true
      this.dialogForm.isEdit = false
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
