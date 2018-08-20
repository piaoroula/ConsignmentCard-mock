<template>
  <el-card class='box-card'>
    <div slot='header' class='box-card-header clearfix'>
      <el-button type='primary' @click='onSubmit'>新增通道</el-button>
    </div>
    <div class="box-card-table">
      <el-table :data='tableData' v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :empty-text="emptytext" border style='width: 100%'>
        <el-table-column prop='id' align="center" label='编号' width='80px'></el-table-column>
        <el-table-column prop='name' align="center" label='通道名称'> </el-table-column>
        <el-table-column prop='private' align="center" label='私有'> </el-table-column>
        <el-table-column prop="buyRate" align="center" label="费率"></el-table-column>
        <el-table-column label='状态' align="center" width='140px'>
          <template slot-scope='scope'>
            <el-switch v-model='scope.row.state' @change="editChannelState(scope.$index,scope.row)" active-text='正常' inactive-text='禁用'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作' align="center" width='150px'>
          <template slot-scope='scope'>
            <!-- <el-button-group>
              <el-button type='primary' size='mini' @click="openPrice(scope.row, scope.$index)">修改费率</el-button>
              <el-button size='mini' type='success' @click="getFacevalueList(scope.row, scope.$index)">面值管理</el-button>
            </el-button-group> -->
            <el-dropdown :hide-on-click="false" trigger="click" style="cursor:pointer">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span @click="openPrice(scope.row, scope.$index)">修改费率</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="getFacevalueList(scope.row, scope.$index)">面值管理</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="showDialogConsumption(scope.row.id,scope.row.name)">消耗渠道顺序</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class='box-card-pagination'>
      <el-pagination background @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page='formInline.page' :page-sizes='[10,20,30, 50]' :page-size='formInline.limit' layout='total, sizes, prev, pager, next, jumper' :total='formInline.total'>
      </el-pagination>
    </div>
    <div class="box-card-tip">
      <p>私有：如果通道设置为私有，那么正常用户将无法使用该通道，需要单独设置某个用户拥有私有通道的寄售权限</p>
      <p>默认收购价：价格为百分比，实际收购的价格计算公式为：(寄售卡面值 * 收购价百分比 / 100)，修改默认收购价费率会影响所有未密价的用户</p>
      <p>状态：当通道状态为停用时，所有用户无法通过该通道进行寄售.</p>
    </div>
    <div class="add-channel">
      <el-dialog title="通道信息" :visible.sync="channelVisible" label-width="80px">
        <el-form ref="form" :model="formInfo" label-width="80px">
          <el-form-item label="通道名称">
            <el-input v-model="formInfo.name" placeholder="请输入通道名称"></el-input>
          </el-form-item>
          <el-form-item label="收购比率">
            <el-input v-model="formInfo.buyRate" placeholder="请输入收购比率"></el-input>
          </el-form-item>
          <el-form-item label="私有">
            <el-radio-group v-model="formInfo.private">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="addInfoLoading" @click="addInfo">提交</el-button>
            <el-button @click="channelVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="update-facevalue">
      <el-dialog :title="formRate.title" :visible.sync="buyRateVisible" label-width="80px">
        <el-form ref="form" :model="formRate" label-width="80px">
          <el-form-item label="收购比率">
            <el-input v-model="formRate.buyRate" placeholder="请输入收购比率"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editPrice">提交</el-button>
            <el-button @click="buyRateVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="facevaluelist">
      <el-dialog :title="formFace.title" :visible.sync="facevalueVisible">
        <el-button type="primary" @click="editFacevalueVisible=true">新增面值</el-button>
        <el-table :data="facevalueData" :empty-text="emptytext" border style="width: 100%">
          <el-table-column prop="id" align="center" label="编号"></el-table-column>
          <el-table-column prop="faceValue" align="center" label="面值"></el-table-column>
          <el-table-column prop="state" align="center" label="状态">
            <template slot-scope='scope'>
              <el-switch v-model='scope.row.state' @change="editFaceValueState(scope.$index,scope.row)" active-text='正常' inactive-text='禁用'></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <div class="update-facevalue">
      <el-dialog title="请输入面值" :visible.sync="editFacevalueVisible" label-width="80px">
        <el-form ref="form" :model="formFace" label-width="80px">
          <el-form-item label="面值">
            <el-input v-model="formFace.faceValue" placeholder="请输入面值"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="addFacevalueLoading" @click="addFacevalue">提交</el-button>
            <el-button @click="facevalueVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <el-dialog :title="dialogConsumption.title" :visible.sync="dialogConsumption.visible">
      <draggable class="board-column-content" :list="dialogConsumption.list">
        <div class="board-item" v-for="element in dialogConsumption.list" :key="element.id">
          <el-alert center :title="element.name" :closable="false">
          </el-alert>
        </div>
      </draggable>
      <el-button type="primary" @click="setChannelConsumptionOrderBy()">提交</el-button>
      <!-- <dnd-list :list1="dialogConsumption.list" list1Title="List"></dnd-list> -->
      <!-- <Kanban :key="1" :list="dialogConsumption.list" /> -->
      <!-- <el-table :data="dialogConsumption.list" :height="dialogConsumption.tableHeight">
        <el-table-column property="name" label="渠道名称"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isOpen" aria-readonly="true" active-text="正常" inactive-text="禁用"></el-switch>
          </template>
        </el-table-column>
      </el-table> -->
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
// import moment from "moment";
import Kanban from "@/components/Kanban";
import DndList from "@/components/DndList";
import draggable from "vuedraggable";
// import {
//   getChannelsPage,
//   addChannel,
//   updateChannelState,
//   updateChannelRate,
//   getFaceValueM,
//   updateFacevalueState,
//   addfaceValue
// } from '@/api/mChannel'
// import {
//   listConsumptionFaceValue,
//   updateConsumptionFaceValueOrderBy
// } from "@/api/mConsumption";

export default {
  name: "channels",
  components: {
    Kanban,
    DndList,
    draggable
  },
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      dialogConsumption: {
        title: "",
        tableHeight: "100px",
        visible: false,
        loading: false,
        list: []
      },
      options: {
        group: "mission"
      },
      addInfoLoading: false,
      editPriceLoading: false,
      addFacevalueLoading: false,
      tableData: [],
      facevalueData: [],
      formInfo: {
        id: null,
        name: null,
        private: null,
        buyRate: null,
        state: null
      },
      formInline: {
        page: 1,
        limit: 20,
        total: 0
      },
      formRate: {},
      formFace: { faceValue: null },
      loading: false,
      channelVisible: false,
      buyRateVisible: false,
      facevalueVisible: false,
      editFacevalueVisible: false,
      emptytext: "暂无数据"
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    // 弹窗设置消耗渠道顺序的
    showDialogConsumption(id, title) {
      this.dialogConsumptionTableInit(id);
      this.dialogConsumption.title = title;
      this.dialogConsumption.visible = true;
    },
    // 加载(重新加载)渠道弹窗数据
    dialogConsumptionTableInit(id) {
      this.dialogConsumption.loading = true;
      listConsumptionFaceValue(id).then(t => {
        if (t !== undefined) {
          this.dialogConsumption.list = t.data;
        } else {
          this.dialogConsumption.list = [];
        }
        this.dialogConsumption.loading = false;
      });
    },
    setChannelConsumptionOrderBy() {
      var array = this.dialogConsumption.list;
      var keyValueArray = {};
      for (let index = 0; index < array.length; index++) {
        keyValueArray[array[index].id] = index + 1;
      }
      updateConsumptionFaceValueOrderBy(keyValueArray).then(t => {});
      this.dialogConsumption.visible = false;
    },
    handleSizeChange(val) {
      this.formInfo.limit = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.formInfo.page = val;
      this.getlist();
    },
    onSubmit() {
      this.channelVisible = true;
    },
    openPrice(row, index) {
      this.formRate = row;
      this.buyRateVisible = true;
      this.formRate.title = "修改[" + row.name + "]的费率百分比";
    },
    getlist() {
      var data = this.formInline;
      getChannelsPage(data).then(res => {
        if (res.code === 0) {
          if (res.data != null && res.data.length > 0) {
            this.tableData = res.data;
            this.tableData.forEach((row, index) => {
              row.private = row.private ? "是" : "否";
            });
            this.formInline.total = res.count;
          }
        }
      });
    },
    editChannelState(index, row) {
      var obj = { Id: row.id, State: row.state };
      updateChannelState(obj).then(res => {
        if (res.code === 0) {
          this.$message({
            message: "修改通道状态成功！",
            type: "success"
          });
        } else {
          this.$message.error("修改通道状态失败！");
        }
      });
    },
    editFaceValueState(index, row) {
      var obj = { Id: row.id, State: row.state };
      updateFacevalueState(obj).then(res => {
        if (res.code === 0) {
          this.$message({
            message: "修改面值状态成功！",
            type: "success"
          });
        } else {
          this.$message.error("修改面值状态失败！");
        }
      });
    },
    editPrice() {
      this.editPriceLoading = true;
      var obj = { channelId: this.formRate.id, buyRate: this.formRate.buyRate };
      updateChannelRate(obj).then(resp => {
        if (resp.code === 0) {
          this.$message({
            message: "修改通道费率成功！",
            type: "success"
          });
          this.buyRateVisible = false;
          this.getlist();
        } else {
          this.$message.error("修改通道费率失败！");
        }
        this.editPriceLoading = false;
      });
    },
    clearFormInfo() {
      this.formInfo.name = null;
      this.formInfo.buyRate = null;
      this.formFace.faceValue = null;
    },
    addInfo() {
      this.addInfoLoading = true;
      var data = this.formInfo;
      addChannel(data).then(response => {
        if (response.code === 0) {
          this.$message({
            message: "新增通道成功！",
            type: "success"
          });
          this.getlist();
          this.channelVisible = false;
          this.clearFormInfo();
          if (response.data != null && response.data.length > 0) {
            this.tableData = response.data;
            this.tableData.forEach((row, index) => {
              row.private = row.private ? "是" : "否";
            });
            this.formInline.total = response.count;
          }
        } else {
          this.$message.error("新增通道失败！");
        }
        this.addInfoLoading = false;
      });
    },
    addFacevalue() {
      this.addFacevalueLoading = true;
      addfaceValue({
        channelId: this.formFace.id,
        faceValue: this.formFace.faceValue
      }).then(res => {
        if (res.code === 0) {
          this.$message({
            message: "新增面值成功！",
            type: "success"
          });
          this.editFacevalueVisible = false;
          this.getfaceList(this.formFace.id);
          this.clearFormInfo();
        } else {
          this.$message.error("新增面值失败！");
        }
        this.addFacevalueLoading = false;
      });
    },
    getFacevalueList(row, index) {
      this.facevalueVisible = true;
      this.formFace = row;
      this.formFace.title = "[" + row.name + "]-面值管理";
      this.getfaceList(row.id);
    },
    getfaceList(id) {
      getFaceValueM(id).then(res => {
        if (res.code === 0) {
          if (res.data != null && res.data.length > 0) {
            this.facevalueData = res.data;
            this.facevalueData.total = res.count;
          }
        }
      });
    }
  }
};
</script>

<style>
.el-alert--info {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
}
.board-item {
  /* border-style: groove; */
  margin: 0.5em;
}
.add-channel .el-dialog {
  width: 420px;
  height: 350px;
  top: 25% !important;
  margin-top: 0px !important;
}
.facevaluelist .el-dialog .el-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}
.facevaluelist .el-dialog {
  width: 40%;
  height: 50%;
  top: 5% !important;
  margin-top: 0px !important;
}
.update-facevalue .el-dialog {
  width: 420px;
  height: 300px;
  top: 25% !important;
  margin-top: 0px !important;
}
.el-table__row .el-input__inner {
  background: transparent;
  border: 0;
}
.el-table__row .el-input__inner:focus {
  border: 1px solid #409eff;
}
.el-dropdown-link {
  width: 100%;
  display: block;
  padding: 3px 38px;
}
</style>
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
    margin: 20px 0;
  }
  &-tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 80px 0;
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5em;
    }
  }
}
</style>