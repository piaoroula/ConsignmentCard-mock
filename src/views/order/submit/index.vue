<template>
  <el-card class="box-card">
    <div slot="header" class="box-card-header clearfix">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="产品ID/名称">
          <el-input placeholder='产品名称或ID' v-model='formInline.nameOrId' clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.state" filterable clearable placeholder="请选择状态">
            <el-option v-for="state in states" :key="state.id" :label="state.name" :value="state.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交查询</el-button>
          <el-button @click="clearText">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" :empty-text="emptytext" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column prop="id" align="center" label="产品编号" width="100px"> </el-table-column>
      <el-table-column prop="name" align="center" label="产品名称"></el-table-column>
      <el-table-column prop="unitPrice" align="center" label="基础单价" width="130px"> </el-table-column>
      <el-table-column label='操作' align="center" width='150px' fixed="right">
        <template slot-scope='scope'>
          <el-button @click="openAddOrder(scope.row, scope.$index)" type="text" size="small">下单</el-button>
          <el-button @click="goPages(scope.row)" type="text" size="small">订单记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="box-card-pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formInline.page" :page-sizes="[10,20,30, 50]" :page-size="formInline.limit" layout="total, sizes, prev, pager, next, jumper" :total="formInline.total">
      </el-pagination>
    </div>
    <el-dialog title="创建订单" :visible.sync="addInfoVisible" label-width="140px" :fullscreen="true">
      <el-form ref="form" :model="formInfo" label-width="140px">
         <el-form-item label="产品编号">
          {{formInfo.productId}}
        </el-form-item>
        <el-form-item label="产品名称">
          {{formInfo.name}}
        </el-form-item>
        <el-form-item label="产品单价">
          {{formInfo.unitPrice}}
        </el-form-item>
        <el-form-item label="下单数量">
          <el-input-number v-model="formInfo.orderNumber" :min="formInfo.minNumber" :max="formInfo.maxNumber" controls-position="right" @change="onchange"></el-input-number>
        </el-form-item>
        <el-form-item label="充值的账号" class="my-input">
          <el-input v-model="formInfo.account" placeholder="请输入充值的账号"></el-input>
        </el-form-item>
        <el-form-item label="账号的密码" class="my-input">
          <el-input type="password" v-model="formInfo.password" placeholder="仅在需要时输入账号的密码"></el-input>
        </el-form-item>
        <div v-for="item in formInfo.additionTemplate" :key="item.id">
          <el-form-item :label="item.key" class="my-input">
            <el-input class="my-temp" v-if="!item.value || item.value.indexOf('\n')==-1" v-model="item.value" clearable placeholder="请输入"></el-input>
            <el-select v-if="item.value!=null&&item.value!=''&&item.value.indexOf('\n')>=0" v-model="item.selectValue">
              <el-option v-for="val in getValueList(item.value)" :key="val" :label="val" :value="val"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="订单到期时间">
          <el-date-picker v-model="formInfo.periodOfValidity" :picker-options="pickerOptions" type="datetime" placeholder="订单到期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <label style="margin-right:20px;">订单总价格： {{ totalMoney==0? formInfo.unitPrice * formInfo.orderNumber :totalMoney }} 元</label>
        <el-button type="primary" :loading="addInfoLoading" @click="addInfo">提交</el-button>
        <el-button @click="closeAdd">取消</el-button>
      </span>
    </el-dialog>

  </el-card>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import { getProducts, addOrder } from "@/api/order";
export default {
  name: "submitorder",
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      totalMoney: 0.0,
      numbers: {},
      addInfoVisible: false,
      showInfoVisible: false,
      formInline: {
        state: null,
        nameOrId: null,
        page: 1,
        limit: 10,
        total: 0
      },
      formInfo: {},
      states: [{ id: 0, name: "异常" }, { id: 1, name: "正常" }],
      tableData: [],
      emptytext: "暂无数据",
      loading: false,
      addInfoLoading: false
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    indexMethod(index) {
      return index + 1;
    },
    clearText() {
      this.formInline.state = null;
      this.formInline.nameOrId = null;
    },
    handleSizeChange(val) {
      this.formInline.limit = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.formInline.page = val;
      this.getlist();
    },
    onSubmit() {
      this.formInline.page = 1;
      this.getlist();
    },
    onchange(value){
      this.totalMoney = value * this.formInfo.unitPrice
    },
    getlist() {
      this.loading = true;
      var data = this.formInline;
      getProducts(data).then(res => {
        if (res.code === 0) {
          if (res.data != null && res.data.length > 0) {
            this.tableData = res.data;
            this.tableData.forEach((row, index) => {
              row.additionTemplate = JSON.parse(row.additionTemplate);
              row.state = row.state === true ? 1 : 0;
              row.private = row.private === true ? 1 : 0;
            });
            this.formInline.total = res.count;
            this.loading = false;
          } else {
            this.tableData = [];
            this.formInline.total = 0;
            this.loading = false;
          }
        }
      });
    },
    goPages(row) {
      this.$router.push({ path: "record", params: { productId: row.id } });
    },
    openAddOrder(row, index) {
      this.formInfo = {
        productId: row.id,
        orderNumber: null,
        minNumber: row.minNumber,
        maxNumber: row.maxNumber,
        unitPrice: row.unitPrice,
        name:row.name,
        account: null,
        password: null,
        additionTemplate: row.additionTemplate,
        periodOfValidity: null
      };
      this.addInfoVisible = true;
    },
    addInfo() {
      if (this.formInfo.account == null || this.formInfo.account === "") {
        this.$message.error("充值账号/订单附加信息模板不能为空");
      } else {
        this.addInfoLoading = true;
        const arr = this.checkJson(this.formInfo.additionTemplate);
        const yxdate = moment(this.formInfo.periodOfValidity).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        var data = {
          productId: this.formInfo.productId,
          unitPrice: this.formInfo.unitPrice,
          orderNumber: this.formInfo.orderNumber,
          account: this.formInfo.account,
          password: this.formInfo.password,
          additionInfo: JSON.stringify(arr),
          userId: 0,
          remark: this.formInfo.remark,
          periodOfValidity: yxdate
        };

        addOrder(data)
          .then(res => {
            if (res.code === 0) {
              this.$confirm("已添加成功1个订单，是否继续提交订单", "提示", {
                confirmButtonText: "继续提交",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  this.formInfo.orderNumber = null;
                  this.formInfo.account = null;
                  this.formInfo.password = null;
                  this.formInfo.remark = null;
                  this.formInfo.periodOfValidity = null;
                })
                .catch(() => {
                  this.getlist();
                  this.addInfoVisible = false;
                });
            }
            this.addInfoLoading = false;
          })
          .catch(() => {
            this.addInfoVisible = false;
            this.addInfoLoading = false;
          });
      }
    },
    closeAdd() {
       this.addInfoVisible = false;
    },
    checkJson(val) {
      const arr = [];
      val.forEach((row, index) => {
        const _key = row.key;
        const _value = row.value;
        const _selectValue = row.selectValue;
        if (_key !== null && _key !== "" && _key !== undefined) {
          if (_value != null && _value !== "" && _value !== undefined) {
            if (_value.indexOf("\n") === -1) {
              arr.push({ key: _key, value: _value });
            } else if (
              _value.indexOf("\n") >= 0 &&
              _selectValue != null &&
              _selectValue !== "" &&
              _selectValue !== undefined
            ) {
              arr.push({ key: _key, value: _selectValue });
            } else {
              arr.push({ key: _key, value: null });
            }
          } else {
            arr.push({ key: _key, value: null });
          }
        }
      });
      return arr;
    },
    getValueList(val) {
      let list = [];
      if (val != null && val !== "") {
        list = val.split("\n");
      }
      return list;
    }
  }
};
</script>
<style>
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