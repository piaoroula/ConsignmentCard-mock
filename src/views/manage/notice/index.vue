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
            <tinymce :height="300" ref="editor" v-model="formInfo.content" aria-placeholder="请输入公告内容"></tinymce>
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
import { mapGetters } from "vuex";
import Tinymce from "@/components/Tinymce";
import {
  getNoticesPage,
  addNotice,
  updateNotice,
  deleteNotice
} from "@/api/mNotice";

export default {
  name: "notice",
  components: { Tinymce },
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      options: {
        group: "mission"
      },
      addInfoLoading: false,
      tableData: [],
      facevalueData: [],
      formInfo: {
        id: null,
        title: null,
        content: null,
        creationTime: null
      },
      oldTitle: null,
      oldContent: null,
      formInline: {
        page: 1,
        limit: 20,
        total: 0
      },
      loading: false,
      noticeVisible: false,
      showNoticeVisible: false,
      emptytext: "暂无数据"
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    //获取公告数据
    getlist() {
      this.loading = true;
      var data = {
        page: this.formInline.page,
        limit: this.formInline.limit
      };
      getNoticesPage(data)
        .then(res => {
          console.log(res);
          if (res.code == 0) {
            if (res.total > 0) {
              this.tableData = res.items;
              this.formInline.total = res.total;
            } else {
              this.tableData = [];
              this.formInline.total = 0;
            }
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //新增公告
    onSubmit() {
      this.formInfo = {};
      this.noticeVisible = true;
    },

    addInfo() {
      this.addInfoLoading = true;
      var data = {
        title: this.formInfo.title,
        content: this.formInfo.content
      };
      var updateData = {
        id: this.formInfo.id,
        title: this.formInfo.title,
        content: this.formInfo.content
      };
      if (this.formInfo.id != undefined) {
        if (
          this.formInfo.title == this.oldTitle &&
          this.formInfo.content == this.oldContent
        ) {
          this.addInfoLoading = false;
          this.$message.error("标题和内容没做更改");
        } else {
          updateNotice(updateData)
            .then(res => {
              if (res.code == 0) {
                this.noticeVisible = false;
                this.$message.success(res.msg);
              } else {
                this.$message.error(res.msg);
              }
              this.addInfoLoading = false;
            })
            .catch(() => {
              this.addInfoLoading = false;
            });
        }
      } else if (this.formInfo.id == undefined) {
        if (this.formInfo.title != null) {
          addNotice(data).then(res => {
            if (res.code == 0) {
              this.noticeVisible = false;
              this.getlist();
              this.$message.success("添加一条数据成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("标题不能为空");
        }
        this.addInfoLoading = false;
      }
    },
    //查看详情
    showInfo(row) {
      this.showNoticeVisible = true;
      this.formInfo = row;
    },
    //修改公告
    openInfo(row) {
      this.formInfo = row;
      this.oldTitle = row.title;
      this.oldContent = row.content;
      this.noticeVisible = true;
    },
    //删除公告
    deleteInfo(row) {
      deleteNotice(row.id).then(res => {
        if (res.code == 0) {
          this.$message.success(res.msg);
          this.getlist();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //分页
    handleSizeChange(val) {
      this.formInfo.limit = val;
      this.getlist();
    },
    handleCurrentChange(val) {
      this.formInfo.page = val;
      this.getlist();
    }
  }
};
</script>
<style>
.add-notice .el-dialog {
  width: 95%;
  max-width: 900px;
  height: 650px;
  top: 25px !important;
  margin-top: 0px !important;
}
.el-form-item--medium .el-form-item__content,
.el-form-item--medium .el-form-item__label {
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