<template>
  <el-card class="box-card loading-area">
    <div slot="header" class="clearfix">
      <span>平台设置</span>
    </div>
    <div>
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
            <el-form-item label="系统名称" prop="systemName">
              <el-input v-model="formData.systemName"  placeholder="请输入系统名称"></el-input>
            </el-form-item>
            <el-form-item label="系统logo">
              <el-upload
                ref="upload"
                class="el-upload"
                :action="uploadFile()"
                :http-request="uploadRequest"
                :on-change="selectFile"
                :on-success="handleSuccess"
                :file-list="fileList"
                :show-file-list="false"
                :auto-upload="false"
                >
                <img v-if="formData.systemLogo" :src="formData.systemLogo" class="logo">
                <i v-else class="el-icon-plus uploader-icon"></i>
              </el-upload>
            </el-form-item>
        <el-form-item size="medium" style="margin-top: 10px">
          <el-button type="primary" class="loading-area" @click="submitForm" v-hasPermi="['post:sys:config:platformSetting']">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>

</template>
<script>
  import { platformSetting,getPlatformConfig } from "@/api/sys/config";
  import { upload} from "@/api/sys/file";
  export default {
    name: "PlatformSetting",
    data() {
      return {
        logoImg:undefined,
        formData:{
          systemName: undefined,
          systemLogo: undefined,
        },
        //上传文件列表
        fileList:[],
        newData:{},
        rules: {
          systemName: [
            { required: true, message: "系统名称不能为空", trigger: "blur" }
          ]
        }
      }
    },
    created() {
      getPlatformConfig().then(response => {
        this.formData = response.data;
        this.logoImg = this.formData.systemLogo
      });
    },
    methods: {
      uploadFile(){
        return process.env.VUE_APP_BASE_API + '/api/sys/file/upload'
      },
      uploadRequest(param) {
        this.fileList.push(param.file);// 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      },
      //判断是否为图片
      isImageAsset(fileType){
        return ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp', 'image/gif','image/svg+xml'].indexOf(fileType.toLowerCase()) !== -1;
      },
      //判断是否为图片
      isImage(fileSuffix){
        return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(fileSuffix.toLowerCase()) !== -1;
      },
      beforeUpload(file) {
        const fileName = file.name;
        const suffix = fileName.substr(fileName.lastIndexOf(".")+1);
        const isImg = this.isImage(suffix);
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImg) {
          this.$message.error('只能上传图片!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return false;
        }
        return true;
      },
      selectFile(file, fileList){
        this.fileList = fileList;
        this.formData.systemLogo = URL.createObjectURL(file.raw);//预览
      },
      handleSuccess(response, file, fileList) {
       /* this.$refs.upload.clearFiles();
        this.fileList = [];
        this.formData.systemLogo = response.data.fileUrl;
        platformSetting(this.formData.systemName,this.formData.systemLogo).then(response => {
          if (response.code === 0) {
            this.msgSuccess("设置成功");
          } else {
            this.msgError(response.msg);
          }
        });*/
      },
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (!valid) return
          if(this.fileList.length>0){
            const file = this.fileList[0];
            if(!this.beforeUpload(file)){
              this.fileList = [];
              this.formData.systemLogo = this.logoImg;
              return;
            }
            const upData = new FormData();
            this.$refs.upload.submit();// 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
            this.fileList.forEach(function (file) {// 因为要上传多个文件，所以需要遍历
              //upData.append('file', file, file.name);
              upData.append('file', file);
            });
            upData.append("body", JSON.stringify(this.newData)); // 这里需要转换一下格式传给后台
            upload(upData).then((response =>{
              this.loading = false;
              if (response.code === 0) {
                this.$refs.upload.clearFiles();
                this.fileList = [];
                this.formData.systemLogo = response.data[0].fileUrl;
                platformSetting(this.formData.systemName,this.formData.systemLogo).then(response => {
                  if (response.code === 0) {
                    this.msgSuccess("设置成功");
                  } else {
                    this.msgError(response.msg);
                  }
                });
              }else {
                this.msgError(response.msg);
              }
            }))
          }else {
            platformSetting(this.formData.systemName,this.formData.systemLogo).then(response => {
              if (response.code === 0) {
                this.msgSuccess("设置成功");
              } else {
                this.msgError(response.msg);
              }
            });
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .box-card {
    margin: 10px 20%;
  }

  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
  .uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .logo {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
