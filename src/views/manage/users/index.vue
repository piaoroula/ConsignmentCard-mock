<template>
  <el-card class='box-card'>
    <div slot='header' class='box-card-header clearfix'>
      <el-form :inline='true' :model='formInline' class='demo-form-inline'>
        <el-form-item label='用户名'>
          <el-input placeholder='用户邮箱/用户名' v-model='formInline.userName' clearable></el-input>
        </el-form-item>
        <el-form-item label='账号状态'>
          <el-select v-model='formInline.state' placeholder='请选择账号状态'>
            <el-option v-for='state in states' :key='state.id' :label='state.name' :value='state.id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='onSubmit'>提交查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-tag type="success">总余额： {{balances}} 元</el-tag>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="寄售用户" name="Consign"></el-tab-pane>
      <el-tab-pane label="订单用户" name="Order"></el-tab-pane>
      <el-tab-pane label="其他用户" name="Other"></el-tab-pane>
    </el-tabs>
    <div class="box-card-table">
      <el-table :data='tableData' v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" border style='width: 100%'>
        <el-table-column prop='id' align="center" label='编号' width='80px'></el-table-column>
        <el-table-column prop='realName' align="center" label='用户名'> </el-table-column>
        <el-table-column prop='email' align="center" label='邮箱'> </el-table-column>
        <el-table-column prop='phoneNumber' align="center" label='手机号' width='120px'> </el-table-column>
        <el-table-column prop='balance' align="center" label='余额' width='120px'> </el-table-column>
        <!-- <el-table-column label='可寄售' align="center" width='110px' style='text-align:center;'>
          <template slot-scope='scope'>
            <el-switch v-model='scope.row.canConsign' @change="editConsignState(scope.$index,scope.row)" active-text='是' inactive-text='否' :disabled="editDisabled"></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label='账号状态' width='140px'>
          <template slot-scope='scope'>
            <el-switch v-model='scope.row.isEnabled' @change="editUserState(scope.$index,scope.row)" active-text='正常' inactive-text='禁用'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作' width='150px' align="center" fixed='right'>
          <template slot-scope='scope'>
            <el-dropdown :hide-on-click="false" zhangtrigger="click" style="cursor:pointer">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="activeName=='Consign'">
                  <span @click="openAccount(scope.row)">收款账号</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="activeName=='Other'">
                  <span @click="OpenUserRole(scope.row)">设置角色</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="openidentity(scope.row)">身份验证</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="activeName=='Consign'">
                  <span @click="goPages(1, scope.row)">寄售明细</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="activeName=='Consign'">
                  <span @click="goPages(2, scope.row)">提现记录</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="this.activeName=='Consign'||this.activeName=='Order'">
                  <span @click="openPages(scope.row)">密价</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="activeName=='Consign'">
                  <span @click="openApi(scope.row)">API权限</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class='box-card-pagination'>
      <el-pagination background @size-change='handleSizeChange' @current-change='handleCurrentChange' :current-page='formInline.page' :page-sizes='[10,20,30, 50]' :page-size='formInline.limit' layout='total, sizes, prev, pager, next, jumper' :total='total'>
      </el-pagination>
    </div>
    <div class="pricediv">
      <el-dialog :title="formInPrice.userName" :visible.sync="speciaPriceVisible">
        <el-table :data="priceData" v-loading="childloading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :empty-text="emptytext" border style="width: 100%">
          <el-table-column prop="id" align="center" label="编号"></el-table-column>
          <el-table-column prop="name" align="center" label="通道名称"></el-table-column>
          <el-table-column prop="buyRate" align="center" label="费率">
            <template slot-scope='scope'>
              <el-input v-model="scope.row.buyRate" @blur="editPrice(scope.$index,scope.row)" placeholder="请输入费率"></el-input>
            </template>
          </el-table-column>
          <el-table-column label='寄售权限' align="center">
            <template slot-scope='scope'>
              <el-switch v-model='scope.row.canConsign' @change="editChannelConsignState(scope.$index,scope.row)" active-text='有' inactive-text='无'></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <div class="box-card-pagination" style="margin:20px 0; height:100%;">
          <el-pagination background @size-change="chandleSizeChange" @current-change="chandleCurrentChange" :current-page="formInPrice.page" :page-sizes="[6]" :page-size="formInPrice.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-dialog>
    </div>
    <div class="pricediv">
      <el-dialog :title="formInProduct.userName" :visible.sync="productVisible">
        <el-table :data="productData" v-loading="productloading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :empty-text="emptytext" border style="width: 100%">
          <el-table-column prop="id" align="center" label="编号"></el-table-column>
          <el-table-column prop="name" align="center" label="产品名称"></el-table-column>
          <el-table-column prop="price" align="center" label="价格">
            <template slot-scope='scope'>
              <el-input v-model="scope.row.price" @blur="editPrice(scope.$index,scope.row)" placeholder="请输入价格"></el-input>
            </template>
          </el-table-column>
          <el-table-column label='订单权限' align="center">
            <template slot-scope='scope'>
              <el-switch v-model='scope.row.canOrder' @change="editProductOrderState(scope.$index,scope.row)" active-text='有' inactive-text='无'></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <div class="box-card-pagination" style="margin:20px 0; height:100%;">
          <el-pagination background @size-change="productSizeChange" @current-change="productCurrentChange" :current-page="formInProduct.page" :page-sizes="[6]" :page-size="formInProduct.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-dialog>
    </div>
    <div class="apidiv">
      <el-dialog title="API信息" size=small :visible.sync="apiVisible" class="api-el-dialog" label-width="80px">
        <el-form ref="form" :model="formInApi" label-width="80px">
          <el-form-item label="AppID">
            {{ formInApi.id }}
          </el-form-item>
          <el-form-item label="SecretKey">
            {{ formInApi.secretKey }}
          </el-form-item>
          <el-form-item label="回调地址">
            {{ formInApi.callbackUrl }}
          </el-form-item>
          <el-form-item label="状态">
            <el-switch v-model="formInApi.state" active-text='正常' @change="editApiState" inactive-text='禁用'></el-switch>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="identity">
      <el-dialog title="身份验证信息" size=small :visible.sync="identityVisible" class="api-el-dialog" label-width="80px">
        <el-form ref="form" :model="formIdentity" label-width="120px" style="height:500px;overflow-y:auto;">
          <el-form-item v-if="hasConsign == false">
            <font color="red">
              *&nbsp;如身份信息验证合格，可在列表页给该用户设置寄售权限！
            </font>
          </el-form-item>
          <el-form-item label="身份证号">
            {{ formIdentity.idCard }}
          </el-form-item>
          <el-form-item label="身份证正面照">
            <a @click="showImg(formIdentity.idImgFront)"><img :src="formIdentity.idImgFront" width="308" height="175" /></a>
          </el-form-item>
          <el-form-item label="身份证反面照">
            <a @click="showImg(formIdentity.idImgBack)"><img :src="formIdentity.idImgBack" width="308" height="175" /></a>
          </el-form-item>
          <el-form-item label="手持身份证件照">
            <a @click="showImg(formIdentity.idImgHold)"><img :src="formIdentity.idImgHold" width="308" height="175" /></a>
          </el-form-item>
          <el-form-item label="身份验证">
            <el-switch v-model="hasConsign" active-text='通过' @change="editApiState" inactive-text='不通过'></el-switch>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="rolediv">
      <el-dialog title="设置用户角色" size=small :visible.sync="roleVisible" class="api-el-dialog" label-width="80px">
        <el-form ref="form" :model="formInRole" label-width="80px">
          <el-form-item label="设置角色">
            <el-checkbox-group v-model="formInRole.Ids" size="mini">
              <el-checkbox v-for="role in roleList" :label="role.name" :key="role.id" :value="role.id" :checked="checked" @change="checked=!checked"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="setRoleLoading" @click="setRole">提交</el-button>
            <el-button @click="roleVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="accountdiv">
      <el-dialog title="提现账号管理" :visible.sync="accountVisible">
        <el-button type="primary" @click="openAddAccount">新增提现账号</el-button>
        <el-table :data="formInAccount.accounts" :empty-text="emptytext" border style="width: 100%;height:350px;overflow-y:auto;">
          <el-table-column prop="id" align="center" label="编号"></el-table-column>
          <el-table-column prop="account" align="center" label="收款账户"></el-table-column>
          <el-table-column prop="institution" align="center" label="机构名称"></el-table-column>
          <el-table-column prop="accountBank" align="center" label="开户行"></el-table-column>
          <el-table-column label='操作' align="center" width='150px'>
            <template slot-scope='scope'>
              <el-button type="text" @click="deleteInfo(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <div class="addacountdiv">
      <el-dialog title="新增收款账号" size=small :visible.sync="addAccountVisible" class="api-el-dialog" label-width="80px">
        <el-form ref="form" :model="addSettlementAccount" label-width="120px">
          <el-form-item label="* ">
            <el-tag type="danger">出于安全考虑， 一旦设置后，不可修改！请务必慎重确认。</el-tag>
          </el-form-item>
          <el-form-item label="收款人姓名">
            {{formInAccount.name}}
          </el-form-item>
          <el-form-item class="showsubmit-value" label="机构名称">
            <el-select v-model="addSettlementAccount.institution" filterable size="medium" placeholder="请选择机构名称 ">
              <el-option v-for="account in institutions " :key="account.value" :label="account.value" :value="account.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开户行">
            <el-input type="text" v-model='addSettlementAccount.accountBank' placeholder="请输入开户行"></el-input>
          </el-form-item>
          <el-form-item label="收款账户">
            <el-input type="text" v-model='addSettlementAccount.account' placeholder="请输入收款账户"></el-input>
          </el-form-item>
          <el-form-item size="large ">
            <el-button type="primary " :loading="accountAddLoading" @click="submitAccount">提交保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <el-dialog :visible.sync="picVisible" class="identity">
      <img :src="picUrl" width="100%" />
    </el-dialog>
  </el-card>
</template>
<script>
import { mapGetters } from "vuex";
import {
  getUsers,
  updateUserState,
  updateConsignState,
  getUserPrice,
  getUserProductPrice,
  updateUserChannelConsignState,
  updateUserProductOrderState,
  updateUserBuyRate,
  getApiInfo,
  updateApiState,
  addApi,
  GetBalances,
  getverification,
  getRoles,
  getRoleByID,
  updateUserRole,
  getAccounts,
  addAccount,
  deleteAccount
} from "@/api/manage";
export default {
  name: "users",
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      activeName: "Consign",
      balances: null,
      formInline: {
        userName: "",
        roleName: "",
        state: null,
        page: 1,
        limit: 20
      },
      total: 0,
      formInPrice: {
        userId: null,
        userName: null,
        state: null,
        page: 1,
        limit: 6
      },
      total: 0,
      formInProduct: {
        userId: null,
        userName: null,
        state: null,
        page: 1,
        limit: 6
      },
      total: 0,
      formInApi: {
        userId: null,
        id: null,
        secretKey: null,
        callbackUrl: null,
        state: null
      },
      formIdentity: {
        idCard: "",
        idImgFront: null,
        idImgBack: null,
        idImgHold: null
      },
      formInAccount: {
        userId: null,
        accounts: [],
        name: null
      },
      hasConsign: false,
      speciaPriceVisible: false,
      productVisible: false,
      picVisible: false,
      apiVisible: false,
      roleVisible: false,
      accountVisible: false,
      addAccountVisible: false,
      accountAddLoading: false,
      setRoleLoading: false,
      loading: false,
      childloading: false,
      productloading: false,
      identityVisible: false,
      editDisabled: true,
      emptytext: "暂无数据",
      states: [
        { id: null, name: "请选择账号状态" },
        { id: true, name: "正常" },
        { id: false, name: "禁用" }
      ],
      formInRole: {
        userId: null,
        userName: null,
        Ids: []
      },
      oldRoles: [],
      roleList: [],
      tableData: [],
      priceData: [],
      productData: [],
      picUrl: null,
      institutions: [
        { value: "支付宝" },
        { value: "中国银行" },
        { value: "中国工商银行" },
        { value: "中国农业银行" },
        { value: "中国建设银行" },
        { value: "中国进出口银行" },
        { value: "中国农业发展银行" },
        { value: "国家开发银行" },
        { value: "中国光大银行" },
        { value: "中国民生银行" },
        { value: "广发银行" },
        { value: "平安银行" },
        { value: "中信银行" },
        { value: "恒丰银行" },
        { value: "交通银行" },
        { value: "招商银行" },
        { value: "浙商银行" },
        { value: "兴业银行" },
        { value: "上海浦东发展银行" },
        { value: "城市商业银行" },
        { value: "农村商业银行" },
        { value: "农村信用社" },
        { value: "邮政储蓄银行" },
        { value: "渤海银行" },
        { value: "徽商银行" },
        { value: "村镇银行" },
        { value: "重庆三峡银行" },
        { value: "农村合作银行" },
        { value: "城市信用社" },
        { value: "花旗银行" },
        { value: "汇丰银行" },
        { value: "恒生银行" },
        { value: "上海农村商业银行" },
        { value: "永亨银行" },
        { value: "渣打银行" },
        { value: "上海银行" },
        { value: "东亚银行" },
        { value: "星展银行" },
        { value: "创兴银行" },
        { value: "永隆银行" },
        { value: "大新银行" },
        { value: "首都银行" },
        { value: "中央结算公司" },
        { value: "厦门国际银行" },
        { value: "民营银行" },
        { value: "盘谷银行" },
        { value: "澳新银行" },
        { value: "国泰世华" }
      ],
      addSettlementAccount: {
        institution: null,
        account: null,
        userId: null,
        name: null,
        accountBank: null
      }
    };
  },
  created() {
    this.formInline.roleName = "Consign";

    this.getlist();
    this.getUserProduct();
    this.getUserPriceData();
    // this.getbalance();
    this.setRoleList();
  },
  methods: {
    //获取寄售用户数据
    getlist() {
      this.loading = true;
      var data = {
        page: this.formInline.page,
        limit: this.formInline.limit,
        isEnabled: this.formInline.state,
        userName: this.formInline.userName,
        roleName: this.activeName
      };
      getUsers(data).then(res => {
        console.log(res);
        if (res.code == 0) {
          if (res.total > 0) {
            this.tableData = res.item;
            this.total = res.total;
            this.balances = res.balances;
          } else {
            this.tableData = [];
            this.total = 0;
            this.emptytext = "暂无数据";
          }
        }
      });
      this.loading = false;
    },
    //修改账号状态
    editUserState(index, row) {
      var data = {
        id: row.id,
        isEnabled: row.isEnabled
      };
      updateUserState(data).then(res => {
        if (res.code == 0) {
          this.$message.success(res.msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取收款账号信息
    // openAccount(row) {
    //   this.accountVisible = true;
    //   getSettlementAccount(row.id).then(res => {
    //     if (res.code == 0) {
    //       this.formAccount = row;
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   });
    // },
    //获取寄售明细
    goPages(type, row) {
      if (type == 1) {
        this.$router.push({ path: "/card/cards" });
      } else {
        this.$router.push({ path: "/finance/settlements" });
      }
    },
    //密价弹窗口
    openPages(row) {
      //获取用户的userID
      this.formInPrice.userId = row.id;
      this.formInPrice.userName = row.realName;
      if (this.activeName == "Consign") {
        this.speciaPriceVisible = true;
        this.getUserPriceData();
      } else if (this.activeName == "Order") {
        this.productVisible = true;
        this.getUserProduct();
      }
    },
    //获取寄售用户的密价数据
    getUserPriceData() {
      var data = {
        limit: this.formInPrice.limit,
        page: this.formInPrice.page
      };
      this.childloading = true;
      getUserPrice(data)
        .then(res => {
          if (res.code == 0) {
            console.log(res);
            if (res.total > 0) {
              this.priceData = res.data;
              this.total = res.total;
            } else {
              this.tableData = 0;
              this.total = 0;
              this.emptytext = "暂无数据";
            }
          }
          this.childloading = false;
        })
        .catch(() => {
          this.childloading = false;
        });
    },
    //获取订单用户密价数据
    getUserProduct() {
      var data = {
        limit: this.formInProduct.limit,
        page: this.formInProduct.page
      };
      this.productloading = true;
      getUserProductPrice(data)
        .then(res => {
          if (res.code == 0) {
            if (res.total > 0) {
              this.productData = res.data;
              this.total = res.total;
            } else {
              this.productData = [];
              this.total = 0;
              this.emptytext = "暂无数据";
            }
          }
          this.productloading = false;
        })
        .catch(() => {
          this.productloading = false;
        });
    },
    //修改寄售用户密价的权限
    editChannelConsignState(index, row) {
      var data = {
        channelId: row.id,
        canConsign: row.canConsign,
        userId: this.formInPrice.userId
      };

      updateUserChannelConsignState(data).then(res => {
        if (res.code == 0) {
          this.$message.success(
            "用户" + this.formInPrice.userName + "的寄售权限修改成功"
          );
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //修改订单用户的权限editProductOrderState
    editProductOrderState(index, row) {
      var data = {
        productId: row.id,
        canOrder: row.canOrder,
        userId: this.formInPrice.userId
      };
      updateUserProductOrderState(data).then(res => {
        if (res.code == 0) {
          this.$message.success(
            "用户" + this.formInPrice.userName + "的寄售权限修改成功"
          );
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取角色列表
    //打开角色列表弹窗口
    setRoleList() {
      getRoles().then(res => {
        if (res.code == 0) {
          this.roleList = res.roleData;
        }
      });
    },
    //打开角色列表弹窗口OpenUserRole
    OpenUserRole(row) {
      this.roleVisible = true;
      this.formInRole.userId = row.id;
      this.formInline.userName = row.realName;
      this.formInRole.Ids = row.roles.split(",");
      this.oldRoles = row.roles.split(",");
    },
    //设置""其他用户的角色"
    setRole() {
      this.setRoleLoading = true;
      var data = {
        id: this.formInRole.userId,
        roles: this.formInRole.Ids
      };
      //JavaScript比较两个数组相等，利用toString
      if (this.formInRole.Ids.toString() == this.oldRoles.toString()) {
        this.$message.error("角色未做更改，请重新选择");
      } else if (this.formInRole.Ids.length < 1) {
        this.$message.error("角色还未选择，请选择");
      } else {
        updateUserRole(data)
          .then(res => {
            if (res.code == 0) {
              this.$notify({
                title: "成功",
                message:
                  "用户" +
                  this.formInline.userName +
                  "原状态为" +
                  this.oldRoles.toString() +
                  ",现修改为" +
                  this.formInRole.Ids.toString(),
                type: "success"
              });
              this.roleVisible = false;
            } else {
              this.$notify.error({
                title: "错误",
                message: res.msg
              });
            }
          })
          .catch(() => {
            this.setRoleLoading = false;
          });
      }
      this.setRoleLoading = false;
    },
    //身份验证、
    openidentity(row) {
      this.identityVisible = true;
      this.formIdentity.id = row.id;
      getverification(this.formIdentity.id).then(res => {
        console.log(res);
      });
    },
    editApiState() {
      if (this.hasConsign == true) {
        this.$message.success("身份验证通过");
        this.editDisabled = true;
      }
    },
    //API权限
    openApi(row) {
      this.$confirm(
        "用户" + row.realName + "暂时还没有API权限",
        "是否开通API权限?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // this.apiVisible = true;
          this.$message({
            type: "success",
            message: "开通API权限成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消API权限"
          });
        });
    },
    //onSubmit提交查询
    onSubmit() {
      this.getlist();
    },
    //重置
    onReset() {
      this.formInline = {
        userName: null,
        roleName: null,
        state: null
      };
      this.$message.success("重置成功");
    },
    //handleClick指定当前选中的标签页。
    handleClick(tab, event) {
      this.formInline.roleName = this.activeName;
      this.formInline.page = 1;
      this.getlist();
    },
    //分页
    handleCurrentChange(val) {
      this.formInline.page = val;
      this.getlist();
    },
    //每页显示多少
    handleSizeChange(val) {
      this.formInline.limit = val;
      this.getlist();
    },
    //订单用户密价弹框分页显示
    //分页
    productCurrentChange(val) {
      this.formInProduct.page = val;
      this.getUserProduct();
    },
    //每页显示多少
    productSizeChange(val) {
      this.formInProduct.limit = val;
      this.getUserProduct();
    },
    //寄售用户密价弹框分页显示
    //分页
    chandleCurrentChange(val) {
      this.formInPrice.page = val;
      this.getUserPriceData();
    },
    //每页显示多少
    chandleSizeChange(val) {
      this.formInPrice.limit = val;
      this.getUserPriceData();
    }
  }
};
</script>
<style>
.pricediv .el-dialog {
  width: 760px;
  height: 550px;
  top: 5% !important;
  margin-top: 0px !important;
}
.identity .el-dialog {
  width: 650px;
  max-width: 1080px;
  height: 650px;
  top: 5% !important;
  margin-top: 0px !important;
}
.apidiv .el-dialog {
  width: 420px;
  top: 25% !important;
  height: 350px;
  margin-top: 0px !important;
}
.rolediv .el-dialog {
  width: 650px;
  top: 25% !important;
  height: 350px;
  margin-top: 0px !important;
}
.addacountdiv .el-dialog {
  width: 550px;
  top: 15% !important;
  height: 450px;
  margin-top: 0px !important;
}
.accountdiv .el-dialog .el-button {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}
.accountdiv .el-dialog .el-table__row .el-button {
  position: initial;
  right: 1rem;
  bottom: 1rem;
}
.accountdiv .el-dialog {
  width: 60%;
  height: 50%;
  min-height: 500px;
  top: 5% !important;
  margin-top: 0px !important;
}
.el-dialog .el-table__row .el-input__inner {
  background: transparent;
  border: 0;
}
.el-dialog .el-table__row .el-input__inner:focus {
  border: 1px solid #409eff;
}
.el-dropdown-link {
  width: 100%;
  display: block;
  padding: 3px 38px;
}
</style>

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
