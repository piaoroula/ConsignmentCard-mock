<template>
  <div class="dashboard-container bacground Consignment">
    <div style="margin: 20px;"></div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="普通寄售" name="first">
        <div class="box-card-tip">
          <p>请勿必严格确认面值是否正确。面值不符导致的损失需自行承担。</p>
          <p>本系统内置卡密整理功能；兼容大多数卡号密码在一行这类的卡密，如果格式化不正确请联系客服处理。</p>
        </div>
        <el-form :label-position="labelPosition" label-width="80px" :model="consignment" ref="consignment" :rules="consignmentrules">
          <el-form-item label="寄售通道" prop='Channel'>
            <el-select v-model="consignment.Channel" filterable clearable placeholder="请选择寄售通道" @change='selectChannels'>
              <el-option v-for="channel in ChannelList" :key="channel.id" :label="channel.name" :value="channel.id">
                <span style="float: left">{{ channel.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ channel.buyRate }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卡面值" prop='FaceValue'>
            <el-select v-model="consignment.FaceValue" clearable placeholder="请先选择寄售通道" no-data-text='无数据'>
              <el-option v-for="FaceValues in FaceValueList" :key="FaceValues.id" :label="FaceValues.faceValue" :value="FaceValues.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卡密列表" prop='Cards'>
            <el-input type="textarea" :rows="10" v-model="consignment.Cards" :placeholder="placeholder" @blur="consignmentBlur"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitConsignmentLoading" @click="onSubmitConsignment()">立即提交</el-button>
            <el-button @click="resetForm(consignment)">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="快速寄售" name="second">
        <el-form :label-position="labelPosition" label-width="80px" :model="autoform" ref="autoform" :rules="autoformrules">
          <div class="box-card-tip">
            <p>快速寄售根据卡密规则自动判断卡密的类型。如果寄售返回类型判断失败，请使用“普通寄售”。</p>
            <p>卡面值默认选择的的“100”，请根据您本次提交的卡的面值选择对应选项。勿必严格确认面值正确。面值不符导致的损失需自行承担。</p>
            <p>本系统内置卡密整理功能；兼容大多数卡号密码在一行这类的卡密，如果格式化不正确请联系客服处理。</p>
          </div>
          <el-form-item label="卡面值" prop='facevalue'>
            <el-radio-group v-model="autoform.facevalue" size="medium">
              <el-radio v-for="fv in facevalues" :key="fv.id" :label="fv.id" :value="fv.id" border>{{fv.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="卡密列表" prop='Cards'>
            <el-input type="textarea" :rows="10" v-model="autoform.Cards" :placeholder="placeholder" @blur="autoconsignmentBlur"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitautoConsignmentLoading" @click="onSubmitautoConsignment()">立即提交</el-button>
            <el-button @click="resetForm(autoform)">重置</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>
    </el-tabs>
    <el-dialog title="寄售提交失败的列表及原因" :visible.sync="errorVisible">
      <el-table :data="errorList" border style="width: 100%">
        <el-table-column prop="row" align="center" label="行号" width="50"></el-table-column>
        <el-table-column prop="cardNumber" align="center" label="卡号" width="170"></el-table-column>
        <el-table-column prop="reason" align="center" label="原因"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  GetChannels,
  getFaceValues,
  submitConsignment,
  submitautoConsignment
} from "@/api/card";
import VeeValidate, { Validator } from "vee-validate";
import { cardsConvert } from "@/utils/format";
export default {
  name: "consignment",
  data() {
    return {
      errorList: [],
      errorVisible: false,
      activeName: "first",
      submitConsignmentLoading: false,
      submitautoConsignmentLoading: false,
      labelPosition: "right",
      consignment: {
        Channel: "",
        FaceValue: "",
        Cards: ""
      },
      cardCount: 0,
      consignmentrules: {
        Channel: [
          {
            required: true,
            message: "请选择寄售通道",
            trigger: "change"
          }
        ],
        FaceValue: [
          {
            required: true,
            message: "请选择卡面值",
            trigger: "change"
          }
        ],
        Cards: [
          {
            required: true,
            message: "请输入卡密列表",
            trigger: "blur"
          }
        ]
      },
      ChannelList: [
        {
          id: "",
          name: ""
        }
      ],
      FaceValueList: [
        {
          id: "",
          faceValue: ""
        }
      ],
      placeholder: "卡号[任意符号]密码 每行一张；例如 123567 7891234",
      facevalues: [
        { id: 5, name: "5元" },
        { id: 10, name: "10元" },
        { id: 15, name: "15元" },
        { id: 20, name: "20元" },
        { id: 30, name: "30元" },
        { id: 40, name: "40元" },
        { id: 50, name: "50元" },
        { id: 100, name: "100元" },
        { id: 200, name: "200元" },
        { id: 300, name: "300元" },
        { id: 500, name: "500元" },
        { id: 1000, name: "1000元" }
      ],
      autoform: {
        facevalue: 100,
        Cards: ""
      },
      autoformrules: {
        facevalue: [
          {
            required: true,
            message: "请选择卡面值",
            trigger: "change"
          }
        ],
        Cards: [
          {
            required: true,
            message: "请输入卡密列表",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getChannelList();
    // this.getFaceValueList();
  },
  methods: {
    // 获取寄售通道列表
    getChannelList() {
      GetChannels().then(res => {
        if (res.code === 0) {
          this.ChannelList = res.data;
        } else {
          this.$message.error("获取寄售通道数据失败");
        }
      });
    },
    //获取卡面值，通过寄售通道的id获取对应的卡面值
    selectChannels(vId) {
      getFaceValues({ cid: vId }).then(res => {
        if (res.code === 0) {
          if (res.data != undefined) {
            this.FaceValueList = res.data;
          } else {
            this.FaceValueList = [];
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //普通寄售卡密列表转换
    consignmentBlur() {
      var cardsArry = [];
      cardsArry = cardsConvert(this.consignment.Cards);
      if (cardsArry != null) {
        this.cardCount = cardsArry.length;
        this.consignment.Cards = cardsArry.join("\n");
      }
    },

    //普通寄售提交
    onSubmitConsignment() {
      this.submitConsignmentLoading = true;
      this.$refs.consignment.validate(valid => {
        if (valid) {
          if (this.cardCount >= 1000) {
            this.$message.error("一次最大允许寄售1000张卡，请修改后重新寄售");
          } else {
            this.$confirm(
              "检测到" + this.cardCount + "张卡密信息, 是否要提交寄售?",
              "提示",
              {
                confirmButtonText: "提交寄售",
                cancelButtonText: "取消",
                type: "warning"
              }
            )
              .then(() => {
                var data = {
                  Channel: this.consignment.Channel,
                  FaceValue: this.consignment.FaceValue,
                  Cards: cardsConvert(this.consignment.Cards)
                };
                submitConsignment(data).then(res => {
                  if (res.code === 0) {
                    this.submitConsignmentLoading = false;
                    this.consignment.Cards = "";
                    this.$message.success(res.msg + this.cardCount + "张卡");
                  } else {
                    this.submitConsignmentLoading = false;
                    this.$message.error(res.msg);
                  }
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消寄售"
                });
              });
          }
        } else {
          this.submitConsignmentLoading = false;
          return false;
        }
      });
    },
    //快速寄售卡密列表转换
    autoconsignmentBlur() {
      var cardsArry = [];
      cardsArry = cardsConvert(this.autoform.Cards);
      if (cardsArry != null) {
        this.cardCount = cardsArry.length;
        this.autoform.Cards = cardsArry.join("\n");
      }
    },
    //快速提交
    onSubmitautoConsignment() {
      this.submitautoConsignmentLoading = true;
      this.$refs.autoform.validate(valid => {
        if (valid) {
          this.$confirm(
            "检测到" + this.cardCount + "张卡密信息, 是否要提交寄售?",
            "提示",
            {
              confirmButtonText: "提交寄售",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              var data = {
                facevalue: this.autoform.facevalue,
                Cards: cardsConvert(this.autoform.Cards)
              };
              submitautoConsignment(data).then(res => {
                console.log(res);
                if (res.code === 2) {
                  if (res.item.length > 0) {
                    this.submitautoConsignmentLoading = false;
                    this.$confirm(res.msg, "提示", {
                      confirmButtonText: "查看失败原因",
                      type: "warning"
                    }).then(() => {
                      this.errorList = res.item;
                      this.errorVisible = true;
                    });
                  }
                } else if (res.code === 3) {
                  this.submitautoConsignmentLoading = false;
                  this.$message.error(res.msg);
                }
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消寄售"
              });
            });
        } else {
          this.submitautoConsignmentLoading = false;
          return false;
        }
      });
    },
    //重置普通寄售
    resetForm(consignment) {
      this.$refs.consignment.resetFields();
      this.$message.success("重置成功");
    },
    //重置快速寄售
    resetForm(autoform) {
      this.$refs.autoform.resetFields();
      this.$message.success("重置成功");
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
<style>
.el-form-item__error {
  display: inline;
  margin-left: 10px;
  position: relative;
}

.el-radio--medium.is-bordered {
  margin-bottom: 10px;
  margin-right: 10px;
}
.el-radio.is-bordered + .el-radio.is-bordered {
  margin-right: 10px;
  margin-left: 0px;
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
    margin: 10px 0 20px 0;
    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5em;
    }
  }
}
</style>