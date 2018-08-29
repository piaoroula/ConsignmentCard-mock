<template>
  <el-card class="box-card">
    <div slot="header" class="box-card-header clearfix">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="日期范围">
          <el-date-picker v-model="formInline.times" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="财务类型">
          <el-select v-model="formInline.type" clearable placeholder="请选择财务类型">
            <el-option v-for="usestate in usestates" :key="usestate.id" :label="usestate.name" :value="usestate.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input placeholder='用户邮箱/用户名' v-model='formInline.userNameOrId' clearable></el-input>
        </el-form-item>
        <el-form-item label="财务分类">
          <el-select v-model="formInline.classify" clearable placeholder="请选择财务分类">
            <el-option v-for="usestate in usestates1" :key="usestate.id" :label="usestate.name" :value="usestate.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" :empty-text="emptytext" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column prop="id" label="编号" align="center" width="80px"></el-table-column>
      <el-table-column prop="realName" label="用户名" align="center" width="180px"> </el-table-column>
      <el-table-column prop="userName" label="邮箱" align="center" width="180px"> </el-table-column>
      <el-table-column prop="cardNumber" label="卡号" align="center" width="220px"> </el-table-column>
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
      <el-table-column prop="beforeAmount" align="center" label="之前余额"> </el-table-column>
      <el-table-column prop="amount" align="center" label="影响金额"> </el-table-column>
      <el-table-column prop="afterAmount" align="center" label="之后余额"> </el-table-column>
      <el-table-column prop="creationTime" align="center" label="申请时间" width="160px"> </el-table-column>
      <el-table-column prop="remark" align="center" label="备注"> </el-table-column>
    </el-table>
    <div class="box-card-pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formInline.page" :page-sizes="[10,20,30, 50]" :page-size="formInline.limit" layout="total, sizes, prev, pager, next, jumper" :total="formInline.total">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getFinances } from '@/api/mFinance'
import selecttime from '@/data/selecttime'

export default {
  name: 'finances',
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  data() {
    return {
      pickerOptions2: {
        shortcuts: []
      },
      formInline: {
        userNameOrId: null,
        type: null,
        classify: null,
        times: [
          new Date().setHours(0, 0, 0),
          new Date().setHours(0, 0, 0) + 86398999
        ],
        page: 1,
        limit: 20,
        total: 0,
        endTime: null,
        startTime: null
      },
      usestates: [{ id: 0, name: '支出' }, { id: 1, name: '收入' }],
      usestates1: [
        { id: 0, name: '寄售收入' },
        { id: 1, name: '补结算收入' },
        { id: 2, name: '提现支出' },
        { id: 3, name: '提现失败退回收入' }
      ],
      tableData: [],
      emptytext: '暂无数据',
      loading: false
    }
  },
  created() {
    this.pickerOptions2.shortcuts = selecttime.shortcuts
    this.getlist()
  },
  methods: {
    handleSizeChange(val) {
      this.formInline.limit = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getlist()
    },
    reset() {
      this.formInline = {
        userNameOrId: null,
        type: null,
        classify: null,
        times: [
          new Date().setHours(0, 0, 0),
          new Date().setHours(0, 0, 0) + 86398999
        ],
        page: 1,
        limit: 20,
        total: 0,
        endTime: null,
        startTime: null
      }
    },
    onSubmit() {
      this.getlist()
    },
    getlist() {
      this.loading = true
      this.formInline.beginTime = moment(this.formInline.times[0]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.formInline.endTime = moment(this.formInline.times[1]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      var data = this.formInline
      getFinances(data).then(res => {
        if (res.code === 0) {
          if (res.data != null && res.data.length > 0) {
            this.tableData = res.data
            this.tableData.forEach((row, index) => {
              // 支出
              if (row.type === 0) {
                row.afterAmount = row.beforeAmount - row.amount
              }
              // 收入
              else {
                row.afterAmount = row.beforeAmount + row.amount
              }
              if (row.afterAmount !== undefined) {
                row.afterAmount = parseFloat(row.afterAmount.toFixed(4))
              }
            })
            this.loading = false
            this.formInline.total = res.count
          } else {
            this.formInline.total = 0
            this.tableData = []
            this.loading = false
            this.emptytext = '没有符合条件的数据'
          }
        }
      }).catch(()=>{
            this.loading = false
          });
    }
  }
}
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