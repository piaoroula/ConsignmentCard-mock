<template>
  <el-card class="box-card">
    <div slot="header" class="box-card-header clearfix">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input placeholder='用户邮箱/用户名' v-model='formInline.userNameOrId' clearable></el-input>
        </el-form-item>
        <el-form-item label="提现状态">
          <el-select v-model="formInline.state" clearable placeholder="请选择提现状态">
            <el-option v-for="usestate in usestates" :key="usestate.id" :label="usestate.name" :value="usestate.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker v-model="formInline.times" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交查询</el-button>
          <el-button @click="onClear">重置</el-button>
        </el-form-item>
      </el-form>
      <el-tag type="success">成功提现金额： {{accounts}} 元</el-tag>
    </div>
    <el-table :data="tableData" :empty-text="emptytext" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column prop="id" align="center" label="编号" width="80px"></el-table-column>
      <el-table-column prop="realName" align="center" label="用户名" width="80px"> </el-table-column>
      <el-table-column prop="userName" align="center" label="邮箱" width="160px"> </el-table-column>
      <el-table-column prop="amount" align="center" label="提现金额" width="120px"> </el-table-column>
      <el-table-column prop="balance" align="center" label="当前账号金额" width="120px"> </el-table-column>
      <el-table-column prop="state" align="center" label="提现状态" width="100px">
        <template slot-scope='scope'>
          <el-tag v-if="scope.row.state==0" v-model="scope.row.state">待处理</el-tag>
          <el-tag v-if="scope.row.state==1" v-model="scope.row.state">处理中</el-tag>
          <el-tag v-if="scope.row.state==2" v-model="scope.row.state" type="success">成功</el-tag>
          <el-tag v-if="scope.row.state==3" v-model="scope.row.state" type="danger">失败</el-tag>
          <el-tag v-if="scope.row.state!=3&&scope.row.state!=2&&scope.row.state!=1&&scope.row.state!=0" v-model="scope.row.state" type="info">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="creationTime" align="center" label="申请时间" width="160px"> </el-table-column>
      <el-table-column prop="processTime" align="center" label="处理时间" width="160px"> </el-table-column>
      <el-table-column prop="remark" align="center" label="备注" width="280px"> </el-table-column>
      <el-table-column label='操作' width='150px' align='center' fixed='right'>
        <template slot-scope='scope'>
          <!-- <el-button-group>
            <el-button v-if="scope.row.state!=3&&scope.row.state!=2" type='success' size='mini' @click="openEditPages(scope.row, scope.$index)">修改提现状态</el-button>
            <el-button size='mini' type='primary' @click="openAccountPages(scope.row, scope.$index)">查看收款信息</el-button>
          </el-button-group> -->
          <el-dropdown :hide-on-click="false" trigger="click" style="cursor:pointer">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.state!=3&&scope.row.state!=2">
                <span @click="openEditPages(scope.row, scope.$index)">修改提现状态</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="openAccountPages(scope.row, scope.$index)">查看收款信息</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="box-card-pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formInline.page" :page-sizes="[10,20,30, 50]" :page-size="formInline.limit" layout="total, sizes, prev, pager, next, jumper" :total="formInline.total">
      </el-pagination>
    </div>
    <el-dialog title="修改提现状态" :visible.sync="editStateVisible" label-width="80px">
      <el-form ref="form" :model="formState" label-width="80px">
        <el-form-item label="提现状态">
          <el-radio-group v-model="updatestate">
            <el-radio v-for="state in editStates" :key="state.id" :label="state.id" :value="state.id">{{state.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="orderId" placeholder="请输入银行流水号或备注"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="editStateLoading" @click="editState">提交</el-button>
          <el-button @click="editStateVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="提现信息" :visible.sync="showAccountVisible" label-width="80px">
      <el-form ref="form" :model="formAccount" label-width="80px" class="showAccountInfo">
        <el-form-item label="收款人">
          {{formAccount.name}}
          <el-button type="text" class="tag-read" size="mini" v-clipboard:copy='formAccount.name' v-clipboard:success='clipboardSuccess' v-clipboard:error='clipboardError' v-if="formAccount.name!=null && formAccount.name!=undefined && formAccount.name!=''">
            <svg-icon icon-class="clipboard" /> 复制</el-button>
        </el-form-item>
        <el-form-item label="机构名称">
          {{formAccount.institution}}
          <el-button type="text" class="tag-read" size="mini" v-clipboard:copy='formAccount.institution' v-clipboard:success='clipboardSuccess' v-clipboard:error='clipboardError' v-if="formAccount.institution!=null && formAccount.institution!=undefined && formAccount.institution!=''">
            <svg-icon icon-class="clipboard" /> 复制</el-button>
        </el-form-item>
        <el-form-item label="开户行">
          {{formAccount.accountBank}}
          <el-button type="text" class="tag-read" size="mini" v-clipboard:copy='formAccount.accountBank' v-clipboard:success='clipboardSuccess' v-clipboard:error='clipboardError' v-if="formAccount.accountBank!=null && formAccount.accountBank!=undefined && formAccount.accountBank!=''">
            <svg-icon icon-class="clipboard" /> 复制</el-button>
        </el-form-item>
        <el-form-item label="收款账号">
          {{formAccount.account}}
          <el-button type="text" class="tag-read" size="mini" v-clipboard:copy='formAccount.account' v-clipboard:success='clipboardSuccess' v-clipboard:error='clipboardError' v-if="formAccount.account!=null && formAccount.account!=undefined && formAccount.account!=''">
            <svg-icon icon-class="clipboard" /> 复制</el-button>
        </el-form-item>
        <el-form-item label="提现金额">
          {{formAccount.amount}}
          <el-button type="text" class="tag-read" size="mini" v-clipboard:copy='formAccount.amount' v-clipboard:success='clipboardSuccess' v-clipboard:error='clipboardError' v-if="formAccount.amount!=null && formAccount.amount!=undefined && formAccount.amount!=''">
            <svg-icon icon-class="clipboard" /> 复制</el-button>
        </el-form-item>
        <el-form-item label="流水ID">
          {{formAccount.id}}
          <el-button type="text" class="tag-read" size="mini" v-clipboard:copy='formAccount.id' v-clipboard:success='clipboardSuccess' v-clipboard:error='clipboardError' v-if="formAccount.id!=null && formAccount.id!=undefined && formAccount.id!=''">
            <svg-icon icon-class="clipboard" /> 复制</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import clip from "@/utils/clipboard"; // use clipboard directly
import clipboard from "@/directive/clipboard/index.js"; // use clipboard by v-directive
import { mapGetters } from "vuex";
import {
  getSettlementPage,
  updateSettlementState,
  getSettlementAccount
} from "@/api/mSettlement";
import moment from "moment";
import selecttime from "@/data/selecttime";

export default {
  name: "settlements",
  directives: {
    clipboard
  },
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      accounts: null,
      editStateLoading: false,
      loading: false,
      pickerOptions2: {
        shortcuts: []
      },
      formInline: this.cerateForm(),
      updatestate: null,
      formState: {},
      editStates: [],
      orderId: null,
      orderText: null,
      formAccount: { name: null, account: null, institution: null },
      usestates: [
        { id: 0, name: "待处理" },
        { id: 1, name: "处理中" },
        { id: 2, name: "成功" },
        { id: 3, name: "失败" }
      ],
      tableData: [],
      editStateVisible: false,
      showAccountVisible: false,
      emptytext: "暂无数据"
    };
  },
  created() {
    this.pickerOptions2.shortcuts = selecttime.shortcuts;
    this.formInline.UserNameOrId = this.$route.params.userName;
    this.getlist();
    // this.getAccounts();
  },
  methods: {
    cerateForm() {
      return {
        state: null,
        userNameOrId: null,
        times: [
          new Date().setHours(0, 0, 0) - 24 * 60 * 60 * 1000,
          new Date().setHours(0, 0, 0) + 86398999
        ],
        page: 1,
        limit: 20,
        total: 0,
        endTime: null,
        startTime: null
      };
    },
    //每页显示的数目
    handleSizeChange(val) {
      this.formInline.limit = val;
      this.getlist();
    },
    //当前页
    handleCurrentChange(val) {
      this.formInline.page = val;
      this.getlist();
    },
    //获取提现审核数据
    getlist() {
      var data = {
        userNameOrId: this.formInline.userNameOrId,
        beginTime: moment(this.formInline.times[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endTime: moment(this.formInline.times[1]).format("YYYY-MM-DD HH:mm:ss"),
        state: this.formInline.state,
        page: this.formInline.page,
        limit: this.formInline.limit
      };
      getSettlementPage(data).then(res => {
        if (res.code == 0) {
          if (res.total > 0) {
            this.tableData = res.item;
            this.accounts = res.accounts;
            this.tableData.forEach(item => {
              item.creationTime = moment(item.creationTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              if (item.state != 0) {
                item.processTime = moment(item.processTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              }
            });
            this.formInline.total = res.total;
          } else {
            this.formInline.total = 0;
            this.accounts = 0;
            this.tableData = [];
          }
        }
      });
      this.loading = false;
    },
    //搜索
    onSubmit() {
      this.getlist();
      this.getAccounts();
    },
    //重置
    onClear() {
      this.formInline = {};
      this.formInline.times = [
        new Date().setHours(0, 0, 0) - 24 * 60 * 60 * 1000,
        new Date().setHours(0, 0, 0) + 86398999
      ];
    },
    //打开修改提现状态弹窗
    openEditPages(row, index) {
      this.editStateVisible = true;
      this.updatestate = null;
      this.formState = row;
      console.log(this.formState.processTime);
      console.log(new Date(new Date().getTime() - 1 * 60 * 60 * 1000));
      this.editStates = [];
      switch (row.state) {
        case 0:
          this.editStates.push({ id: 1, name: "处理中" });
          break;
        case 1:
          this.editStates.push(
            { id: 2, name: "成功" },
            { id: 3, name: "失败" }
          );
          break;
      }
    },
    //编辑保存提现状态
    editState() {
      this.editStateLoading = true;
      var data = {
        id: this.formState.id,
        state: this.updatestate,
        remark: this.orderId
      };
      if (this.updatestate != null || this.updatestate != undefined) {
        updateSettlementState(data).then(res => {
          if (res.code == 0) {
            this.editStateVisible = false;
            this.editStates = [];
            this.getlist();
            this.$message.success(res.msg);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error("请选择提现状态");
      }
      this.editStateLoading = false;
    },
    //查看收款信息
    openAccountPages(row, index) {
      this.showAccountVisible = true;
      getSettlementAccount(row.id).then(res => {
        if (res.code == 0) {
          this.formAccount = row;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    clipboardSuccess() {
      this.$message({
        message: "复制成功",
        type: "success",
        duration: 1500
      });
    },
    clipboardError() {
      this.$message({
        message: "复制失败，请手动复制",
        type: "error",
        duration: 1500
      });
    }
  }
};
</script>
<style>
.el-dialog {
  width: 450px;
  height: 300px;
  top: 25% !important;
  margin-top: 0px !important;
}
.el-dialog__body {
  padding: 10px 20px;
}
.showAccountInfo .el-form-item {
  margin-bottom: 0px;
}
.tag-read {
  margin-left: 10px;
}
.el-dropdown-link {
  width: 100%;
  display: block;
  padding: 3px 38px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.box-card {
  width: 98%;
  margin: 15px;
  &-header {
    width: 100%;
    color: #858585;
  }
  &-pagination {
    padding: 10px;
    float: right;
  }
}
</style>