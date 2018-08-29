<template>
  <div class="dashboard-container background record">
    <el-form :inline="true" :model="searchInfo" class="recordSearch-form-inline">
      <el-form-item label="产品ID">
        <el-input v-model="searchInfo.productId" type="text" placeholder="产品ID"></el-input>
      </el-form-item>
      <el-form-item label="订单ID">
        <el-input v-model="searchInfo.id" type="text" placeholder="订单ID"></el-input>
      </el-form-item>
      <el-form-item label="用户ID/姓名">
        <el-input v-model="searchInfo.userIDOrName" type="text" placeholder="用户ID/姓名"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="searchInfo.state" clearable placeholder="请选择订单状态">
          <el-option v-for='state in stateList' :value="state.id" :key="state.id" :label="state.state"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker v-model="searchInfo.times" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">查询</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" :border='true' style="width: 100%" :empty-text='emptytext' :header-cell-style="getRowClass" v-loading='loading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column prop='id' label="卡号" align="center" width="80"> </el-table-column>
      <el-table-column prop='name' label="产品名称" align="center" width="170"> </el-table-column>
      <el-table-column prop='targetMoney' label="目标金额" align="center" width="100">
        <template slot-scope="scope">
          <el-popover trigger="click" placement="top">
            <p>订单单价（结算价）: {{ scope.row.unitPrice }}</p>
            <p>订单数量: {{ scope.row.orderNumber }}</p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.targetMoney }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop='completionMoney' label="完成金额" align="center" width="100">
      </el-table-column>
      <el-table-column prop='state' label="状态" align="center" width="80">
        <template slot-scope='scope'>
          <el-tag v-if="scope.row.state==1" v-model="scope.row.state" type='info'>失效</el-tag>
          <el-tag v-if="scope.row.state==2" v-model="scope.row.state">处理中</el-tag>
          <el-tag v-if="scope.row.state==3" v-model="scope.row.state" type='success'>成功</el-tag>
          <el-tag v-if="scope.row.state==4" v-model="scope.row.state" type='danger'>失败</el-tag>
          <el-tag v-if="scope.row.state==5" v-model="scope.row.state" type='danger'>可疑</el-tag>
          <el-tag v-if="scope.row.state==6" v-model="scope.row.state" type='danger'>可疑核查</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop='account' label="充值账号" align="center" width="140">
      </el-table-column>
      <el-table-column prop='addTime' label="创建时间" align="center" width="160">
        <template slot-scope="scope">
          <el-popover trigger="click" placement="top">
            <p>完成时间: {{ scope.row.finishedTime }}</p>
            <p>有效期: {{ scope.row.periodOfValidity }}</p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.addTime }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop='remark' label="备注" align="center">
      </el-table-column>
      <el-table-column label='操作' align="center" width='150px' fixed="right">
        <template slot-scope='scope'>
          <el-dropdown :hide-on-click="false" trigger="click" style="cursor:pointer">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="showInfo(scope.row)">订单详细</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.state!=6">
                <span @click="handleUpdateState(scope.row, scope.$index)">修改状态</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.state!=6">
                <span @click="handleUpdatePriority(scope.row, scope.$index)">修改优先级</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="box-card-pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.searchInfo.page" :page-sizes="[10, 20, 40, 50]" :page-size="this.searchInfo.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="订单信息" :visible.sync="showInfoVisible" label-width="140px">
      <el-form ref="form" :model="formInfo" label-width="140px" style="height:550px; overflow-y: auto">
        <el-form-item label="订单编号">
          {{formInfo.id}}
        </el-form-item>
        <el-form-item label="产品名称">
          {{formInfo.name}}
        </el-form-item>
        <el-form-item label="状态">
          {{getState(formInfo.state)}}
        </el-form-item>
        <el-form-item label="优先级">
          {{getState(formInfo.priority)}}
        </el-form-item>
        <el-form-item label="基础单价">
          {{formInfo.unitPrice}}
        </el-form-item>
        <el-form-item label="订单数量">
          {{formInfo.orderNumber}}
        </el-form-item>
        <el-form-item label="目标金额">
          {{formInfo.targetMoney}}
        </el-form-item>
        <el-form-item label="完成金额">
          {{formInfo.completionMoney}}
        </el-form-item>
        <el-form-item label="创建日期">
          {{formInfo.addTime}}
        </el-form-item>
        <el-form-item label="有效期">
          {{formInfo.periodOfValidity}}
        </el-form-item>
        <el-form-item label="订单附加信息模板">
          <el-table :data="formInfo.additionInfo" style="width: 100%">
            <el-table-column type="index" label="编号" align="center" :index="indexMethod" width="50px"></el-table-column>
            <el-table-column label="Key" prop="key" align="center" width="120">
            </el-table-column>
            <el-table-column align="center" prop="value" label="Value"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="描述">
          {{formInfo.remark}}
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改订单状态" :visible.sync="editStateVisible" label-width="140px">
      <el-form ref="form" :model="formInfo" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="formInfo.state">
            <el-radio v-for="state in stateList" :key="state.id" :label="state.id" :value="state.id">{{state.state}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editState" :loading="editStateLoading">提交</el-button>
          <el-button @click="editStateVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="修改订单优先级" :visible.sync="editPriorityVisible" label-width="140px">
      <el-form ref="form" :model="formInfo" label-width="80px">
        <el-form-item label="优先级">
          <el-input-number v-model="formInfo.priority" :min="1" :max="1000" label="优先级"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editPriority" :loading="editPriorityLoading">提交</el-button>
          <el-button @click="editPriorityVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import {
  getOrders,
  updateOrderState,
  updateOrderPriority
} from "@/api/product";
import selecttime from "@/data/selecttime";

export default {
  name: "orders",
  data() {
    return {
      pickerOptions2: {
        shortcuts: []
      },
      loading: false,
      emptytext: "暂时没有数据",
      tableData: [],
      total: 0,
      searchInfo: {
        id: null,
        productId: null,
        userIDOrName: null,
        beginTime: null,
        endTime: null,
        state: null,
        times: [],
        limit: 10,
        page: 1
      },
      formInfo: {},
      formStateInfo: {
        id: null,
        state: null
      },
      stateList: [
        { id: 1, state: "失效" },
        { id: 2, state: "处理中" },
        { id: 3, state: "成功" },
        { id: 4, state: "失败" },
        { id: 5, state: "可疑" },
        { id: 6, state: "可疑核查" }
      ],
      showInfoVisible: false,
      editStateVisible: false,
      editStateLoading: false,
      editPriorityLoading: false,
      editPriorityVisible: false
    };
  },
  created() {
    this.pickerOptions2.shortcuts = selecttime.shortcuts;
    // 初始化起始时间和当前时间
    this.searchInfo.times = [
      new Date().setHours(0, 0, 0),
      new Date().setHours(0, 0, 0) + 86398999
    ];
    this.searchInfo.productId = this.$route.params.productId;
    this.getList();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    closeOrder(row, index) {},
    getList() {
      this.searchInfo.beginTime = moment(this.searchInfo.times[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.searchInfo.endTime = moment(this.searchInfo.times[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      getOrders({
        id: this.searchInfo.id,
        productId: this.searchInfo.productId,
        userIDOrName: this.searchInfo.userIDOrName,
        beginTime: this.searchInfo.beginTime,
        endTime: this.searchInfo.endTime,
        state: this.searchInfo.state,
        limit: this.searchInfo.limit,
        page: this.searchInfo.page
      })
        .then(res => {
          this.loading = true;
          if (res.code == 0) {
            this.tableData = res.data;
            this.tableData.forEach((row, index) => {
              row.additionInfo = JSON.parse(row.additionInfo);
            });
            this.total = res.count;
            this.loading = false;
          } else {
            this.loading = false;
            this.tableData = [];
            this.emptytext = "暂时没有数据";
          }
        })
        .catch(() => {
          this.loading = false;
          this.tableData = [];
        });
    },
    // 查询
    searchData() {
      this.loading = true;
      this.searchInfo.page = 1;
      this.getList();
    },
    // 重置搜索
    resetSearch() {
      this.searchInfo = {
        id: null,
        productId: null,
        userIDOrName: null,
        beginTime: null,
        endTime: null,
        state: null,
        times: [
          new Date().setHours(0, 0, 0),
          new Date().setHours(0, 0, 0) + 86398999
        ],
        limit: 10,
        page: 1
      };
    },
    // 分页
    handleSizeChange(val) {
      this.searchInfo.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.searchInfo.page = val;
      this.getList();
    },
    handleUpdateState(row, index) {
      this.formInfo = { id: row.id, state: row.state };
      this.editStateVisible = true;
    },
    handleUpdatePriority(row, index) {
      this.formInfo = { id: row.id, priority: row.priority };
      this.editPriorityVisible = true;
    },
    editState() {
      this.editStateLoading = true;
      updateOrderState(this.formInfo)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              message: "修改订单状态成功",
              type: "success"
            });
          }
          this.getList();
          this.editStateLoading = false;
          this.editStateVisible = false;
        })
        .catch(() => {
          this.getList();
          this.editStateLoading = false;
        });
    },
    editPriority() {
      this.editPriorityLoading = true;
      updateOrderPriority({
        id: this.formInfo.id,
        priority: this.formInfo.priority
      })
        .then(res => {
          if (res.code == 0) {
            this.$message({
              message: "修改订单优先级成功",
              type: "success"
            });
          }
          this.getList();
          this.editPriorityLoading = false;
          this.editPriorityVisible = false;
        })
        .catch(() => {
          this.getList();
          this.editPriorityLoading = false;
        });
    },
    showInfo(row) {
      this.formInfo = row;
      this.showInfoVisible = true;
    },
    getState(val) {
      switch (val) {
        case 1:
          return "失效";
        case 2:
          return "处理中";
        case 3:
          return "成功";
        case 4:
          return "失败";
        case 5:
          return "可疑";
        case 6:
          return "可疑核查";
        default:
          return "";
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
    padding: 20px 15px 50px 15px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
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
<style>
.showCount-form-inline .el-tag--medium {
  margin-right: 20px;
}
</style>
