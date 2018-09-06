<template>
  <!--弹窗：新增或编辑权限-->
  <!--:visible.sync="dialogFormVisible"-->
  <el-dialog :title="titleName" :visible.sync="visible" width="30%">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top">
      <el-form-item label="权限名" prop="name">
        <el-input v-model="temp.name" placeholder="例如：用户管理、添加用户"/>
      </el-form-item>
      <el-form-item label="权限值" prop="path">
        <el-input v-model="temp.path" :disabled="dialogType==constDialogType.UPDATE"/>
      </el-form-item>
      <el-form-item label="父级权限值" prop="absolute_path">
        <el-input :value="currentNode.parent.data.absolute_path" :readonly="true"/>
      </el-form-item>
      <el-form-item label="权限类型" prop="per_type">
        <el-select v-model="temp.per_type" :disabled="true">
          <el-option
            v-for="item in permType"
            :key="item.code"
            :label="item.name"
            :value="item.code"/>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button v-if="dialogType===constDialogType.ADD" type="primary" @click="add">确定</el-button>
      <el-button v-else-if="dialogType===constDialogType.ADD" type="primary" @click="update">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import path from 'path'

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
    currentNode: {
      type: Object,
      default: () => {
        return {
          'data': {
            absolute_path: '',
            name: '',
            path: '',
            title: '',
            parent: {}
          },
          'parent': {}
        }
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permType,
      constDialogType,
      textMap: {
        addButton: '添加权限',
        updateButton: '更新权限',
        deleteButton: '删除权限'
      },
      temp: {
        name: this.currentNode.data.name,
        per_type: permType[this.businessType].code,
        path: this.currentNode.data.absolute_path
      },
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        per_type: [{ required: true, message: '必填', trigger: 'blur' }],
        path: [{ required: true, message: '必填', trigger: 'change' }]
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible
      },
      set(newVal) {
        this.$emit('update:dialogVisible', newVal)
      }
    },
    titleName() {
      console.log(this.dialogType + 'Button')
      console.log(this.textMap)
      return this.textMap[this.dialogType + 'Button']
    }
  },
  watch: {
    // 'dialogVisible': function(val) {
    //   this.showDialog = val
    // },
    // 'showDialog': function(val) {
    //   this.$nextTick(() => this.$refs['dataForm'].clearValidate())
    //   this.$emit('show_dialog_change', val)
    // },
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
        const data = Object.assign({}, this.temp)
        data.title = data.name
        data.absolute_path = path.join('/', this.currentNode.data.absolute_path, data.path)
        this.$parent.$refs.menuPermTreeRef.append(data, this.currentNode)
        // this.$emit('update:dialog.node', tempNode)
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
