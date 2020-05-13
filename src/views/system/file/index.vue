<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="文件名" prop="originalFileName">
        <el-input
          v-model="queryParams.originalFileName"
          placeholder="请输入文件名"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="上传时间">
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
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-upload"
          size="mini"
          @click="handleUpload"
          v-hasPermi="['post:sys:file:upload']"
        >上传文件</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-setting"
          size="mini"
          @click="storageTypeSetting"
          v-hasPermi="['put:sys:file:storageType:setting']"
        >存储设置</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['delete:sys:file']"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table class="loading-area"
              :data="list"
              @expand-change="expandSelect"
              @selection-change="handleSelectionChange"
              :row-key="getRowKeys"
              :expand-row-keys="expands">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="新文件名:">
              <span>{{ props.row.newFileName }}</span>
            </el-form-item>
            <el-form-item label="保存路径:">
              <span>{{ props.row.savePath }}</span>
            </el-form-item>
            <el-form-item label="文件MD5:">
              <span>{{ props.row.fileMd5 }}</span>
            </el-form-item>
            <el-form-item label="存储方式:">
              <span>{{ props.row.storageType }}</span>
            </el-form-item>
            <el-form-item label="文件后缀:">
              <span>{{ props.row.fileSuffix }}</span>
            </el-form-item>
            <el-form-item label="文件预览:" v-if="isImageAsset(props.row.fileSuffix)">
              <el-image
                style="width: 200px; height: 200px"
                :src="props.row.fileUrl"
                :preview-src-list="previewImgUrls">
              </el-image>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="ID" align="center" prop="id" width="50"/>
      <el-table-column label="文件名" align="left" prop="originalFileName" />
      <el-table-column label="访问地址" align="left" prop="fileUrl"/>
      <el-table-column label="文件大小(字节)" align="center" prop="fileLength" />
      <el-table-column label="上传时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleDownload(scope.row)"
            v-hasPermi="['get:sys:file:download']"
          >下载</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['delete:sys:file']"
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

    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-upload
        ref="upload"
        drag
        multiple
        :action="uploadFile()"
        :http-request="uploadRequest"
        :on-success="handleSuccess"
        :file-list="fileList"
        :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-upload" :loading="loading" type="primary" @click="submitUpload">上传文件</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="文件存储方式设置" :visible.sync="storageTypeDialogOpen" width="400px">
      <el-select v-model="storageType" placeholder="文件存储方式设置" style="width: 100%">
        <el-option
          v-for="dict in storageTypeOptions"
          :key="dict.dictCode"
          :label="dict.dictLabel"
          :value="dict.dictCode"
        />
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="close">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  .el-upload-dragger{
    width: 460px;
  }
</style>
<script>
  import { list, remove,storageTypeSetting,getCurrStorageType,upload} from "@/api/system/file";
  import { download } from "@/utils/commonUtil";
  export default {
    name: "SysFile",
    data() {
      return {
        // 选中数组
        ids: [],
        // 非多个禁用
        multiple: true,
        // 弹出层标题
        title: "",
        storageType:"",
        // 是否显示弹出层
        open: false,
        loading:false,
        storageTypeDialogOpen: false,
        // 存储方式数据字典
        storageTypeOptions: [],
        //上传文件列表
        fileList:[],
        newData:{},
        //预览图片URL集合
        previewImgUrls:[],
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        // 日期范围
        dateRange: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          username: undefined
        },
        getRowKeys(row) { // 行数据的Key
          return row.id
        },
        expands: [] // 通过该属性设置Table目前的展开行，需要设置row-key属性才能使用，该属性为展开行的keys数组
      };
    },
    created() {
      this.getList();
      getCurrStorageType().then(res=>{
        this.storageType = res.data;
      })
    },
    methods: {
      // table每次只能展开一行
      expandSelect(row, expandedRows) {
        this.expands = []
        if (expandedRows.length > 0) {
          row ? this.expands.push(row.id) : ''
        }
      },
      uploadRequest(param) {
        this.fileList.push(param.file);// 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      },
      /** 查询文件列表 */
      getList() {
        this.previewImgUrls=[];
        list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
            for(let file of this.list){
              if(this.isImageAsset(file.fileSuffix)){
                this.previewImgUrls.push(file.fileUrl)
              }
            }
          }
        );
      },
      uploadFile(){
        return process.env.VUE_APP_BASE_API + '/api/sys/file/upload'
      },
      //判断是否为图片
      isImageAsset(fileSuffix){
        return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(fileSuffix.toLowerCase()) !== -1;
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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.multiple = !selection.length
      },
      /** 上传按钮操作 */
      handleUpload() {
        this.fileList = [];
        this.open = true;
        this.loading = false;
        this.title = "文件上传";
      },
      // 取消按钮
      cancel() {
        this.fileList = [];
        this.open = false;
      },
      storageTypeSetting(){
        this.getDicts("file_storage_type").then(res => {
          this.storageTypeOptions = res.data;
          this.storageTypeDialogOpen = true;
        });
      },
      close() {
        this.storageTypeDialogOpen = false;
      },
      /** 下载按钮操作 */
      handleDownload(row) {
        const fileUrl = row.fileUrl;
        const fileName = row.originalFileName;
        download(fileUrl,fileName)
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return remove(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      submitUpload() {
        this.loading = true;
        const upData = new FormData();
        this.$refs.upload.submit();// 这里是执行文件上传的函数，其实也就是获取我们要上传的文件
        this.fileList.forEach(function (file) {// 因为要上传多个文件，所以需要遍历
          upData.append('file', file, file.name);
        });
        upData.append("body", JSON.stringify(this.newData)); // 这里需要转换一下格式传给后台
        upload(upData).then((response =>{
          this.loading = false;
          if (response.code === 0) {
            this.msgSuccess("上传成功");
            this.$refs.upload.clearFiles();
            this.fileList = [];
            this.open = false;
            this.getList();
          }else {
            this.msgError(response.msg);
          }
        }))
      },
      save(){
        storageTypeSetting(this.storageType).then(response => {
          if (response.code === 0) {
            this.msgSuccess("设置成功");
            this.storageTypeDialogOpen = false;
          } else {
            this.msgError(response.msg);
          }
        });
      },
      handleSuccess(response, file, fileList) {
       /* this.$refs.upload.clearFiles();
        this.fileList = [];
        this.open = false;
        this.getList();*/
      }
    }
  };
</script>

