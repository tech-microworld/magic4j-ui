<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入字典名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input
          v-model="queryParams.dictType"
          placeholder="请输入字典类型"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['post:sys:dict']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['put:sys:dict']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['delete:sys:dict']"
        >删除</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['post:sys:dict:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['get:sys:dict:export']"
        >导出</el-button>
      </el-col>

    </el-row>

    <el-table class="loading-area" :data="dictList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
      <el-table-column label="字典类型" align="center" prop="dictType" :show-overflow-tooltip="true"/>
      <el-table-column label="字典编码" align="center" prop="dictCode" :show-overflow-tooltip="true" />
      <el-table-column label="字典文本" align="center" prop="dictLabel" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['put:sys:dict']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['delete:sys:dict']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="字典名称" prop="dictName">
              <el-tooltip class="item" effect="dark" content="中文或者英文" placement="bottom">
                <el-input v-model="form.dictName" placeholder="请输入字典名称"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="字典类型" prop="dictType">
              <el-tooltip class="item" effect="dark" content="只能是英文" placement="bottom">
                <el-input v-model="form.dictType" placeholder="请输入字典类型" :disabled="form.id != undefined"/>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider v-if="form.id == undefined">字典数据项</el-divider>
        <div v-if="form.id == undefined">
          <!--
           v-for加上:key="index"
           避免vue警告：component lists rendered with v-for should have explicit keys
           -->
          <el-row  v-for="(item, index) in form.dictDataItems" :key="index">
            <el-col :span="12">
              <el-form-item label="数据编码">
                <el-tooltip class="item" effect="dark" content="数字或者英文字母" placement="bottom">
                  <el-input v-model="form.dictDataItems[index].dictCode" placeholder="请输入数据编码"  style="width:85%"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据标签">
                <el-tooltip class="item" effect="dark" content="数据编码对应的中文或者英文描述" placement="bottom">
                  <el-input v-model="form.dictDataItems[index].dictLabel" placeholder="请输入数据标签" style="width: 85%" />
                </el-tooltip>
                <i class="el-icon-circle-plus"
                   v-if="index==0"
                   @click="addItem"
                ></i>
                <i
                  v-if="index!=0"
                  class="el-icon-delete"
                  @click="delItem(index)"
                ></i>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <el-row>
            <el-col :span="24">
              <el-form-item label="字典编码" prop="dictCode">
                <el-input v-model="form.dictCode" placeholder="请输入字典编码" :disabled="form.id != undefined"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="字典文本" prop="dictCode">
                <el-input v-model="form.dictLabel" placeholder="请输入字典文本"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 字典导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?isCovered=' + upload.isCovered"
        :disabled="upload.isUploading"
        :on-change="handleFileChange"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-exceed="handleExceed"
        :before-remove="beforeRemove"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.isCovered" label="覆盖已经存在的字典数据" />
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件，请先<el-link type="info" style="font-size:12px" @click="downloadImportTemplate">【下载Excel模板】</el-link></div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="upload.isUploading" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { list, get, remove, add, update} from "@/api/sys/dict";
import ElRow from "element-ui/packages/row/src/row";
import ElContainer from "../../../../node_modules/element-ui/packages/container/src/main.vue";
import store from "@/store";
import qs from 'qs'
import {getToken,isTokenValid} from '@/utils/auth'
import { beforeUpload } from "@/utils/commonUtil";
import {MessageBox} from "element-ui";

export default {
  components: {
    ElContainer,
    ElRow
  },
  name: "Dict",
  data() {
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 字典表格数据
      dictList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined
      },
      // 导入参数
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否覆盖已经存在的用户数据
        isCovered: false,
        // 设置上传的请求头部
        headers: { Authorization: getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/api/sys/dict/import"
      },
      // 表单参数
      form: {
        dictDataItems: []
      },
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ],
       /* dictCode: [
          { required: true, message: "字典编码不能为空", trigger: "blur" }
        ],
        dictLabel: [
          { required: true, message: "字典文本不能为空", trigger: "blur" }
        ]*/
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    addItem() {
      this.form.dictDataItems.push({
        dictCode: '',
        dictLabel: ''
      });
    },
    // 删除
    delItem(index) {
      this.form.dictDataItems.splice(index, 1);
    },
    /** 查询字典类型列表 */
    getList() {
      list(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
          this.dictList = res.data.rows;
          this.total = res.data.total;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        dictName: undefined,
        dictType: undefined,
        dictCode: undefined,
        dictLabel: undefined,
        dictDataItems: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典";
      this.addItem();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.id || this.ids
      get(dictId).then(response => {
        this.form = response.data;
        console.log(this.form);
        this.open = true;
        this.title = "修改字典";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            update(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            add(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.id || this.ids;
      this.$confirm('是否确认删除字典编号为"' + dictIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return remove(dictIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport(row) {
      let that = this
      this.$confirm('是否确认导出字典数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        if(!isTokenValid()){//Token已经失效
          MessageBox.confirm(
            '登录状态已过期，请重新登录',
            '系统提示',
            {
              showCancelButton:false,
              confirmButtonText: '重新登录',
              type: 'warning'
            }
          ).then(() => {
            store.dispatch('LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
          return
        }
        const dictIds = row.id || that.ids;
        const queryParams = that.addDateRange(that.queryParams, that.dateRange);
        queryParams.dictIds = dictIds
        queryParams.Authorization = getToken()//获取登录Token
        let params = qs.stringify(queryParams)
        window.open(process.env.VUE_APP_BASE_API+'/api/sys/dict/export?'+params);
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "数据字典导入";
      this.upload.open = true;
      this.upload.isCovered = false
      if(this.$refs.upload){
        this.$refs.upload.clearFiles();
      }
    },
    /** 下载模板操作 */
    downloadImportTemplate() {
      if(!isTokenValid()){//Token已经失效
        MessageBox.confirm(
          '登录状态已过期，请重新登录',
          '系统提示',
          {
            showCancelButton:false,
            confirmButtonText: '重新登录',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        return
      }
      window.open(process.env.VUE_APP_BASE_API+'/api/sys/dict/import/template?Authorization='+getToken());
    },
    //选择上传文件后
    handleFileChange(file){
      const typeList = ["xls", "xlsx"];//允许上传的文件类型
      if(!beforeUpload(file,typeList)){
        this.$message.error('选择的文件不正确，请上传正确的Excel文件')
        this.$refs.upload.clearFiles();
      }
    },
    // 文件超出个数限制时的钩子
    handleExceed(file, fileList) {
      this.$message.error('只能上传一个文件')
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeRemove(file, fileList) {
      // 增加一个询问框
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
