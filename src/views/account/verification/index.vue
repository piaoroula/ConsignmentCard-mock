<template>
  <el-card class="dashboard-container">
    <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
      <el-step title="身份验证" ></el-step>
      <el-step title="身份审核" ></el-step>
    </el-steps>
    <div v-if='active==0'>
      <el-form ref="acountInfForm" style="width:50%; margin:5px auto;" :model="acountInfForm" label-width="100px">
        <el-form-item label="当前用户">
          <span>{{acountInfForm.name}}</span>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="acountInfForm.iDCard"></el-input>
        </el-form-item>
        <el-form-item label="身份证正面照">
          <el-upload class="avatar-uploader" :class="{disabled:iDImgFrontShow}" :file-list="iDImgFront" :show-file-list="true" action="uploadFile" list-type="picture-card" :on-remove="handleiDImgFrontRemove" :on-change="handleiDImgFrontChange" :before-upload="beforeAvatarUpload" :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="身份证反面照">
          <el-upload class="avatar-uploader" :class="{disabled:iDImgBackShow}" :file-list="iDImgBack" :show-file-list="true" action="uploadFile" list-type="picture-card" :on-remove="handleiDImgBackRemove" :on-change="handleiDImgBackChange" :before-upload="beforeAvatarUpload" :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="手持身份证照">
          <el-upload class="avatar-uploader" :class="{disabled:iDImgHoldShow}" :file-list="iDImgHold" :show-file-list="true" action="uploadFile" list-type="picture-card" :on-remove="handleiDImgHoldRemove" :on-change="handleiDImgHoldChange" :before-upload="beforeAvatarUpload" :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>       
        <el-form-item size="large">
          <el-button type="primary" :loading="submitaccountLoading">提交保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if='active==1'>

    </div>
  </el-card>
  
</template>
<script>
import { mapGetters } from 'vuex'
import { isvalidatephone, validateURL } from '@/utils/validate'
import {
  GetUser,
  uploadFile
} from '@/api/account'
export default {
  name: 'verification',
  data() {
    return {
      active: 0,
      submitaccountLoading:false,
      iDImgFrontShow: false,
      iDImgFront: [],
      iDImgBackShow: false,
      iDImgBack: [],
      iDImgHoldShow: false,
      iDImgHold: [],
      acountInfForm: {
        name:null,
        userName: null,
        iDCard: null
      }
    }
  },
  created() {
    this.getacountInfData()
  },
  methods: {
    // 获取账号信息
    getacountInfData() {
      GetUser().then(res => {
        this.acountInfForm = res
        this.acountInfForm.name = this.acountInfForm.realName == null || this.acountInfForm.realName == undefined ? this.acountInfForm.userName : this.acountInfForm.realName
      })
    },
    handleiDImgFrontChange(file, fileList){
      this.iDImgFront = fileList;
      let _this = this
      let files = fileList[0]
      var reader = new FileReader();
      reader.onload = function (e) {
        var base64 = e.target.result;
        console.log(base64)
      }
      
      this.iDImgFrontShow = true;
    },
    handleiDImgFrontRemove(file, fileList){
      this.iDImgFront = [];
      this.iDImgFrontShow = false;
    },
    handleiDImgBackChange(file, fileList) {
      this.iDImgBack = fileList;
      this.iDImgBackShow = true;
    },
    handleiDImgBackRemove(file, fileList){
      this.iDImgFront = [];
      this.iDImgFrontShow = false;
    },
    handleiDImgHoldChange(file, fileList) {
      this.iDImgHold = fileList;
      this.iDImgHoldShow = true;
    },
    handleiDImgHoldRemove(file, fileList){
      this.iDImgFront = [];
      this.iDImgFrontShow = false;
    },
    beforeAvatarUpload(file) {      
      const isJPG = file.type === 'image/jpeg';
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }      
      return isJPG && isLt2M;
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .disabled .el-upload--picture-card {
    display: none;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    width:348px;
    height:208px;
  }
</style>
