<template>
  <el-card class="box-card loading-area">
    <div slot="header" class="clearfix">
      <span>安全设置</span>
    </div>
    <div>
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="210px">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="常规设置" name="1">
            <el-form-item label="密码输错多少次后锁定用户" prop="maxFailedLoginAttempts">
              <el-input-number v-model="formData.maxFailedLoginAttempts" :min="0" placeholder="请输入错误次数"
                               controls-position=right></el-input-number>
            </el-form-item>
            <el-form-item label="用户锁定后通知的邮箱" prop="userLockoutNotificationEmail">
              <el-input v-model="formData.userLockoutNotificationEmail" placeholder="请输入用户锁定后通知的邮箱" clearable></el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="密码规则设置" name="2">
            <el-form-item label="密码最小长度">
              <el-input-number v-model="formData.passwordPolicy.minimumLength" :min="minimumLength" :max="formData.passwordPolicy.maximumLength" placeholder="密码长度" controls-position=right>
              </el-input-number>
            </el-form-item>
            <el-form-item label="密码需要包含的大写字母个数">
              <el-input-number v-model="formData.passwordPolicy.minimumUppercaseLetters" :min="0" placeholder="密码需要包含的大写字母个数"
                               controls-position=right></el-input-number>
            </el-form-item>
            <el-form-item label="密码需要包含的小写字母个数">
              <el-input-number v-model="formData.passwordPolicy.minimumLowercaseLetters" :min="0" controls-position=right></el-input-number>
            </el-form-item>
            <el-form-item label="密码需要包含的数字个数">
              <el-input-number v-model="formData.passwordPolicy.minimumDigits" :min="0" controls-position=right></el-input-number>
            </el-form-item>
            <el-form-item label="密码需要包含的特殊字符个数">
              <el-input-number v-model="formData.passwordPolicy.minimumSpecialCharacters" :min="0" controls-position=right>
              </el-input-number>
            </el-form-item>
            <el-form-item label="密码多少天后过期">
              <el-input-number v-model="formData.passwordPolicy.passwordExpirationPeriodDays" :min="0" controls-position=right>
              </el-input-number>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-form-item size="medium" style="margin-top: 10px">
          <el-button type="primary" @click="submitForm" v-hasPermi="['post:sys:config:security:set']">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>

</template>
<script>
  import { securitySet,securityInfo } from "@/api/sys/config";
  export default {
    name: "SecuritySetting",
    data() {
      return {
        activeNames: ['1'],
        formData: {
          maxFailedLoginAttempts: 0,
          userLockoutNotificationEmail: undefined,
          passwordPolicy:{
            minimumLength: 6,
            maximumLength: 30,
            minimumUppercaseLetters: 0,
            minimumLowercaseLetters: 0,
            minimumDigits: 0,
            minimumSpecialCharacters: 0,
            passwordExpirationPeriodDays: 0
          }
        },
        rules: {
          userLockoutNotificationEmail: [
            {
              type: "email",
              message: "'请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ]
        }
      }
    },
    created() {
      securityInfo().then(response => {
        this.formData = response.data;
      });
    },
    computed: {
      minimumLength(){
        let min = this.formData.passwordPolicy.minimumUppercaseLetters + this.formData.passwordPolicy.minimumLowercaseLetters + this.formData.passwordPolicy.minimumDigits + this.formData.passwordPolicy.minimumSpecialCharacters;
        if(min<6){
          min = 6;
        }
        return min;
      }
    },
    watch: {
      minimumLength:function (val) {
        let min = this.formData.passwordPolicy.minimumUppercaseLetters + this.formData.passwordPolicy.minimumLowercaseLetters + this.formData.passwordPolicy.minimumDigits + this.formData.passwordPolicy.minimumSpecialCharacters;
        if(min<6){
          min = 6;
        }
        this.formData.passwordPolicy.minimumLength = min;
      }
    },
    methods: {
      submitForm() {
        this.$refs['elForm'].validate(valid => {
          if (!valid) return
          securitySet(this.formData).then(response => {
            if (response.code === 0) {
              this.msgSuccess("设置成功");
            } else {
              this.msgError(response.msg);
            }
          });
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .box-card {
    margin: 10px 20%;
  }

</style>
