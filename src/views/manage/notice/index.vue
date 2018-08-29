<template>
  <el-card class='box-card'>
    <div slot='header' class='box-card-header clearfix'>
      <el-button type='primary' @click='onSubmit'>新增公告</el-button>
    </div>
    <div class="box-card-table">
      <el-table :data='tableData' v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" :empty-text="emptytext" border style='width: 100%'>
        <el-table-column prop='id' align="center" label='编号' width='80px'></el-table-column>
        <el-table-column prop='title' align="center" label='标题'> </el-table-column>
        <el-table-column prop='creationTime' align="center" label='创建时间'> </el-table-column>
        <el-table-column label='操作' align="center" width='150px'>
          <template slot-scope='scope'>
            <el-dropdown :hide-on-click="false" trigger="click" style="cursor:pointer">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <span @click="showInfo(scope.row, scope.$index)">&nbsp;查看详情&nbsp;</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="openInfo(scope.row, scope.$index)">&nbsp;修改&nbsp;</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="deleteInfo(scope.row, scope.$index)">&nbsp;删除&nbsp;</span>
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
    <div class="add-notice">
      <el-dialog title="公告信息" :visible.sync="noticeVisible">
        <el-form ref="form" :model="formInfo">
          <el-form-item>
            <el-input v-model="formInfo.title" placeholder="请输入公告标题"></el-input>
          </el-form-item>
          <el-form-item>
            <tinymce :height="300" v-model="formInfo.content" aria-placeholder="请输入公告内容"></tinymce>
          </el-form-item>
          <el-form-item style="bottom:20px;">
            <el-button type="primary" :loading="addInfoLoading" @click="addInfo">提交</el-button>
            <el-button @click="noticeVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <div class="add-notice">
      <el-dialog title="公告详情" :visible.sync="showNoticeVisible">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{formInfo.title}}</span>
            <el-tag style="float: right; padding: 3px 0" size="small" type="success">&nbsp;{{formInfo.creationTime}}&nbsp;</el-tag>
          </div>
          <div v-html="formInfo.content" style="height:430px; overflow-y: auto"></div>
        </el-card>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import Tinymce from '@/components/Tinymce'
import {
  getNoticesPage,
  addNotice,
  updateNotice,
  deleteNotice
} from '@/api/mNotice'

export default {
  name: 'notice',
  components: { Tinymce },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  data() {
    return {
      options: {
        group: 'mission'
      },
      addInfoLoading: false,
      tableData: [],
      facevalueData: [],
      formInfo: {
        id: null,
        title: null,
        content: ''
      },
      formInline: {
        page: 1,
        limit: 20,
        total: 0
      },
      loading: false,
      noticeVisible: false,
      showNoticeVisible: false,
      emptytext: '暂无数据'
    }
  },
  created() {
    this.getlist()
  },
  methods: {
    handleSizeChange(val) {
      this.formInfo.limit = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.formInfo.page = val
      this.getlist()
    },
    onSubmit() {
      this.clearFormInfo()
      this.noticeVisible = true
    },
    getlist() {
      var data = this.formInline
      this.tableData = []
      this.formInline.total = 0
      getNoticesPage(data).then(res => {
        if (res.code === 0) {
          if (res.data != null && res.data.length > 0) {
            this.tableData = res.data
            this.formInline.total = res.count
          }else{
            this.tableData = [];
          }
        }
      })
    },
    clearFormInfo() {
      this.formInfo.id = null
      this.formInfo.title = null
      this.formInfo.content = ''
    },
    openInfo(row, index) {
      this.formInfo = row
      this.noticeVisible = true
    },
    showInfo(row, index) {
      this.formInfo = row
      this.showNoticeVisible = true
    },
    deleteInfo(row, index) {
      this.formInfo = row
      this.$confirm('是否删除标题为[' + row.title + ']?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNotice(this.formInfo.id).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '删除公告成功！',
              type: 'success'
            })
          } else {
            this.$message.error('删除公告失败！')
          }
          this.addInfoLoading = false
        })
        this.getlist()
        this.clearFormInfo()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addInfo() {
      this.addInfoLoading = true
      var data = this.formInfo
      if (data.id > 0) {
        updateNotice(data).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '修改公告成功！',
              type: 'success'
            })
            this.getlist()
            this.noticeVisible = false
            this.clearFormInfo()
          } else {
            this.$message.error('修改公告失败！')
          }
          this.addInfoLoading = false
        }).catch(()=>{
            this.addInfoLoading = false
          });
      } else {
        addNotice(data).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '新增公告成功！',
              type: 'success'
            })
            this.getlist()
            this.noticeVisible = false
            this.clearFormInfo()
          } else {
            this.$message.error('新增公告失败！')
          }
          this.addInfoLoading = false
        }).catch(()=>{
            this.addInfoLoading = false
          });
      }
    }
  }
}
</script>
<style>
.add-notice .el-dialog {
  width: 95%;
  max-width: 900px;  
  height: 650px;
  top: 25px !important;
  margin-top: 0px !important;
}
.el-form-item--medium .el-form-item__content, .el-form-item--medium .el-form-item__label{
  line-height: 26px;
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