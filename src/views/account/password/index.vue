<template>
  <div class="dashboard-container uppass">
    <el-form :model="ChangePwdForm" status-icon :rules="ChangePwdRules" ref="ChangePwdForm" label-width="100px" class="ChangePwd-Form bacground">
      <el-form-item label="原密码" prop="OldPassword">
        <el-input type="password" v-model.number="ChangePwdForm.OldPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="NewPassword">
        <el-input type="password" v-model="ChangePwdForm.NewPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="ConfirmPassword">
        <el-input type="password" v-model="ChangePwdForm.ConfirmPassword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-loading="submitLoading" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm('ChangePwdForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { changepwd } from "@/api/account";
import { isvalidPwd } from "@/utils/validate";
export default {
  name: "uppass",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else {
        if (this.ChangePwdForm.ConfirmPassword !== "") {
          this.$refs.ChangePwdForm.validateField("ConfirmPassword");
        }
        callback();
      }
    };
    var validatePass1 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入新密码"));
      } else if (!isvalidPwd(value)) {
        callback(new Error("密码由8-18位数字字母组合"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ChangePwdForm.NewPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      submitLoading: false,
      ChangePwdForm: {
        OldPassword: "",
        NewPassword: "",
        ConfirmPassword: ""
      },
      ChangePwdRules: {
        OldPassword: [
          {
            validator: validatePass,
            trigger: "blur",
            required: true
          }
        ],
        NewPassword: [
          {
            validator: validatePass1,
            trigger: "blur",
            required: true
          }
        ],
        ConfirmPassword: [
          {
            validator: validatePass2,
            trigger: "blur",
            required: true
          }
        ]
      }
    };
  },
  methods: {
    // 修改密码
    submitForm() {
      this.submitLoading = true;
      var data = {
        OldPassword: this.ChangePwdForm.OldPassword,
        NewPassword: this.ChangePwdForm.NewPassword,
        ConfirmPassword: this.ChangePwdForm.ConfirmPassword
      };
      this.$refs.ChangePwdForm.validate(valid => {
        if (valid) {
          changepwd(data).then(res => {
            console.log(res);
            if (res.code === 0) {
              this.$message.success(res.msg);
            } else {
              this.$message.error(res.msg);
            }
            this.submitLoading = false;
          });
        } else {
          this.submitLoading = false;
          return false;
        }
      });
    },
    // 重置密码
    resetForm(formName) {
      if (
        this.ChangePwdForm.OldPassword != "" &&
        this.ChangePwdForm.NewPassword != "" &&
        this.ChangePwdForm.ConfirmPassword != ""
      ) {
        this.$refs[formName].resetFields();
        this.$message.success("重置成功");
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    box-shadow: 0px 0px 6px #d0d0d0;
    background: #fff;
    padding: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>