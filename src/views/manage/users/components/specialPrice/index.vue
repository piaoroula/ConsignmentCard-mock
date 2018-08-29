<template>
  <el-dialog title="收货地址" :visible.sync="speciaPriceVisible">
    <el-table :data="tableData" :empty-text="emptytext" border style="width: 100%">
      <el-table-column prop="id" label="编号"></el-table-column>
      <el-table-column prop="name" label="通道名称"></el-table-column>
      <el-table-column prop="buyRate" label="费率"></el-table-column>
      <el-table-column prop="state" label="寄售权限"></el-table-column>
    </el-table>
    <div class="box-card-pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formInline.page" :page-sizes="[10,20,30, 50]" :page-size="formInline.limit" layout="total, sizes, prev, pager, next, jumper" :total="formInline.total">
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import { getUserPrice } from '@/api/manage'

export default {
  name: 'SpeciaPrice',
  data() {
    return {
      formInline: {
        userId: null,
        userName: null,
        state: null,
        total: 0,
        page: 1,
        limit: 20
      },
      tableData: [],
      emptytext: '暂无数据'
    }
  },
  methods: {
    handleSizeChange(val) {
      this.getlist()
    },
    handleCurrentChange(val) {
      this.getlist()
    },
    getlist() {
      var data = this.formInline
      getUserPrice(data).then(res => {
        if (res.code === 0) {
          if (res.data != null && res.data.length > 0) {
            this.tableData = res.data
            this.total = res.Count
          }
        }
      })
    }
  }
}
</script>
