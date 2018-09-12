<template>
  <div class="dashboard-editor-container">

    <github-corner style="position: absolute; top: 0px; border: 0; right: 0;"></github-corner>

    <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="13">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="11" class="notice">
        <h4>
          系统公告
          <i class="header-icon el-icon-info"></i>
          <span class="more" @click='goNotice'>查看更多</span>
        </h4>
        <el-collapse @change="handleChange" class="noticeList" :loading='loading'>
          <el-collapse-item v-for='notice in noticeData.slice(0,5)' :key='notice.id'>
            <template slot="title">
              <span class="time">[{{notice.creationTime}}]</span>
              {{notice.title}}
            </template>
            <div v-html="notice.content"></div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

  </div>
</template>


<script>
import GithubCorner from "@/components/GithubCorner";
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import TransactionTable from "./components/TransactionTable";
import TodoList from "./components/TodoList";
import BoxCard from "./components/BoxCard";

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
};
import { getNoticesPage } from "@/api/mNotice";
export default {
  name: "dashboard-admin",
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      loading: false,
      noticeData: []
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    },
    handleChange(val) {
      console.log(val);
    },
    // 获取公告数据
    getlist() {
      this.loading = true;
      getNoticesPage()
        .then(res => {
          console.log(res);
          if (res.code == 0) {
            if (res.total > 0) {
              this.noticeData = res.items;
            } else {
              this.noticeData = [];
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    goNotice() {
      this.$router.push({ path: "/manage/notice" });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.header-icon {
  float: left;
  padding-right: 10px;
}
.el-collapse-item__header {
  font-weight: 700;
}
.el-collapse-item__arrow {
  float: left;
}
.notice {
  padding: 0px 10px;
  background: #fff;
  overflow: hidden;
  .more {
    float: right;
    font-weight: normal;
    font-size: 15px;
    cursor: pointer;
  }
}
.time {
  color: red;
}
</style>

