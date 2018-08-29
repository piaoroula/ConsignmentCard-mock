<template>
  <el-card class='box-card'>
    <div slot='header' class='box-card-header clearfix'>
      <el-form :inline='true' :model='formInline' class='demo-form-inline'>
        <el-form-item label='日期范围'>
          <el-date-picker v-model='formInline.times' type='datetimerange' :picker-options='pickerOptions2' range-separator='至' start-placeholder='开始日期' end-placeholder='结束日期' align='right'>
          </el-date-picker>
        </el-form-item>
        <el-form-item label='财务类型'>
          <el-select v-model='formInline.type' clearable placeholder='请选择财务类型'>
            <el-option v-for='usestate in usestates' :key='usestate.id' :label='usestate.name' :value='usestate.id'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='财务分类'>
          <el-select v-model='formInline.classify' clearable placeholder='请选择财务分类'>
            <el-option v-for='usestate in usestates1' :key='usestate.id' :label='usestate.name' :value='usestate.id'>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='onSubmit'>提交查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data='tableData' v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :empty-text="emptytext" border style='width: 100%'>
      <el-table-column prop='id' align="center" label='编号' width="80px"></el-table-column>
      <el-table-column prop='cardNumber' align="center" label='卡ID' @click="goPages(cardNumber)" width="220px"> </el-table-column>
      <el-table-column prop='type' align="center" label='类型'>
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==0" v-model="scope.row.type">支出</el-tag>
          <el-tag v-if="scope.row.type==1" v-model="scope.row.type" type="success">收入</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop='classify' align="center" label='分类' width="140px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.classify==0" v-model="scope.row.classify" type="success">寄售收入</el-tag>
          <el-tag v-if="scope.row.classify==1" v-model="scope.row.classify" type="success">补结算收入</el-tag>
          <el-tag v-if="scope.row.classify==2" v-model="scope.row.classify" type="danger">提现支出</el-tag>
          <el-tag v-if="scope.row.classify==3" v-model="scope.row.classify" type="success">提现失败退回收入</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop='beforeAmount' align="center" label='之前余额'> </el-table-column>
      <el-table-column prop='amount' align="center" label='影响余额'> </el-table-column>
      <el-table-column prop='afterAmount' align="center" label='之后余额'>
      </el-table-column>
      <el-table-column prop='creationTime' align="center" label='时间' width="160px"> </el-table-column>
      <el-table-column prop='remark' align="center" label='备注'> </el-table-column>
    </el-table>
    <div class='box-card-pagination'>
      <el-pagination background @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page='formInline.page' :page-sizes='[10,20,30, 50]' :page-size='formInline.limit' layout='total, sizes, prev, pager, next, jumper' :total='formInline.total'>
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import { getFinances } from "@/api/finance";
import moment from "moment";
import selecttime from "@/data/selecttime";

export default {
  name: "financedetail",
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
        times: [],
        type: null,
        classify: null,
        page: 1,
        limit: 20,
        total: 0
      },
      usestates: [{ id: 0, name: "支出" }, { id: 1, name: "收入" }],
      usestates1: [
        { id: 0, name: "寄售收入" },
        { id: 1, name: "补结算收入" },
        { id: 2, name: "提现支出" },
        { id: 3, name: "提现失败退回收入" }
      ],
      tableData: [],
      loading: false,
      emptytext: "暂无数据"
    };
  },
  created() {
    this.pickerOptions2.shortcuts = selecttime.shortcuts;
    // 初始化起始时间和当前时间
    this.formInline.times = [
      new Date().setHours(0, 0, 0),
      new Date().setHours(0, 0, 0) + 86398999
    ];
    this.getlist();
  },
  methods: {
    //获取财务明细
    getlist() {
      this.loading = true;
      var data = {
        beginTime: moment(this.formInline.times[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endTime: moment(this.formInline.times[1]).format("YYYY-MM-DD HH:mm:ss"),
        type: this.formInline.type,
        classify: this.formInline.classify,
        page: this.formInline.page,
        limit: this.formInline.limit
      };
      getFinances(data).then(res => {
        if (res.code == 0) {
          if (res.total > 0) {
            this.tableData = res.item;
            this.formInline.total = res.total;
          } else {
            this.tableData = [];
            this.formInline.total = 0;
            this.emptytext = "暂无数据";
          }
        }
      });
      this.loading = false;
    },
    //搜索
    onSubmit() {
      this.getlist();
    },
    //重置
    onReset() {
      (this.formInline = {}),
        (this.formInline.times = [
          new Date().setHours(0, 0, 0),
          new Date().setHours(0, 0, 0) + 86398999
        ]);
    },
    //每一页展示的数据
    handleSizeChange(val) {
      this.formInline.limit = val;
      this.getlist();
    },
    //当前页
    handleCurrentChange(val) {
      this.formInline.page = val;
      this.getlist();
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
  &-pagination {
    padding: 10px;
    float: right;
  }
}
</style>