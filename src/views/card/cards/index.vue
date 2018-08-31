<template>
  <el-card class="box-card">
    <div slot="header" class="box-card-header clearfix">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="寄售通道">
          <el-select v-model="formInline.channelId" filterable clearable @change="facevalueList" placeholder="请选择寄售通道">
            <el-option v-for="channel in channels" :key="channel.id" :label="channel.name" :value="channel.name">
              <span style="float: left">{{ channel.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ channel.buyRate }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.faceValueId" clearable placeholder="请先选择寄售通道">
            <el-option v-for="facevalue in facevalues" :key="facevalue.id" :label="facevalue.faceValue" :value="facevalue.faceValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡状态">
          <el-select v-model="formInline.useState" clearable placeholder="请选择卡状态">
            <el-option v-for="usestate in usestates" :key="usestate.id" :label="usestate.name" :value="usestate.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡号">
          <el-input placeholder='卡号' v-model='formInline.cardNumber' clearable></el-input>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker v-model="formInline.times" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="寄售用户">
          <el-input placeholder='寄售用户名或ID' v-model='formInline.userNameOrId' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交查询</el-button>
          <!-- <el-button type="success" @click="reportExcel">导出Excel</el-button> -->
          <el-button @click="clearText">重置</el-button>
        </el-form-item>
      </el-form>
      <el-tag type="success">寄售总面值： {{numbers.faceValueTotal}} 元</el-tag>
      <el-tag type="danger">结算总面值： {{numbers.settlementFaceValueTotal}} 元</el-tag>
      <el-tag>结算总金额： {{numbers.settlementAmountTotal}} 元</el-tag>
    </div>
    <el-table :data="tableData" :empty-text="emptytext" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" @selection-change="handleSelectionChange" ref="multipleTable">
      <el-table-column type="selection" width="30" align="center">
      </el-table-column>
      <el-table-column prop="id" align="center" label="ID" width="85px"> </el-table-column>
      <el-table-column prop="cardNumber" align="center" label="卡号" width="210px"> </el-table-column>
      <el-table-column align="center" label="用户" width="90px">
        <template slot-scope="scope">
          <el-popover trigger="click" placement="top">
            <p>账号: {{ scope.row.userName }}</p>
            <div slot="reference" class="name-wrapper">
              <span>{{scope.row.realName}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="name" align="center" label="卡类型" width="120px"> </el-table-column>
      <el-table-column prop="consumptionName" align="center" label="消耗渠道" width="80px"> </el-table-column>
      <el-table-column prop="faceValue" align="center" label="寄售面值" width="80px">
      </el-table-column>
      <el-table-column align="center" label="结算面值" width="80px">
        <template slot-scope="scope">
          <span v-if='scope.row.useState==3'>{{scope.row.settlementFaceValue}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算金额" width="80px">
        <template slot-scope="scope">
          <span v-if='scope.row.useState==3'>{{scope.row.settlementAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="useState" align="center" label="寄售状态">
        <template slot-scope='scope '>
          <el-tag v-if="scope.row.useState==0" v-model="scope.row.useState" type='info '>待处理</el-tag>
          <el-tag v-if="scope.row.useState==1" v-model="scope.row.useState">已取出</el-tag>
          <el-tag v-if="scope.row.useState==2" v-model="scope.row.useState">处理中</el-tag>
          <el-tag v-if="scope.row.useState==3" v-model="scope.row.useState" type="success">成功</el-tag>
          <el-tag v-if="scope.row.useState==4" v-model="scope.row.useState" type="danger">失败</el-tag>
          <el-tag v-if="scope.row.useState==5" v-model="scope.row.useState" type="warning">可疑</el-tag>
          <el-tag v-if="scope.row.useState==6" v-model="scope.row.useState" type="warning">可疑核查中</el-tag>
          <el-tag v-if="scope.row.useState==null || scope.row.useState<0 || scope.row.useState>6" v-model="scope.row.useState" type="info">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userTime" align="center" label="耗时" width="80px"> </el-table-column>
      <el-table-column align="center" label="寄售时间" width='155px '>
        <template slot-scope="scope">
          <el-popover trigger="click" placement="top">
            <p>取出时间: {{ scope.row.takeOutTime }}</p>
            <p>处理时间: {{ scope.row.submitTime }}</p>
            <p>完成时间: {{ scope.row.callbackTime }}</p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.addTime }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="remark" align="center" label="备注" width="200px"> </el-table-column>

      <el-table-column label='操作 ' align="center" width='150px ' fixed="right">
        <template slot-scope='scope '>
          <!-- <el-button-group>
            <el-button v-if="scope.row.useState != 3" type='success ' size='mini ' @click="openEditPages(scope.row, scope.$index)">修改寄售状态</el-button>
            <el-button v-if="scope.row.useState == 3" size='mini ' type='danger ' @click="openBCPages(scope.row, scope.$index)">补结算</el-button>
            <el-button size='mini ' type='primary ' @click="openPassPages(scope.row, scope.$index)">查看密码</el-button>
          </el-button-group> -->
          <el-dropdown :hide-on-click="false" trigger="click" style="cursor:pointer">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="scope.row.useState != 3&&scope.row.useState != 6">
                <span @click="openEditPages(scope.row, scope.$index)">修改寄售状态</span>
              </el-dropdown-item>
              <el-dropdown-item v-if="scope.row.useState == 3">
                <span @click="openBCPages(scope.row, scope.$index)">补结算</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="openPassPages(scope.row, scope.$index)">查看密码</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="box-card-pagination">
      <el-button type="primary" plain @click="toggleSelection()">取消选择</el-button>
      <el-button type="primary" plain @click="changgeUseState()">批量修改寄售状态</el-button>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formInline.page" :page-sizes="[10,20,30, 50]" :page-size="formInline.limit" layout="total, sizes, prev, pager, next, jumper" :total="formInline.total">
      </el-pagination>
    </div>
    <el-dialog title="修改寄售状态" :visible.sync="editUseStateVisible" label-width="80px">
      <el-form ref="form" :model="formUseState" label-width="80px">
        <el-form-item label="寄售状态">
          <el-radio-group v-model="updateState" @change="onSelect">
            <el-radio v-for="state in editUseStates" :key="state.id" :label="state.id" :value="state.id">{{state.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="editCardStateLoading" @click="editCardState">提交</el-button>
          <el-button @click="upUseStateVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="批量修改寄售状态" :visible.sync="batchEditUseStateVisible" label-width="80px">
      <el-form ref="form" :model="formUseState" label-width="80px">
        <el-form-item label="寄售状态">
          <el-radio-group v-model="updateState" @change="onSelect">
            <el-radio v-for="state in batchEditUseStates" :key="state.id" :label="state.id" :value="state.id">{{state.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="editCardStateLoading" @click="batcheditCardState">批量提交</el-button>
          <el-button @click="upUseStateVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请输入成功面值，是（面值），不是金额" :visible.sync="addFaceValueVisibel" label-width="80px">
      <el-form ref="form" :model="formUseState" label-width="80px">
        <el-form-item label="成功面值">
          <el-input v-model="updateBCFaceValue" placeholder="请输入面值"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-show="batchEditUseStateVisible" :loading="editCardStateLoading" @click="batcheditCardState">批量提交</el-button>
          <el-button type="primary" v-show="editUseStateVisible" :loading="editCardStateLoading" @click="editCardState">提交</el-button>
          <el-button @click="upFaceValueVisibel=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请输入补充的面值" :visible.sync="addSupplementVisible" label-width="80px">
      <el-form ref="form" :model="formUseState" label-width="80px">
        <el-form-item label="补充面值">
          <el-input v-model="updateBCFaceValue" placeholder="请输入面值"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="updateSupplementLoading" @click="updateSupplement">提交</el-button>
          <el-button @click="addSupplementVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="passTitle" :visible.sync="showPassVisible" label-width="80px">
      <el-form ref="form" :model="formUseState" label-width="80px">
        <el-form-item label="卡密">
          {{passValue}}
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="tag-read" v-clipboard:copy='passValue ' v-clipboard:success='clipboardSuccess ' v-clipboard:error='clipboardError '>复制</el-button>
          <el-button @click="showPassVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import clip from "@/utils/clipboard"; // use clipboard directly
import clipboard from "@/directive/clipboard/index.js"; // use clipboard by v-directive
import { mapGetters } from "vuex";
import {
  getCards,
  updateCardState,
  getPassword,
  supplement,
  getCardsStatistics,
  getAllCards
} from "@/api/mCard";
import { GetChannels, getFaceValues } from "@/api/card";
import moment from "moment";
import selecttime from "@/data/selecttime";
import { isupdateBCFaceValue } from "@/utils/validate";
export default {
  name: "cards",
  computed: {
    ...mapGetters(["name", "roles"])
  },
  directives: {
    clipboard
  },
  data() {
    return {
      numbers: {},
      editCardStateLoading: false,
      editCardStateLoading: false,
      updateSupplementLoading: false,
      pickerOptions2: {
        shortcuts: []
      },
      formInline: {
        channelId: null,
        faceValueId: null,
        useState: null,
        cardNumber: null,
        userNameOrId: null,
        times: [],
        page: 1,
        limit: 10,
        total: 0,
        endTime: null,
        beginTime: null
      },
      formUseState: {},
      updateState: null,
      updateBCFaceValue: null,
      editUseStateVisible: false,
      addFaceValueVisibel: false,
      addBCFaceValueVisibel: false,
      addSupplementVisible: false,
      showPassVisible: false,
      batchEditUseStateVisible: false,
      passTitle: "",
      passValue: "",
      channels: [],
      facevalues: [],
      usestates: [
        { id: 0, name: "待处理" },
        { id: 1, name: "已取出" },
        { id: 2, name: "处理中" },
        { id: 3, name: "成功" },
        { id: 4, name: "失败" },
        { id: 5, name: "可疑" }
      ],
      editUseStates: [],
      batchEditUseStates: [],
      tableData: [],
      emptytext: "暂无数据",
      loading: false,
      exporttable: [],
      multipleSelection: []
    };
  },
  created() {
    this.pickerOptions2.shortcuts = selecttime.shortcuts;
    this.formInline.times = [
      new Date().setHours(0, 0, 0),
      new Date().setHours(0, 0, 0) + 86398999
    ];
    // this.formInline.userNameOrId = this.$route.params.userName;
    this.getlist();
    this.getChannelList();
    // this.getStatistics();
  },
  methods: {
    //获取卡列表
    getlist() {
      this.loading = true;
      var data = {
        name: this.formInline.channelId,
        buyRate: this.formInline.buyRate,
        faceValueId: this.formInline.faceValueId,
        useState: this.formInline.useState,
        cardNumber: this.formInline.cardNumber,
        beginTime: moment(this.formInline.times[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endTime: moment(this.formInline.times[1]).format("YYYY-MM-DD HH:mm:ss"),
        userNameOrId: this.formInline.userNameOrId,
        limit: this.formInline.limit,
        page: this.formInline.page
      };
      getCards(data).then(res => {
        console.log(res);
        if (res.code == 0) {
          if (res.total > 0) {
            this.tableData = res.items;
            this.formInline.total = res.total;
            this.numbers = res.data;
            this.loading = false;
          } else {
            this.loading = false;
            this.formInline.total = 0;
            this.tableData = [];
            this.emptytext = "暂无数据";
          }
        }
      });
    },
    //搜索
    onSubmit() {
      this.getlist();
    },
    //重置
    clearText() {
      (this.formInline = {}),
        (this.formInline.times = [
          new Date().setHours(0, 0, 0),
          new Date().setHours(0, 0, 0) + 86398999
        ]);
    },
    //获取寄售通道
    getChannelList() {
      GetChannels().then(res => {
        console.log(res);
        if (res.code === 0) {
          this.channels = res.data;
        } else {
          this.$message.error("获取寄售通道数据失败");
        }
      });
    },
    //获取卡面值，通过卡类型的id获取对应的卡面值
    facevalueList(vName) {
      // 通过卡name对应卡ID
      let obj = {};
      obj = this.channels.find(item => {
        return item.name === vName;
      });
      getFaceValues({ cid: obj.id }).then(res => {
        console.log(res);
        if (res.code === 0) {
          if (res.data != undefined) {
            this.facevalues = res.data;
          } else {
            this.facevalues = [];
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //取消选择
    toggleSelection(rows) {
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
    //openEditPages，打开修改寄售状态弹框
    openEditPages(row, index) {
      this.formUseState = row;
      this.updateState = "";
      this.editUseStates = [];
      this.editUseStateVisible = true;
      switch (row.useState) {
        case 0:
          this.editUseStates.push({ id: 4, name: "失败" });
          break;
        case 2:
          this.editUseStates.push(
            { id: 0, name: "待处理" },
            { id: 4, name: "失败" },
            { id: 5, name: "可疑" },
            { id: 3, name: "成功" }
          );
          break;
        case 4:
          this.editUseStates.push(
            { id: 0, name: "待处理" },
            { id: 5, name: "可疑" },
            { id: 3, name: "成功" }
          );
          break;
        case 5:
          this.editUseStates.push(
            { id: 0, name: "待处理" },
            { id: 4, name: "失败" },
            { id: 3, name: "成功" }
          );
          break;
      }
    },
    //onSelect 打开面值弹窗口
    onSelect() {
      console.log(this.updateState);
      if (this.updateState === 3) {
        this.addFaceValueVisibel = true;
        this.updateBCFaceValue = null;
      }
    },
    //保存修改寄售状态
    editCardState() {
      var data = {
        id: this.formUseState.id,
        useState: this.updateState,
        updateBCFaceValue: this.updateBCFaceValue
      };
      if (this.updateState == null) {
        this.$message.error("请选择要修改得寄售状态！");
      } else if (
        this.updateState === 3 &&
        !isupdateBCFaceValue(this.updateBCFaceValue)
      ) {
        this.editCardStateLoading = false;
        this.$message.error(
          "寄售状态改为成功时，成功面值不可为空且要为验证非零的正整数！"
        );
      } else {
        updateCardState(data).then(res => {
          this.editCardStateLoading = true;
          console.log(res);
          if (res.code === 0) {
            this.$message.success(res.msg);
            this.getlist();
            this.editCardStateLoading = false;
            this.addFaceValueVisibel = false;
            this.editUseStateVisible = false;
          } else {
            this.editCardStateLoading = false;
            this.$message.error(res.msg);
          }
        });
      }
    },
    //查看密码
    openPassPages(row, index) {
      this.showPassVisible = true;
      getPassword(row.id).then(res => {
        if (res.code === 0) {
          this.formUseState = row;
          this.passTitle = "卡号" + row.cardNumber + "的密码";
          this.passValue = row.passValue;
        } else {
          this.$message.error(res.msg);
        }
        console.log(res);
      });
    },
    //复制密码
    clipboardSuccess() {
      this.$message({
        message: "复制成功",
        type: "success",
        duration: 1500
      });
    },
    clipboardError() {
      this.$message({
        message: "复制失败",
        type: "error",
        duration: 1500
      });
    },
    //补结算openBCPages
    openBCPages(row, index) {
      this.addSupplementVisible = true;
      this.formUseState = row;
      this.updateBCFaceValue = null;
    },
    updateSupplement() {
      this.updateSupplementLoading = true;
      var data = {
        id: this.formUseState.id,
        updateBCFaceValue: this.updateBCFaceValue
      };
      if (isupdateBCFaceValue(this.updateBCFaceValue)) {
        supplement(data).then(res => {
          if (res.code === 0) {
            this.updateSupplementLoading = false;
            this.addSupplementVisible = false;
            this.getlist();
          } else {
            this.updateSupplementLoading = false;
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error("补结算面值不可为空且要为验证非零的正整数");
      }
    },
    //打开批量修改寄售状态弹窗口
    changgeUseState() {
      //判断是否有选中
      if (this.multipleSelection.length <= 0) {
        this.$message.error("请选择卡");
      } else {
        this.batchEditUseStateVisible = true;
        this.updateState = null;
        this.batchEditUseStates = this.usestates;
      }
    },
    //批量修改寄售状态
    batcheditCardState(val) {
      this.editCardStateLoading = true;
      val = this.multipleSelection;
      var curUseState;
      val.forEach(item => {
        this.formUseState = item;
        //获取当前行的状态
        curUseState = item.useState;
        //目标寄售状态
        var targetUseState = this.updateState;
        switch (curUseState) {
          // 1 已取出 只能修改为失败 4、可疑 5、待处理 0
          case 1:
            if (
              targetUseState != 4 &&
              targetUseState != 5 &&
              targetUseState != 0
            ) {
              return;
            }
            break;
          // 2 处理中 只能修改为待处理 0、失败 4、可疑 5 、成功 3
          case 2:
            if (
              targetUseState != 4 &&
              targetUseState != 5 &&
              targetUseState != 0 &&
              targetUseState != 3
            ) {
              return;
            }
            break;
          // 3 成功 不可修改为其他状态
          case 3:
            return;
            break;
          // 4 失败 只能修改为待处理 0、可疑 5、成功 3
          case 4:
            if (
              targetUseState != 5 &&
              targetUseState != 0 &&
              targetUseState != 3
            ) {
              return;
            }
            break;
          // 5 可疑 只能修改为待处理 0、失败 4、成功 3
          case 5:
            if (
              targetUseState != 4 &&
              targetUseState != 0 &&
              targetUseState != 3
            ) {
              return;
            }
            break;
        }
        var data = {
          id: this.formUseState.id,
          useState: this.updateState,
          updateBCFaceValue: this.updateBCFaceValue
        };
        if (this.updateState == null) {
          this.$message.error("请选择要修改得寄售状态！");
        } else if (
          this.updateState === 3 &&
          !isupdateBCFaceValue(this.updateBCFaceValue)
        ) {
          this.editCardStateLoading = false;
          this.$message.error(
            "寄售状态改为成功时，成功面值不可为空且要为验证非零的正整数！"
          );
        } else {
          updateCardState(data).then(res => {
            this.editCardStateLoading = true;
            console.log(res);
            if (res.code === 0) {
              this.getlist();
              var useStateText;

              switch (data.useState) {
                case 0:
                  useStateText = "待处理";
                  break;
                case 1:
                  useStateText = "已取出";
                  break;
                case 2:
                  useStateText = "处理中";
                  break;
                case 3:
                  useStateText = "成功";
                  break;
                case 4:
                  useStateText = "失败";
                  break;
                case 5:
                  useStateText = "可疑";
                  break;
                case 6:
                  useStateText = "可疑核查中";
                  break;
              }
              this.$notify({
                title: "成功",
                message:
                  "修改卡ID为：" + data.id + "的卡状态修改为" + useStateText,
                type: "success"
              });
              this.editCardStateLoading = false;
              this.addFaceValueVisibel = false;
              this.batchEditUseStateVisible = false;
            } else {
              this.editCardStateLoading = false;
              this.$message, error(res.msg);
            }
          });
        }
      });
    },

    //每一页显示的数量
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
<style>
.el-dialog {
  width: 420px;
  height: 240px;
  top: 25% !important;
  margin-top: 0px !important;
}
.el-dropdown-link {
  width: 100%;
  display: block;
  padding: 3px 38px;
}
.box-card-pagination {
  float: none !important;
  padding: 0px !important;
  margin-top: 18px;
  height: 36px;
}
.cancer {
  float: left;
}
.el-pagination {
  float: right;
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
  }
}
</style>