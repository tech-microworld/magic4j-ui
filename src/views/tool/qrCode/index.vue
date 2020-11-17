<template>
  <el-card class="box-card loading-area">
    <div slot="header" class="clearfix">
      <span>生成二维码</span>
    </div>
    <div>
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
          <el-form-item label="二维码内容" prop="qrCodeText">
            <el-input v-model="formData.qrCodeText"  placeholder="请输入二维码文本内容" style="width: 450px"></el-input>
            <el-button type="primary" @click="submitForm">生成</el-button>
          </el-form-item>
      </el-form>
      <el-image
        v-if="qrCodeUrl"
        style="width: 250px; height: 250px"
        :src="qrCodeUrl"
        >
      </el-image>
      <el-button
        v-if="qrCodeUrl"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload(qrCodeUrl)"
      >下载二维码</el-button>
    </div>
  </el-card>

</template>
<script>
  import { createQrCode } from "@/api/tool/qrCode";
  import { download } from "@/utils/commonUtil";
  export default {
    name: "QrCode",
    data() {
      return {
        qrCodeUrl:undefined,
        formData:{
          qrCodeText: undefined
        },
        rules: {
          qrCodeText: [
            { required: true, message: "二维码内容不能为空", trigger: "blur" }
          ]
        }
      }
    },
    created() {

    },
    methods: {
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (!valid) return
          createQrCode(this.formData).then(response => {
            if (response.code === 0) {
              this.msgSuccess("生成成功");
              this.qrCodeUrl = response.data
            } else {
              this.msgError(response.msg);
            }
          });
        })
      },
      /** 下载按钮操作 */
      handleDownload(qrCodeUrl) {
        download(qrCodeUrl,'qrCode.png')
      },
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
