<template>
  <div class="dashboard-container">
    <component :is="currentRole"/>
    <el-upload :multiple="true" :on-success="success" name="file_data[]" action="http://admin.base.com/upload" drag>
      <i class="el-icon-upload"/>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <hr>
    <el-upload
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="success"
      name="file_data[]"
      action="http://admin.base.com/upload"
      list-type="picture-card">
      <i class="el-icon-plus"/>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  methods: {
    success(res, file, uploadFiles) {
      file.persistence = res.payload.files[0]
      console.log(res, file, uploadFiles)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
