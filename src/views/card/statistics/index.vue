<template>
  <div style='margin:20px;'>
    <div style='margin:20px;'></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="寄售面值分析" name="facevalue">
        <el-card class="box-card">
          <div slot="header" class="box-card-header clearfix">
            <el-form :inline="true" :model="profitFrom" class="demo-form-inline">
              <el-form-item label="日期范围">
                <el-date-picker v-model="profitFrom.times" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchprofitFrom">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table :data="list" style="width: 100%;padding-top: 15px;" border :span-method="objectSpanMethod" :header-cell-style="getRowClass" v-loading='loading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" show-summary :summary-method="getSummaries">
            <el-table-column label="通道名称" prop="channelName" align='center'></el-table-column>
            <el-table-column label="通道面值" prop="faceValue" align="center"></el-table-column>
            <el-table-column label="提交笔数" prop="total" align="center"></el-table-column>
            <el-table-column label="成功笔数" prop="successCount" align="center"></el-table-column>
            <el-table-column label="失败笔数" prop="failCount" align="center"></el-table-column>
            <el-table-column label="处理中笔数" prop="processCount" align="center"></el-table-column>
            <el-table-column label="可疑笔数" prop="doubtCount" align="center"></el-table-column>
            <el-table-column label="提交面值" prop="faceValueTotal" align="center"></el-table-column>
            <el-table-column label="结算面值" prop="settlementFaceValueTotal" align="center"></el-table-column>
            <el-table-column label="结算金额" prop="settlementAmountTotal" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="寄售用户分析" name="user" v-if="showU == true">
        <el-card class="box-card">
          <div slot="header" class="box-card-header clearfix">
            <el-form :inline="true" :model="profitFrom" class="demo-form-inline">
              <el-form-item label="日期范围">
                <el-date-picker v-model="profitFrom.times" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchUprofitFrom">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table :data="uList" style="width: 100%;padding-top: 15px;" border :span-method="objectSpanMethod" :header-cell-style="getRowClass" v-loading='uloading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" show-summary>
            <el-table-column label="寄售用户" prop="realName" align="center"></el-table-column>
            <el-table-column label="通道名称" prop="channelName" align='center'></el-table-column>
            <el-table-column label="提交笔数" prop="total" align="center" sortable></el-table-column>
            <el-table-column label="成功笔数" prop="successCount" align="center"></el-table-column>
            <el-table-column label="失败笔数" prop="failCount" align="center"></el-table-column>
            <el-table-column label="处理中笔数" prop="processCount" align="center"></el-table-column>
            <el-table-column label="可疑笔数" prop="doubtCount" align="center"></el-table-column>
            <el-table-column label="提交面值" prop="faceValueTotal" align="center" sortable></el-table-column>
            <el-table-column label="结算面值" prop="settlementFaceValueTotal" align="center"></el-table-column>
            <el-table-column label="结算金额" prop="settlementAmountTotal" align="center"></el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import { mapGetters } from "vuex";
// import { getStatistics, getUStatistics } from '@/api/mStatistics'
import { getRoles } from "@/utils/auth";
// import moment from "moment";
// import selecttime from "@/data/selecttime";

export default {
  name: "statistics",
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      activeName: "facevalue",
      showU: false,
      list: [],
      uList: [],
      loading: false,
      uloading: false,
      profitFrom: {
        times: [],
        page: 1,
        limit: 40,
        total: 0,
        endTime: null,
        beginTime: null
      },
      pickerOptions2: {
        shortcuts: []
      },
      emptytext: "暂无数据",
      spanArr: [],
      contactDot: 0,
      sIdx: 0
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: "success",
        pending: "danger"
      };
      return statusMap[status];
    },
    orderNoFilter(str) {
      return str.substring(0, 30);
    }
  },
  created() {
    this.pickerOptions2.shortcuts = selecttime.shortcuts;
    this.profitFrom.times = [
      new Date(new Date().setHours(0, 0, 0)),
      new Date()
    ];
    if (getRoles().indexOf("Manage") >= 0) {
      this.showU = true;
    }
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.profitFrom.beginTime = moment(this.profitFrom.times[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.profitFrom.endTime = moment(this.profitFrom.times[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      var data = this.profitFrom;
      this.spanArr = [];
      this.contactDot = 0;
      this.sIdx = 0;
      getStatistics(data).then(res => {
        if (res.code === 0) {
          if (res.data != null && res.data.length > 0) {
            this.list = res.data;
            this.list.forEach((row, index) => {
              row.index = index;
              if (index === 0) {
                this.spanArr.push(1);
              } else {
                if (row.channelName === this.list[index - 1].channelName) {
                  this.spanArr[this.contactDot] += 1;
                  this.spanArr.push(0);
                } else {
                  this.spanArr.push(1);
                  this.contactDot = index;
                  this.sIdx = this.sIdx + 1;
                }
              }
            });
            this.loading = false;
          } else {
            this.list = res.data;
            this.loading = false;
            this.emptytext = "没有条件的数据";
          }
        }
      });
    },
    fetchUData() {
      this.uloading = true;
      this.profitFrom.beginTime = moment(this.profitFrom.times[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.profitFrom.endTime = moment(this.profitFrom.times[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      var data = this.profitFrom;
      this.spanArr = [];
      this.contactDot = 0;
      this.sIdx = 0;
      getUStatistics(data).then(res => {
        if (res.code === 0) {
          if (res.data != null && res.data.length > 0) {
            this.uList = res.data;
            this.uList.forEach((row, index) => {
              row.index = index;
              if (index === 0) {
                this.spanArr.push(1);
              } else {
                if (row.realName === this.uList[index - 1].realName) {
                  this.spanArr[this.contactDot] += 1;
                  this.spanArr.push(0);
                } else {
                  this.spanArr.push(1);
                  this.contactDot = index;
                  this.sIdx = this.sIdx + 1;
                }
              }
            });
            this.uloading = false;
          } else {
            this.uList = res.data;
            this.uloading = false;
            this.emptytext = "没有条件的数据";
          }
        }
      });
    },
    handleClick(tab, event) {
      if (this.activeName == "facevalue") this.fetchData();
      else if (this.activeName == "user") this.fetchUData();
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        if (index === 1) {
          sums[index] = "-";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            return prev + curr;
          }, 0);
          sums[index] = parseFloat(sums[index].toFixed(4));
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background:#EFEFEF";
      } else {
        return "";
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    searchprofitFrom() {
      this.fetchData();
    },
    searchUprofitFrom() {
      this.fetchUData();
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>


