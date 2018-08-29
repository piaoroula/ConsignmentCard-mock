<template>
  <el-card class='box-card' v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
    <div slot='header' class='clearfix box-card-header'>
      <span>申请提现</span>
    </div>
    <el-form ref='form' :model='info' label-width='100px'>
      <el-form-item label='账户余额'>
        <el-tag>{{info.balance}} 元</el-tag>
      </el-form-item>
      <el-form-item label='提现金额'>
        <el-input class="box-card-input" v-model="balance" width="100px" placeholder="请输入提现金额"></el-input>
        <el-button type="text" class='box-card-balance' @click="getAllBalance">
          <i class="el-icon-caret-right
"></i> 全部提现</el-button>

      </el-form-item>
      <el-form-item label='收款账号'>
        <el-select v-model='info.selectAccount' placeholder='请选择收款账号' class='box-card-settlementaccounts'>
          <el-option v-for="accont in info.settlementaccounts" :key="accont.id" :value="accont.id" :label="accont.account">
            <span style="float: left">{{ accont.account }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ accont.institution }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' :loading="submitLoading" @click='onSubmit'>申请提现</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import { getSettlement, settlement } from "@/api/finance";
export default {
  name: "settlement",
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      submitLoading: false,
      info: {
        balance: 0,
        selectAccount: "",
        settlementaccounts: []
      },
      balance: 0,
      loading: false
    };
  },
  created() {
    this.getinfo();
  },
  methods: {
    //获取信息
    getinfo() {
      this.loading = true;
      getSettlement().then(res => {
        console.log(res);
        if (res.code == 0) {
          this.loading = false;
          this.info = res.data.infoData;
          this.info.settlementaccounts = res.data.settlementAccounts;
        }
      });
    },
    //全部提现按钮
    getAllBalance() {
      if (this.info.balance < 500) {
        this.$message.error("提现金额小于500，不可提现");
      } else if (this.info.balance > 5000) {
        this.$message.error("提现金额大于5000，请分批提现");
      } else {
        this.balance = this.info.balance;
      }
    },
    //申请提现
    onSubmit() {
      this.submitLoading = true;
      var data = {
        balance: this.balance,
        selectAccount: this.info.selectAccount
      };
      if (this.balance < 500) {
        this.$message.error("提现金额小于500，不可提现");
      } else if (this.balance > 5000) {
        this.$message.error("提现金额大于5000，请分批提现");
      } else if (this.balance > this.info.balance) {
        this.$message.error("账户余额不足，请重新填写提现金额");
      } else if (this.info.selectAccount == undefined) {
        this.$message.error("请选择收款账号");
      } else {
        settlement(data).then(res => {
          if (res.code == 0) {
            this.info.selectAccount = null;
            this.info.balance -= this.balance;
            this.balance = 0;
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
      this.submitLoading = false;
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.box-card {
  width: 98%;
  margin: 15px;
  &-header {
    width: 100%;
    color: #858585;
  }
  &-balance {
    margin-left: 10px;
  }
  &-settlementaccounts {
    width: 500px;
  }
  &-input {
    width: 200px;
  }
}
</style>