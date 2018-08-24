<template>
  <div class="dashboard-container background record">
    <el-form :inline="true" :model="recordSearchForm" class="recordSearch-form-inline" ref="recordSearchForm">
      <el-form-item label="卡类型">
        <el-select v-model="recordSearchForm.ChannelId" filterable clearable placeholder="请选择卡类型" @change='selectChannels'>
          <el-option v-for="channel in ChannelList" :key="channel.id" :label="channel.name" :value="channel.name">
            <span style="float: left">{{ channel.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ channel.buyRate }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="recordSearchForm.FaceValueId" clearable placeholder="请先选择卡类型">
          <el-option v-for='FaceValueIds in FaceValueList' :value="FaceValueIds.faceValue" :key="FaceValueIds.id" :label="FaceValueIds.faceValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="寄售状态">
        <el-select v-model="recordSearchForm.useState" clearable placeholder="请选择寄售状态">
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
        <el-button @click="resetRecordSearch(recordSearchForm)">重置</el-button>
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
        <template slot-scope="scope">
          {{(scope.row.name)}}
        </template>
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
          <el-tag v-if="scope.row.useState==1" v-model="scope.row.useState">已取出</el-tag>
          <el-tag v-if="scope.row.useState==2" v-model="scope.row.useState">处理中</el-tag>
          <el-tag v-if="scope.row.useState==3" v-model="scope.row.useState" type='success'>成功</el-tag>
          <el-tag v-if="scope.row.useState==4" v-model="scope.row.useState" type='danger'>失败</el-tag>
          <el-tag v-if="scope.row.useState==5" v-model="scope.row.useState" type='danger'>可疑</el-tag>
          <el-tag v-if="scope.row.useState==6" v-model="scope.row.useState" type='danger'>可疑核查中</el-tag>
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
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="recordSearchForm.page" :page-sizes="[10, 20, 40, 50]" :page-size="recordSearchForm.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import { parseTime } from "@/utils";
import {
  GetChannels,
  getFaceValues,
  submitConsignment,
  GetRecords,
  getStatistics,
  getAllRecords,
  againConsignment
} from "@/api/card";
import selecttime from "@/data/selecttime";

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
      numbers: {
        successCount: 0
      },
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
          id: 0,
          name: "移动充值卡"
        },
        {
          id: 1,
          name: "联通充值卡"
        },
        {
          id: 2,
          name: "电信全国充值卡"
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
    // this.resetRecordSearch.CardNumber = this.$route.params.cardNumber;
    this.getChannelList();
    this.getRecordList();
  },

  methods: {
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    //获取卡类型
    getChannelList() {
      GetChannels().then(res => {
        if (res.code === 0) {
          this.ChannelList = res.data;
        } else {
          this.$message.error("获取卡类型数据失败");
        }
      });
    },
    //获取卡面值，通过卡类型的id获取对应的卡面值
    selectChannels(vName) {
      // 通过卡name对应卡ID
      let obj = {};
      obj = this.ChannelList.find(item => {
        return item.name === vName;
      });
      getFaceValues({ cid: obj.id }).then(res => {
        if (res.code === 0) {
          if (res.data != undefined) {
            this.FaceValueList = res.data;
          } else {
            this.FaceValueList = [];
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取寄售详情列表
    getRecordList() {
      this.loading = true;
      this.recordSearchForm.times[0] = moment(
        this.recordSearchForm.times[0]
      ).format("YYYY-MM-DD HH:mm:ss");
      this.recordSearchForm.times[1] = moment(
        this.recordSearchForm.times[1]
      ).format("YYYY-MM-DD HH:mm:ss");
      var data = {
        name: this.recordSearchForm.ChannelId,
        beginTime: this.recordSearchForm.times[0],
        endTime: this.recordSearchForm.times[1],
        FaceValueId: this.recordSearchForm.FaceValueId,
        useState: this.recordSearchForm.useState,
        statisticsState: this.recordSearchForm.statisticsState,
        CardNumber: this.recordSearchForm.CardNumber,
        limit: this.recordSearchForm.limit,
        page: this.recordSearchForm.page
      };
      GetRecords(data).then(res => {
        if (res.code == 0) {
          if (res.total > 0) {
            console.log(res.data);
            this.channelData = res.items;
            this.numbers = res.data;
            this.channelData.forEach(item => {
              item.addTime = moment(item.addTime).format("YYYY-MM-DD HH:mm:ss");
            });

            this.total = res.total;
            this.loading = false;
          } else {
            this.channelData = [];
            this.total = 0;
            this.loading = false;
            this.emptytext = "暂无数据";
          }
        }
      });
    },

    //查询
    searchChannelData() {
      this.getRecordList();
    },
    //导出excel，功能还未完善
    reportExcel() {
      this.loading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "卡号",
          "卡类型",
          "寄售面值",
          "结算面值",
          "结算金额",
          "寄售状态",
          "耗时",
          "寄售时间",
          "完成时间",
          "备注"
        ];
        const filterVal = ["name", "faceValue", "addTime", "CardNumber"];
        const list = this.channelData;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel(tHeader, data, "table-list");
        this.loading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "addTime") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    //重置
    resetRecordSearch(recordSearchForm) {
      this.recordSearchForm = {};
      this.recordSearchForm.times = [
        new Date().setHours(0, 0, 0),
        new Date().setHours(0, 0, 0) + 86398999
      ];
      this.$message.success("重置成功");
    },

    // //计算面值不符，3=>成功，4=>失败,2=>处理中的张数
    // getCount() {
    //   this.recordSearchForm.times[0] = moment(
    //     this.recordSearchForm.times[0]
    //   ).format("YYYY-MM-DD HH:mm:ss");
    //   this.recordSearchForm.times[1] = moment(
    //     this.recordSearchForm.times[1]
    //   ).format("YYYY-MM-DD HH:mm:ss");
    //   var data = {
    //     name: this.recordSearchForm.ChannelId,
    //     beginTime: this.recordSearchForm.times[0],
    //     endTime: this.recordSearchForm.times[1],
    //     FaceValueId: this.recordSearchForm.FaceValueId,
    //     useState: this.recordSearchForm.useState,
    //     statisticsState: this.recordSearchForm.statisticsState,
    //     CardNumber: this.recordSearchForm.CardNumber,
    //     limit: this.recordSearchForm.limit,
    //     page: this.recordSearchForm.page
    //   };
    //   getStatistics(data).then(res => {
    //     if (res.code == 0) {
    //       this.numbers = res.data;
    //       this.total = res.total;
    //     }
    //   });
    // },
    //通过指定 Table 组件的 row-class-name 属性来为 Table 中的某一行添加 class，表明该行处于某种状态
    tableRowClassName({ row, rowIndex }) {
      if (row.useState === 4) {
        return "failed-row";
      }
      return "";
    },
    //重新寄售
    batcheditCardState(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页
    handleSizeChange(val) {
      this.recordSearchForm.limit = val;
      this.getRecordList();
    },
    handleCurrentChange(val) {
      this.recordSearchForm.page = val;
      this.getRecordList();
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
