<template>
  <div class="dashboard-container userinfo">
    <el-tabs v-model="activeName">
      <el-tab-pane label="账号信息" name="account">
        <div class="grid-content bg-purple acountInf bacground">
          <el-form ref="acountInfForm" :model="acountInfForm" label-width="100px" :rules="acountInfFormRules">
            <el-form-item label="当前用户">
              <span>{{acountInfForm.name}}</span>
            </el-form-item>
            <el-form-item label="帐号余额">
              <span>{{acountInfForm.balance}}元</span>
            </el-form-item>
            <el-form-item label="绑定邮箱">
              <span>{{acountInfForm.email}}</span>
            </el-form-item>
            <el-form-item label="手机号码" v-if="!phoneNumberConfirmed">
              <el-row :gutter="20">
                {{acountInfForm.phoneNumber}}
              </el-row>
            </el-form-item>
            <el-form-item label="手机号码" prop='phoneNumber' v-if="phoneNumberConfirmed">
              <el-row :gutter="20">
                <el-col width='100'>
                  <el-input v-model="acountInfForm.phoneNumber" placeholder="手机号码"></el-input>
                </el-col>
                <el-col width='50'>
                  <el-input v-model="acountInfForm.code" class="msgCode" v-if='value' placeholder="短信验证码"></el-input>
                </el-col>
                <el-col width='50'>
                  <el-button v-show="sendAuthCode" type="primary" :loading="sendCodeLoading" class="auth_text auth_text_blue" @click="sendCode">获取验证码</el-button>
                  <el-button v-show="!sendAuthCode" class="auth_text" type="primary">
                    <span class="auth_text_blue">{{auth_time}} </span> 秒之重新发送验证码</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item v-if="!showsubmit" label="收款账号">
              <el-select v-model="acountInfForm.selectAcount" placeholder="请选择收款信息帐号 " width="98%">
                <el-option v-for="account in acountInfForm.settlementAccount " :key="account" :label="account" :value="account">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="showsubmit-value" v-if="showsubmit" label="机构名称" prop='institution'>
              <el-select v-model="acountInfForm.institution" filterable size="medium" placeholder="请选择机构名称 " width="400px">
                <el-option v-for="account in institutions " :key="account.value" :label="account.value" :value="account.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="showsubmit" label="开户行" prop='accountBank'>
              <el-input type="text" v-model='acountInfForm.accountBank' placeholder="请输入开户行"></el-input>
            </el-form-item>
            <el-form-item v-if="showsubmit" label="收款账户" prop='account'>
              <el-input type="text" v-model='acountInfForm.account' placeholder="请输入收款账户"></el-input>
            </el-form-item>
            <el-form-item v-if="showsubmit" label="收款人姓名" prop='name'>
              {{acountInfForm.name}}
            </el-form-item>
            <el-form-item v-if=showsubmit label="* ">
              <el-tag type="danger">出于安全考虑， 一旦设置后，不可修改！请务必慎重确认。</el-tag>
            </el-form-item>
            <el-form-item v-if=showsubmit size="large ">
              <el-button type="primary " :loading="submitaccountLoading" @click="onSubmitacountInfForm">提交保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="API接口" name="api" v-if="ApiInfo != null && this.ApiInfo.id != null && ApiInfo.id != ''">
        <div class="grid-content bg-purple APIInf bacground">
          <el-form label-width="120px" ref="ApiInfo" :model="ApiInfo" :rules="ApiInfoRule">
            <el-form-item label="APPID">
              <span>{{ApiInfo.id}}</span>
            </el-form-item>
            <el-form-item label="SecretKey">
              <span>{{ApiInfo.secretKey}}</span>
            </el-form-item>
            <el-form-item label="异步回调地址" prop='callbackUrl'>
              <el-input type="text" v-model='ApiInfo.callbackUrl'></el-input>
            </el-form-item>
            <el-form-item size="large ">
              <el-button type="primary " :loading="submitapiLoading" @click="onSubmitApiInfo">提交保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { isvalidatephone, validateURL } from "@/utils/validate";
import {
  GetUser,
  userinfo,
  UpdateCallbackUrl,
  SendSmsCode,
  SubmitAcount
} from "@/api/account";
export default {
  name: "userinfo",
  data() {
    const validatephone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (!isvalidatephone(value)) {
        callback(new Error("请输入正确的手机号，如：15071314242"));
      } else {
        callback();
      }
    };
    const validatesettlaccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入收款账户"));
      } else {
        callback();
      }
    };
    const validatename = (rule, value, callback) => {
      if (!value) {
        callback(new Error("收款人姓名不能为空"));
      } else {
        callback();
      }
    };
    const validateinstitution = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择机构名称"));
      } else {
        callback();
      }
    };
    const validatecallbackUrl = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入回调地址"));
      } else if (!validateURL(value)) {
        callback(new Error("请输入正确的回调地址，如：http://www.baidu.com"));
      } else {
        callback();
      }
    };
    return {
      activeName: "account",
      sendCodeLoading: false,
      submitaccountLoading: false,
      submitapiLoading: false,
      showsubmit: true,
      showAccountName: false,
      phoneNumberConfirmed: true,
      loading: false,
      acountInfForm: {
        userName: null,
        balance: null,
        email: null,
        phoneNumber: null,
        code: null,
        selectAcount: null,
        settlementAccount: [],
        institution: null,
        account: null,
        name: null,
        accountBank: null
      },
      acountInfFormRules: {
        account: [
          {
            required: true,
            validator: validatesettlaccount
          }
        ],
        institution: [
          {
            required: true,
            validator: validateinstitution
          }
        ],
        name: [
          {
            required: true,
            validator: validatename
          }
        ],
        phoneNumber: [
          {
            required: true,
            validator: validatephone
          }
        ]
      },
      ApiInfoRule: {
        callbackUrl: [
          {
            required: true,
            validator: validatecallbackUrl
          }
        ]
      },
      // sendMsg: '发送短信验证码',
      sendAuthCode: true /* 布尔值，通过v-show控制显示‘获取按钮’还是‘倒计时’ */,
      auth_time: 0 /* 倒计时 计数器*/,
      value: false,
      institutions: [
        { value: "支付宝" },
        { value: "中国银行" },
        { value: "中国工商银行" },
        { value: "中国农业银行" },
        { value: "中国建设银行" },
        { value: "中国进出口银行" },
        { value: "中国农业发展银行" },
        { value: "国家开发银行" },
        { value: "中国光大银行" },
        { value: "中国民生银行" },
        { value: "广发银行" },
        { value: "平安银行" },
        { value: "中信银行" },
        { value: "恒丰银行" },
        { value: "交通银行" },
        { value: "招商银行" },
        { value: "浙商银行" },
        { value: "兴业银行" },
        { value: "上海浦东发展银行" },
        { value: "城市商业银行" },
        { value: "农村商业银行" },
        { value: "农村信用社" },
        { value: "邮政储蓄银行" },
        { value: "渤海银行" },
        { value: "徽商银行" },
        { value: "村镇银行" },
        { value: "重庆三峡银行" },
        { value: "农村合作银行" },
        { value: "城市信用社" },
        { value: "花旗银行" },
        { value: "汇丰银行" },
        { value: "恒生银行" },
        { value: "上海农村商业银行" },
        { value: "永亨银行" },
        { value: "渣打银行" },
        { value: "上海银行" },
        { value: "东亚银行" },
        { value: "星展银行" },
        { value: "创兴银行" },
        { value: "永隆银行" },
        { value: "大新银行" },
        { value: "首都银行" },
        { value: "中央结算公司" },
        { value: "厦门国际银行" },
        { value: "民营银行" },
        { value: "盘谷银行" },
        { value: "澳新银行" },
        { value: "国泰世华" }
      ],
      ApiInfo: {
        id: null,
        secretKey: null,
        callbackUrl: null
      }
    };
  },
  created() {
    this.getacountInfData();
  },
  methods: {
    // 获取账号信息
    getacountInfData() {
      GetUser().then(res => {
        if (res.code === 0) {
          this.acountInfForm = res.data.userinfoData;
          if (res.data.apiInfo !== undefined) {
            this.ApiInfo = res.data.apiInfo;
          }
          // this.acountInfForm.name =
          //   this.acountInfForm.realName == null ||
          //   this.acountInfForm.realName === undefined
          //     ? this.acountInfForm.userName
          //     : this.acountInfForm.realName;
          // this.showsubmit =
          //   this.acountInfForm.settlementAccount == null ||
          //   this.acountInfForm.settlementAccount.length < 1;
          // if (
          //   this.acountInfForm.settlementAccount != null &&
          //   this.acountInfForm.settlementAccount.length > 0
          // ) {
          //   this.acountInfForm.showSettlementAccount = true;
          //   this.acountInfForm.selectAcount = this.acountInfForm.settlementAccount[0];
          // }
        }
      });
    },
    // 发送短信验证码
    sendCode() {
      this.sendCodeLoading = true;
      if (this.acountInfForm.phoneNumber) {
        if (isvalidatephone(this.acountInfForm.phoneNumber)) {
          SendSmsCode(this.acountInfForm.phoneNumber).then(res => {
            console.log(res);
            if (res.code === 0) {
              this.value = true;
              this.$message.success("短信发送成功，请查看");
              this.sendAuthCode = false;
              this.auth_time = 60;
              var auth_timetimer = setInterval(() => {
                this.auth_time--;
                if (this.auth_time <= 0) {
                  this.sendAuthCode = true;
                  clearInterval(auth_timetimer);
                }
              }, 1000);
            }
            this.sendCodeLoading = false;
          });
        } else {
          this.$message.error("请输入正确的手机号，如：15071314242");
          this.sendCodeLoading = false;
        }
      } else {
        this.$message.error("手机号不能为空");
        this.sendCodeLoading = false;
      }
    },

    // 提交提现账号
    onSubmitacountInfForm() {
      this.$refs.acountInfForm.validate(valid => {
        if (valid) {
          this.submitaccountLoading = true;
          var data = {
            account: this.acountInfForm.account,
            institution: this.acountInfForm.institution,
            accountBank: this.acountInfForm.accountBank,
            phone: this.acountInfForm.phoneNumber
          };
          SubmitAcount(data).then(res => {
            if (res.code === 0) {
              this.$message.success(res.msg);
              this.showsubmit = false;
              this.phoneNumberConfirmed = false;
            } else {
              this.$message.error(res.msg);
            }
            this.submitaccountLoading = false;
          });
        }
      });
    },
    // 判断用户是否有API权限
    onSubmitApiInfo() {
      this.$refs.ApiInfo.validate(valid => {
        if (valid) {
          this.submitapiLoading = true;
          UpdateCallbackUrl(this.ApiInfo.callbackUrl).then(res => {
            if (res.code === 0) {
              this.$message.success(res.msg);
              this.submitapiLoading = false;
            } else {
              this.$message.error(res.msg);
              this.submitapiLoading = false;
            }
          });
        } else {
          this.submitapiLoading = false;
        }
      });
    }
  }
};
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
.el-select {
  width: 400px;
}
.el-col-24 {
  width: auto;
}
.el-form-item__label {
  text-align: left !important;
}
.APIInf {
  margin-top: 20px;
}
.userinfo .msgCode,
.msgtime {
  width: 120px;
}
.acountInf {
  padding-top: 20px;
}
.acountInf .el-input__inner {
  text-align: center !important;

  width: 300px;
}
</style>
<style>
/* .el-input__inner{
  width: 400px;
} */
.el-col .el-input__inner {
  width: auto;
}
.msgCode .el-input__inner {
  width: 120px;
}
</style>
