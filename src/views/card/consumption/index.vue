<template>
  <el-card class="box-card">
    <!-- <div slot="header" class="box-card-header clearfix">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">新增渠道</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <div class="box-card-table">
      <el-table :data="tableConsumption.list" v-loading="tableConsumption.loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :empty-text="emptytext" border style="width: 100%">
        <el-table-column prop="id" align="center" label="编号" width="80px"></el-table-column>
        <el-table-column prop="name" align="center" label="渠道名称"> </el-table-column>
        <el-table-column label="状态" align="center" width="140px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isOpen" aria-readonly="true" active-value='true' inactive-value='false' active-text="正常" inactive-text="禁用" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <!-- <el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">-->
            <el-button @click="showDialogConsumptionSetting(scope.row.id,scope.row.name)" type="text" size="small">
              设置通道
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogConsumptionSetting.title" :visible.sync="dialogConsumptionSetting.visible">
      <el-table :data="dialogConsumptionSetting.list" :height="dialogConsumptionSetting.tableHeight" v-loading="dialogConsumptionSetting.loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <el-table-column property="channelName" label="通道名称"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch @change="dialogSwitchChange(scope.row.consumptionId,scope.row.channelId,scope.row.isOpen)" v-model="scope.row.isOpen" aria-readonly="true" active-text="正常" inactive-text="禁用"></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>
<script>
import { mapGetters } from "vuex";
// import moment from "moment";
import {
  listConsumptionAll
  //   listFaceValueJoinConsumption,
  //   openConsumptionChannel,
  //   closeConsumptionChannel
} from "@/api/mConsumption";

export default {
  name: "consumptions",
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      tableConsumption: {
        loading: false,
        list: []
      },
      // tableData: [],
      emptytext: "暂无数据",
      dialogConsumptionSetting: {
        title: "",
        tableHeight: "400px",
        loading: false,
        visible: false,
        list: []
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 加载默认数据
    init() {
      this.tableConsumption.loading = true;
      listConsumptionAll().then(res => {
        if (res.code === 0) {
          this.tableConsumption.list = res.data;
        }
        this.tableConsumption.loading = false;
      });
    }
  }
};
</script>