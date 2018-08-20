<template>
  <div class="dashboard-container channel background">
    <el-table :data="channelData" style="width: 100%" stripe v-loading='loading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" :empty-text='emptytext'>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table stripe border :data="props.row.list">
            <el-table-column prop="id" label="面值ID" width="150" align="center"></el-table-column>
            <el-table-column prop="faceValue" label="面值" width="200" align="center"></el-table-column>
            <el-table-column prop="consignPrice" label="结算价格" align="center">
              <template slot-scope='scope'>
                {{scope.row.consignPrice +' 元' }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop='id' label="通道ID" width='125'>
      </el-table-column>
      <el-table-column prop='name' label="通道名称">
      </el-table-column>
      <el-table-column prop='rate' label="结算费率" align="center" width='550'>
        <template slot-scope='scope'>
          {{scope.row.rate +' %' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import { ChanneData } from '@/api/card'
export default {
  name: "channel",
  data() {
    return {
      border: true,
      loading: false,
      emptytext: "暂时没有数据",
      channel: {
        Name: "",
        FaceValue: "",
        ConsignPrice: ""
      },
      channelData: [
        {
          name: null,
          rate: null,
          faceValue: null,
          consignPrice: null
        }
      ],
      spanArr: [],
      sameRowArr: [],
      curRowArr: [],
      contactDot: 0,
      sIdx: 0
    };
  },
  created() {
    this.getchannelData();
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
    // 通道列表
    getchannelData() {
      this.loading = true;
      ChanneData().then(res => {
        if (res.code != null && res.data !== undefined) {
          this.loading = false;
          this.channelData = res.data;
        }
        this.loading = false;
      });
    },
    //
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
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
    padding: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
tr,
th {
  text-align: center;
}
.table-bordered {
  border: 1px solid #dcdfe6;
}
table {
  border-collapse: collapse;
}
table tr {
  height: 40px;
}
</style>