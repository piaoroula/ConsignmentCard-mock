<template>
  <div class="dashboard-container background record">
    <el-form :inline="true" :model="recordSearchForm" class="recordSearch-form-inline">
      <el-form-item label="寄售通道">
        <el-select v-model="recordSearchForm.ChannelId" filterable clearable placeholder="请选择寄售通道" @change='selectChannels'>
          <el-option v-for="channel in ChannelList" :key="channel.id" :label="channel.name" :value="channel.id">
            <span style="float: left">{{ channel.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ channel.buyRate }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="recordSearchForm.FaceValueId" clearable placeholder="请先选择卡面值">
          <el-option v-for='FaceValueIds in FaceValueList' :value="FaceValueIds.id" :key="FaceValueIds.id" :label="FaceValueIds.faceValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡状态">
        <el-select v-model="recordSearchForm.useState" clearable placeholder="请选择卡状态">
          <el-option v-for='UseStates in UseStateList' :value="UseStates.id" :key="UseStates.id" :label="UseStates.state"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker v-model="recordSearchForm.times" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="卡号">
        <el-input v-model="recordSearchForm.CardNumber" type="text" placeholder="完全匹配的卡号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchChannelData">查询</el-button>
        <el-button type="success" @click="reportExcel">导出Excel</el-button>
        <el-button @click="resetRecordSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="numbers" class="recordSearch-form-inline showCount-form-inline">
      <el-form-item>
        <el-button size="mini" type="info" @click="searchStatistics(0)">
          <i class="el-icon-refresh"></i>&nbsp;面值不符：{{numbers.inconformityCount}} 张</el-button>
        <el-button size="mini" type="success" @click="searchStatistics(3)">
          <i class="el-icon-refresh"></i>&nbsp;成功：{{numbers.successCount}} 张</el-button>
        <el-button size="mini" type="danger" @click="searchStatistics(4)">
          <i class="el-icon-refresh"></i>&nbsp;失败：{{numbers.failCount}} 张</el-button>
        <el-button size="mini" type="primary" @click="searchStatistics(1)">
          <i class="el-icon-refresh"></i>&nbsp;处理中：{{numbers.processCount}} 张</el-button>
      </el-form-item>
      <el-form-item>
        <el-tag type="info">寄售总面值： {{numbers.faceValueTotal}} 元</el-tag>
        <el-tag type="info">结算总面值： {{numbers.settlementFaceValueTotal}} 元</el-tag>
        <el-tag type="info">结算总金额： {{numbers.settlementAmountTotal}} 元</el-tag>
      </el-form-item>
    </el-form>
    <el-table :row-class-name="tableRowClassName" :data="channelData" :border='border' style="width: 100%" :empty-text='emptytext' :header-cell-style="getRowClass" v-loading='loading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" ref="multipleTable" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop='cardNumber' label="卡号" align="center" width="170"> </el-table-column>
      <el-table-column prop='name' label="卡类型" align="center" width="120">
      </el-table-column>
      <el-table-column prop='faceValue' label="寄售面值" align="center" width="80">
      </el-table-column>
      <el-table-column prop='settlementFaceValue' label="结算面值" align="center" width="80">
      </el-table-column>
      <el-table-column prop='settlementAmount' label="结算金额" align="center" width="80">
      </el-table-column>
      <el-table-column prop='useState' label="寄售状态" align="center" width="80">
        <template slot-scope='scope'>
          <el-tag v-if="scope.row.useState==0" v-model="scope.row.useState" type='info'>待处理</el-tag>
          <el-tag v-if="scope.row.useState==2" v-model="scope.row.useState">处理中</el-tag>
          <el-tag v-if="scope.row.useState==3" v-model="scope.row.useState" type='success'>成功</el-tag>
          <el-tag v-if="scope.row.useState==4" v-model="scope.row.useState" type='danger'>失败</el-tag>
          <el-tag v-if="scope.row.useState==5" v-model="scope.row.useState" type='danger'>可疑</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="耗时" align="center" width="80">
        <template slot-scope='scope'>
          {{ ((scope.row.callbackTime != undefined && scope.row.addTime != undefined)? (new Date(scope.row.callbackTime).getTime() - new Date(scope.row.addTime).getTime()) / 1000:"-") }}
        </template>
      </el-table-column>
      <el-table-column prop='addTime' label="寄售时间" align="center" width="155">
      </el-table-column>
      <el-table-column prop='callbackTime' label="完成时间" align="center" width="155">
      </el-table-column>
      <el-table-column prop='remark' label="备注" align="center">
      </el-table-column>
    </el-table>
    <div class="box-card-pagination">
      <el-button type="primary" size="small" @click="batcheditCardState()" :loading="loadingAnginConsignment">将选中卡密重新寄售</el-button>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 40, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import moment from "moment";
// import {
//   GetChannels,
//   getFaceValues,
//   submitConsignment,
//   GetRecords,
//   getStatistics,
//   getAllRecords,
//   againConsignment
// } from '@/api/card'
// import selecttime from "@/data/selecttime";

export default {
  name: "record",
  data() {
    return {
      loadingAnginConsignment: false,
      pickerOptions2: {
        shortcuts: []
      },
      loading: false,
      emptytext: "暂时没有数据",
      channelData: [
        {
          id: 1,
          cardNumber: 123,
          name: "",
          faceValue: "",
          settlementFaceValue: "",
          settlementAmount: "",
          addTime: "",
          useState: 0,
          remark: ""
        }
      ],
      numbers: {},
      multipleSelection: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      recordSearchForm: {
        ChannelId: null,
        beginTime: null,
        endTime: null,
        FaceValueId: null,
        useState: null,
        statisticsState: null,
        CardNumber: null,
        times: [],
        limit: 10,
        page: 1
      },
      ChannelList: [
        {
          id: "",
          name: ""
        }
      ],
      FaceValueList: [
        {
          id: "",
          faceValue: ""
        }
      ],
      UseStateList: [
        {
          id: 2,
          state: "处理中"
        },
        {
          id: 3,
          state: "成功"
        },
        {
          id: 4,
          state: "失败"
        },
        {
          id: 5,
          state: "可疑"
        }
      ],
      border: true
    };
  },
  created() {
    this.pickerOptions2.shortcuts = selecttime.shortcuts;
    // 初始化起始时间和当前时间
    this.recordSearchForm.times = [
      new Date().setHours(0, 0, 0),
      new Date().setHours(0, 0, 0) + 86398999
    ];
    this.resetRecordSearch.CardNumber = this.$route.params.cardNumber;
    this.getchannelData(this.pageSize, this.currentPage);
    this.getChannelList();
    this.statistics();
  },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.useState === 4) {
        return "failed-row";
      }
      return "";
    },
    handleSelectionChange(selection) {
      var newSelection = [];
      selection.forEach(row => {
        if (row.useState !== 4) {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        } else {
          newSelection.push(row);
        }
      });
      this.multipleSelection = newSelection;
    },
    // 批量提交修改的寄售状态
    batcheditCardState(rows) {
      if (this.multipleSelection.length > 0) {
        let flag = false;
        const ids = [];
        this.multipleSelection.forEach(row => {
          if (row.useState !== 4) {
            flag = true;
          }
          ids.push(row.id);
        });
        if (flag) {
          this.$message.error("批量重新寄售时，寄售状态只能是失败！");
        } else {
          if (ids.length < 1) {
            this.$message.error("批量重新寄售时，请至少选择一个寄售详情！");
          } else {
            this.loadingAnginConsignment = true;
            againConsignment(ids).then(res => {
              if (res.code === 0) {
                this.$message.success("重新寄售成功");
                this.searchChannelData();
              } else {
                this.$message.error("重新寄售失败");
              }
              this.loadingAnginConsignment = false;
            });
          }
        }
      }
    },
    // 查询统计数据
    searchStatistics(type) {
      this.recordSearchForm.statisticsState = null;
      this.recordSearchForm.useState = null;
      if (type === 0 || type === 1) {
        this.recordSearchForm.statisticsState = type;
      }
      if (type === 3 || type === 4) {
        this.recordSearchForm.useState = type;
      }
      this.searchChannelData();
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },

    // 获取卡类型
    getChannelList() {
      GetChannels().then(res => {
        if (res.code === 0) {
          this.ChannelList = res.data;
        } else {
          this.$message.error("获取寄售通道失败");
        }
      });
    },
    // 通过获取选择的寄售通道的id值，获取卡面值列表
    selectChannels(vId) {
      getFaceValues(vId).then(res => {
        if (res.code === 0) {
          this.FaceValueList = res.data;
        } else {
          this.$message.error("获取卡面值失败");
        }
      });
    },

    // 获取寄售记录
    getchannelData() {
      this.recordSearchForm.beginTime = moment(
        this.recordSearchForm.times[0]
      ).format("YYYY-MM-DD HH:mm:ss");
      this.recordSearchForm.endTime = moment(
        this.recordSearchForm.times[1]
      ).format("YYYY-MM-DD HH:mm:ss");
      GetRecords(this.recordSearchForm).then(res => {
        this.loading = true;
        if (res.code === 0) {
          this.channelData = res.data;
          this.total = res.count;
          this.loading = false;
          this.channelData.forEach((row, index) => {
            row.userTime = null;
            if (row.callbackTime !== undefined && row.addTime !== undefined) {
              row.userTime =
                (new Date(row.callbackTime).getTime() -
                  new Date(row.addTime).getTime()) /
                1000;
            }
          });
        } else {
          this.loading = false;
          this.channelData = [];
          this.emptytext = "暂时没有数据";
        }
      });
    },
    // 查询
    searchChannelData() {
      this.loading = true;
      this.recordSearchForm.beginTime = moment(
        this.recordSearchForm.times[0]
      ).format("YYYY-MM-DD HH:mm:ss");
      this.recordSearchForm.endTime = moment(
        this.recordSearchForm.times[1]
      ).format("YYYY-MM-DD HH:mm:ss");
      this.recordSearchForm.page = 1;
      GetRecords(this.recordSearchForm).then(res => {
        if (res.code === 0) {
          this.channelData = res.data;
          this.total = res.count;
          this.loading = false;
          this.channelData.forEach((row, index) => {
            // row.useStateName = this.GetState(row.useState);
            row.userTime = null;
            if (row.callbackTime !== undefined && row.addTime !== undefined) {
              row.userTime =
                (new Date(row.callbackTime).getTime() -
                  new Date(row.addTime).getTime()) /
                1000;
            }
          });
        } else {
          this.loading = false;
          this.channelData = [];
          this.emptytext = "没有符合条件的数据";
          this.total = 0;
        }
      });
      this.statistics();
    },
    reportExcel() {
      this.recordSearchForm.beginTime = moment(
        this.recordSearchForm.times[0]
      ).format("YYYY-MM-DD HH:mm:ss");
      this.recordSearchForm.endTime = moment(
        this.recordSearchForm.times[1]
      ).format("YYYY-MM-DD HH:mm:ss");
      this.recordSearchForm.page = 1;
      var data = this.recordSearchForm;
      getAllRecords(data).then(response => {
        if (response.code === 0) {
          const downloadElement = document.createElement("a");
          downloadElement.href = response.data;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement); // 下载完成移除元素
        } else {
          this.$message.error("导出数据失败！");
        }
      });
    },
    // 重置搜索
    resetRecordSearch() {
      this.recordSearchForm = {};
      this.recordSearchForm.times = [
        new Date().setHours(0, 0, 0),
        new Date().setHours(0, 0, 0) + 86398999
      ];
    },
    // 分页
    handleSizeChange(val) {
      this.recordSearchForm.limit = val;
      this.pageSize = val;
      this.getchannelData(this.pageSize, this.currentPage);
    },
    handleCurrentChange(val) {
      this.recordSearchForm.page = val;
      this.currentPage = val;
      this.getchannelData(this.currentPage, this.pageSize);
    },
    statistics() {
      this.recordSearchForm.beginTime = moment(
        this.recordSearchForm.times[0]
      ).format("YYYY-MM-DD HH:mm:ss");
      this.recordSearchForm.endTime = moment(
        this.recordSearchForm.times[1]
      ).format("YYYY-MM-DD HH:mm:ss");
      getStatistics(this.recordSearchForm).then(res => {
        if (res.code === 0) {
          this.numbers = res.data;
        }
      });
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
    float: none !important;
    padding: 0px !important;
    margin-top: 18px;
    height: 36px;
  }
}
</style>
<style>
.showCount-form-inline .el-tag--medium {
  margin-right: 20px;
}
.el-pagination {
  float: right;
}
.el-table .failed-row {
  background-color: rgba(245, 108, 108, 0.1);
}
</style>
