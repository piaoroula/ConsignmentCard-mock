<template>
  <el-card class="box-card">
    <div slot="header" class="box-card-header clearfix">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="日期范围">
          <el-date-picker v-model="formInline.times" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="提现状态">
          <el-select v-model="formInline.state" clearable placeholder="请选择提现状态">
            <el-option v-for="state in states" :key="state.id" :label="state.name" :value="state.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交查询</el-button>
          <el-button @click="onClear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :empty-text="emptytext" border style="width: 100%">
      <el-table-column prop="id" align="center" label="编号"></el-table-column>
      <el-table-column prop="name" align="center" label="收款人"> </el-table-column>
      <el-table-column prop="institution" align="center" label="收款方式"> </el-table-column>
      <el-table-column prop="amount" align="center" label="提现金额"> </el-table-column>
      <el-table-column prop="creationTime" align="center" width="160px" label="申请时间"> </el-table-column>
      <el-table-column prop="processTime" align="center" label="处理时间" width="160px"> </el-table-column>
      <el-table-column prop="state" align="center" label="状态">
        <template slot-scope='scope'>
          <el-tag v-if="scope.row.state==0" v-model="scope.row.state">待处理</el-tag>
          <el-tag v-if="scope.row.state==1" v-model="scope.row.state">处理中</el-tag>
          <el-tag v-if="scope.row.state==2" v-model="scope.row.state" type="success">成功</el-tag>
          <el-tag v-if="scope.row.state==3" v-model="scope.row.state" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" align="center" label="备注"> </el-table-column>
    </el-table>
    <div class="box-card-pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formInline.page" :page-sizes="[10,20,30, 50]" :page-size="formInline.limit" layout="total, sizes, prev, pager, next, jumper" :total="formInline.total">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import { getSettementRecord } from "@/api/finance";
import moment from "moment";
import selecttime from "@/data/selecttime";

export default {
  name: "settlementrecord",
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      submitLoading: false,
      pickerOptions2: {
        shortcuts: []
      },
      formInline: {
        state: null,
        times: [],
        page: 1,
        limit: 20,
        total: 0,
        endTime: null,
        startTime: null
      },
      states: [
        { id: 0, name: "待处理" },
        { id: 1, name: "处理中" },
        { id: 2, name: "成功" },
        { id: 3, name: "失败" }
      ],
      tableData: [],
      loading: false,
      emptytext: "暂无数据"
    };
  },
  created() {
    this.pickerOptions2.shortcuts = selecttime.shortcuts;
    this.formInline.times = [
      new Date().setDate(new Date().getDate() - 7),
      new Date()
    ];
    this.getlist();
  },
  methods: {
    //获取提现记录
    getlist() {
      this.loading = true;
      var data = {
        beginTime: moment(this.formInline.times[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endTime: moment(this.formInline.times[1]).format("YYYY-MM-DD HH:mm:ss"),
        state: this.formInline.state,
        page: this.formInline.page,
        limit: this.formInline.limit
      };
      getSettementRecord(data).then(res => {
        if (res.code == 0) {
          if (res.total > 0) {
            this.tableData = res.item;
            this.formInline.total = res.total;
            this.tableData.forEach(item => {
              if (item.state != 0) {
                item.processTime = moment(item.processTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              }
              item.creationTime = moment(item.creationTime).format(
                "YYYY-MM-DD HH:mm:ss"
              );
            });
          } else {
            this.tableData = [];
            this.formInline.total = 0;
          }
        }
      });
      this.loading = false;
    },
    //每页显示
    handleSizeChange(val) {
      this.formInline.limit = val;
      this.getlist();
    },
    //当前页
    handleCurrentChange(val) {
      this.formInline.page = val;
      this.getlist();
    },

    //搜索
    onSubmit() {
      this.getlist();
    },
    //重置
    onClear() {
      this.formInline = {};
      this.formInline.times = [
        new Date().setDate(new Date().getDate() - 7),
        new Date()
      ];
    }
  }
};
</script>

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