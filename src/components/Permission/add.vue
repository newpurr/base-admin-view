<template>
  <!--弹窗：新增或编辑权限-->
  <!--:visible.sync="dialogFormVisible"-->
  <el-dialog :title="textMap[dialogType+'Button']" :visible.sync="showDialog" width="30%">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top">
      <el-form-item label="权限名" prop="name">
        <el-input v-model="temp.name" placeholder="例如：用户管理、添加用户"/>
      </el-form-item>
      <el-form-item label="权限值" prop="path">
        <el-input v-model="temp.path" :disabled="dialogType==constDialogType.UPDATE"/>
      </el-form-item>
      <el-form-item label="父级权限值" prop="path">
        <el-input v-model="temp.parent.path" :disabled="true"/>
      </el-form-item>
      <el-form-item label="权限类型" prop="per_type">
        <el-select v-model="temp.per_type">
          <el-option
            v-for="item in permType"
            :key="item.code"
            :label="item.name"
            :value="item.code"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button v-if="dialogType===constDialogType.ADD" type="primary" @click="add">确定</el-button>
      <el-button v-else-if="dialogType===constDialogType.ADD" type="primary" @click="update">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
const permType = {
  BUTTON: { code: 3, name: '按钮' },
  MENU: { code: 2, name: '菜单' },
  API: { code: 1, name: '接口' }
}

const constDialogType = {
  ADD: 'add',
  UPDATE: 'update'
}

export default {
  name: 'PermissionAdd',
  props: {
    // 业务类型 编辑Or新增
    dialogType: {
      type: String,
      default: constDialogType.ADD
    },
    businessType: {
      type: String,
      default: permType.BUTTON.code
    },
    parentObject: {
      type: Object,
      default: () => {
        return {}
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDialog: this.dialogVisible,
      permType,
      constDialogType,
      dialogFormVisible: false,
      textMap: {
        addButton: '添加权限',
        updateButton: '更新权限',
        deleteButton: '删除权限'
      },
      temp: {
        idx: null,
        pid: null,
        name: null,
        per_type: permType[this.businessType].code,
        path: null,
        parent: this.parentObject
      },
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        per_type: [{ required: true, message: '必填', trigger: 'blur' }],
        path: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },
  watch: {
    'parentObject': function(val) {
      this.temp.parent = val
      // for (const key in this.temp) {
      //   this.temp[key] = null
      // }
      // this.$nextTick(() => this.$refs['dataForm'].clearValidate())
    },
    'dialogVisible': function(val) {
      this.showDialog = val
    },
    'businessType': function(val) {
      console.log(val)
      // for (const key in this.temp) {
      //   this.temp[key] = null
      // }
      // this.$nextTick(() => this.$refs['dataForm'].clearValidate())
    },
    'dialogType': function(val) {
      // for (const key in this.temp) {
      //   this.temp[key] = null
      // }
      // this.$nextTick(() => this.$refs['dataForm'].clearValidate())
    }
  },
  methods: {
    add() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) return
        const data = Object.assign({}, this.temp)// copy obj
        console.log(data)
      })
    },
    update() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) return
        const data = Object.assign({}, this.temp)// copy obj
        console.log(data)
        // permApi.updatePerm(data).then(res => {
        //   this.dialogFormVisible = false
        //   this.initData()
        //   this.$message.success('更新按钮权限成功')
        // })
      })
    }
  }
}
</script>

<style scoped>

</style>
