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
        <el-form-item style="float:right;">
          <el-button type="success" @click="openAdd">新增产品</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="tableData" :empty-text="emptytext" border style="width: 100%" v-loading='loading' element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
      <el-table-column prop="id" align="center" label="编号" width="130px"> </el-table-column>
      <el-table-column prop="name" align="center" label="产品名称"></el-table-column>
      <el-table-column prop="private" align="center" label="私有" width="150px">
        <template slot-scope='scope'>
          <el-radio-group v-model="scope.row.private" @change="editProductPrivate(scope.$index,scope.row)" size="mini">
            <el-radio-button label=0>非私有</el-radio-button>
            <el-radio-button label=1>私有</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" align="center" label="基础单价" width="100px"> </el-table-column>
      <el-table-column prop="state" align="center" label="状态" width="140px">
        <template slot-scope='scope'>
          <el-radio-group v-model="scope.row.state" @change="editProductState(scope.$index,scope.row)" size="mini">
            <el-radio-button label=0>异常</el-radio-button>
            <el-radio-button label=1>正常</el-radio-button>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label='操作' align="center" width='150px' fixed="right">
        <template slot-scope='scope'>
          <el-dropdown :hide-on-click="false" trigger="click" style="cursor:pointer">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="openShowInfo(scope.row, scope.$index)">&nbsp;查看详细&nbsp;</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="openEditInfo(scope.row, scope.$index)">&nbsp;修改&nbsp;</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div class="box-card-pagination">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formInline.page" :page-sizes="[10,20,30, 50]" :page-size="formInline.limit" layout="total, sizes, prev, pager, next, jumper" :total="formInline.total">
      </el-pagination>
    </div>
    <el-dialog title="产品信息" :visible.sync="addInfoVisible" label-width="140px" :fullscreen="true">
      <el-form ref="form" :model="formInfo" label-width="140px">
        <el-form-item label="产品名称">
          <el-input v-model="formInfo.name" class="my-input" size="small" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="是否私有">
          <el-radio-group v-model="formInfo.private" size="mini">
            <el-radio-button label=0>非私有</el-radio-button>
            <el-radio-button label=1>私有</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="基础单价">
          <el-input-number size="mini" v-model="formInfo.unitPrice" :precision="4"  :step="0.1" :max="9999999999" ></el-input-number>
        </el-form-item>
        <el-form-item label="最小数量">
          <el-input-number size="mini" v-model="formInfo.minNumber" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="最大数量">
          <el-input-number size="mini" v-model="formInfo.maxNumber" :min="1" :max="999999999"></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formInfo.state" size="mini">
            <el-radio-button label=0>下架</el-radio-button>
            <el-radio-button label=1>在售</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单附加信息模板"> 
          <el-table :data="formInfo.additionTemplate" style="width: 100%">
            <el-table-column type="index" label="编号" align="center" :index="indexMethod" width="50px"></el-table-column>
            <el-table-column label="Key" align="center" width="180">
              <template slot-scope='scope'>
                <el-input v-model="scope.row.key" size="small" clearable placeholder="请输入Key"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="Value">
              <template slot-scope='scope'>
                <el-input type="textarea" class="my-temp" :autosize="{ minRows: 1, maxRows: 4}" placeholder="请输入Value" :blur="tempValueBlur" v-model="scope.row.value"> </el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="120">
              <template slot-scope='scope'>
                <el-button type="text" v-if="scope.$index==formInfo.additionTemplate.length-1" @click="addTemp">新增</el-button>
                <el-button type="text" v-if="scope.$index!=0 || formInfo.additionTemplate.length > 1" @click="delTemp(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" class="my-input" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入描述" v-model="formInfo.describe"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="addInfoLoading" @click="addInfo">提交</el-button>
          <el-button @click="closeAdd">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="产品信息" :visible.sync="showInfoVisible" label-width="140px" :fullscreen="true">
      <el-form ref="form" :model="formInfo" label-width="140px">
        <el-form-item label="产品名称">
          {{formInfo.name}}
        </el-form-item>
        <el-form-item label="是否私有">
          {{formInfo.private == false ?"非私有":"私有"}}
        </el-form-item>
        <el-form-item label="基础单价">
          {{formInfo.unitPrice}}
        </el-form-item>
        <el-form-item label="最小数量">
          {{formInfo.minNumber}}
        </el-form-item>
        <el-form-item label="最大数量">
          {{formInfo.maxNumber}}
        </el-form-item>
        <el-form-item label="状态">
          {{formInfo.private == true ?"正常":"异常"}}
        </el-form-item>
        <el-form-item label="订单附加信息模板"> 
          <el-table :data="formInfo.additionTemplate" style="width: 100%">
            <el-table-column type="index" label="编号" align="center" :index="indexMethod" width="50px"></el-table-column>
            <el-table-column label="Key" prop="key" align="center" width="120">
            </el-table-column>
            <el-table-column align="center" label="Value">
              <template slot-scope='scope'>                
                <span v-if="scope.row.value==null||scope.row.value==''">{{scope.row.value}}</span>
                <el-select v-if="scope.row.value!=null&&scope.row.value!=''" v-model="scope.row.selectValue">
                  <el-option v-for="item in getValueList(scope.row.value)" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="描述">
          {{formInfo.describe}}
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { addProduct, getProducts, editState, editPrivate, editProduct } from '@/api/product'
import { productTempConvert } from '@/utils/format'

export default {
  name: 'mproducts',
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  data() {
    return {
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
      formInfo: {
        id: null,
        name: null,
        private: 0,
        unitPrice: null,
        minNumber: null,
        maxNumber: null,
        state: 1,
        isInput: 0,
        additionTemplate: [{
          key: null,
          value: null,
          selectValue: null
        }],
        describe: null
      },
      states: [
        { id: 0, name: '下架' },
        { id: 1, name: '在售' }
      ],
      tableData: [],
      emptytext: '暂无数据',
      loading: false,
      addInfoLoading: false
    }
  },
  created() {
    this.getlist()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    clearFormInfo() {
      this.formInfo = { id: null, name: null, private: 0, unitPrice: null, minNumber: null, maxNumber: null, state: null, isInput: 0, additionTemplate: [{ key: null, value: null }], discribe: null }
    },
    openAdd() {
       this.formInfo.maxNumber=9999999
      this.addInfoVisible = true
    },
    addTemp() {
      this.formInfo.additionTemplate.push({ key: null, value: null })
    },
    tempValueBlur(val) {
      val = productTempConvert(val)
    },
    addInfo() {
      const arr = this.checkJson(this.formInfo.additionTemplate)
      if (this.formInfo.name == null || this.formInfo.name === '' || arr == null || arr.length < 1) {
        this.$message.error('产品名称/订单附加信息模板不能为空')
      } else {
        this.addInfoLoading = true
        let id = 0
        if (this.formInfo.id != null && this.formInfo.id > 0) {
          id = this.formInfo.id
        }
        var data = { id: id,
          name: this.formInfo.name,
          private: parseInt(this.formInfo.private),
          unitPrice: this.formInfo.unitPrice,
          minNumber: this.formInfo.minNumber,
          maxNumber: this.formInfo.maxNumber,
          state: parseInt(this.formInfo.state),
          additionTemplate: JSON.stringify(arr),
          describe: this.formInfo.describe }
        if (id > 0) {
          editProduct(data).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '修改成功！',
                type: 'success'
              })
            }
            this.addInfoLoading = false
          }).catch(()=>{
            this.addInfoLoading = false
          })
        } else {
          addProduct(data).then(res => {
            if (res.code == 0) {
              this.$message({
                message: '添加成功！',
                type: 'success'
              })
            }
            this.addInfoLoading = false
          }).catch(()=>{
            this.addInfoLoading = false
          })
        }
        this.getlist()
        this.addInfoVisible = false
      }
    },
    editProductState(index, row) {
      var obj = { Id: row.id, State: parseInt(row.state) }
      editState(obj).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '修改产品状态成功！',
            type: 'success'
          })
        }
      })
      this.getlist();
    },
    editProductPrivate(index, row) {
      var obj = { Id: row.id, State: parseInt(row.private) }
      editPrivate(obj).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '修改产品私有状态成功！',
            type: 'success'
          })
        }
      })
      this.getlist()
    },
    delTemp(index, row) {
      this.formInfo.additionTemplate.splice(index, 1)
    },
    checkJson(val) {
      const arr = []
      val.forEach((row, index) => {
        if (row.key != null && row.key !== '' && row.key !== undefined) {
          arr.push(row)
        }
      })
      return arr
    },
    showAddTemp(index, row) {
      return index === this.formInfo.additionTemplate.length
    },
    clearText() {
      this.formInline.state = null
      this.formInline.nameOrId = null
    },
    closeAdd() {
      this.addInfoVisible = false
      this.clearFormInfo()
    },
    handleSizeChange(val) {
      this.formInline.limit = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.formInline.page = val
      this.getlist()
    },
    onSubmit() {
      this.formInline.page = 1
      this.getlist()
    },
    getlist() {
      this.loading = true
      var data = this.formInline
      getProducts(data).then(res => {
        if (res.code === 0) {
          if (res.data != null && res.data.length > 0) {
            
            this.tableData = res.data
            this.tableData.forEach((row, index) => {
              row.additionTemplate = JSON.parse(row.additionTemplate)
              row.state = row.state === true ? 1 : 0
              row.private = row.private === true ? 1 : 0
            })
            this.formInline.total = res.count
            this.loading = false
          } else {
            this.tableData = []
            this.formInline.total = 0
            this.loading = false
          }
        }
      }).catch(()=>{
            this.loading = false
          });
    },
    openShowInfo(row, index) {
      this.showInfoVisible = true
      this.formInfo = row
    },
    openEditInfo(row, index) {
      this.addInfoVisible = true
      this.formInfo = row
    },
    getValueList(val) {
      let list = []
      if (val != null && val !== '') {
        list = val.split('\n')
      }
      return list
    }
  }
}
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