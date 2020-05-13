<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结果" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="登录结果"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictCode"
            :label="dict.dictLabel"
            :value="dict.dictCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间">
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
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['delete:sys:log']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          v-hasPermi="['delete:sys:log:clean']"
        >清空</el-button>
      </el-col>
    </el-row>

    <el-table class="loading-area" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="用户ID:">
              <span>{{ props.row.userId }}</span>
            </el-form-item>
            <el-form-item label="请求参数:" v-if="props.row.reqParam">
              <JsonView :json="JSON.parse(props.row.reqParam)"></JsonView>
            </el-form-item>
            <el-form-item label="处理服务器:">
              <span>{{ props.row.handleServerIp }}</span>
            </el-form-item>
            <el-form-item label="处理时间:">
              <span>{{ props.row.executeTime }} 毫秒</span>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户名" align="center" prop="username" />
      <el-table-column label="登录地址" align="center" prop="clientIp" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="登录地点" align="center" prop="clientOperationLocation" />
      <el-table-column label="浏览器" align="center" prop="clientBrowser" />
      <el-table-column label="操作系统" align="center" prop="clientOperationSystem" />
      <el-table-column label="登录结果" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="登录时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
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
</style>
<script>
  import { list, remove, clean, exportLog } from "@/api/system/log";
  import JsonView from '@/components/JsonView'
  export default {
    name: "LoginLog",
    components: { JsonView },
    data() {
      return {
        // 选中数组
        ids: [],
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        // 状态数据字典
        statusOptions: [],
        // 日期范围
        dateRange: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          logType:1,//登录日志
          username: undefined,
          status: undefined
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("opera_result").then(res => {
        this.statusOptions = [];
        res.data.forEach((dict)=>{
          let tmpDict = {};
          tmpDict.dictCode = Number(dict.dictCode);//数据类型转换，el-select数据回显数据类型必须要一致
          tmpDict.dictLabel = dict.dictLabel;
          this.statusOptions.push(tmpDict);
        });
      });
    },
    methods: {
      /** 查询登录日志列表 */
      getList() {
        list(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.list = response.data.rows;
            this.total = response.data.total;
          }
        );
      },
      // 登录状态字典翻译
      statusFormat(row) {
        return this.selectDictLabel(this.statusOptions, row.status);
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
      /** 删除按钮操作 */
      handleDelete(row) {
        const logIds = row.id || this.ids;
        this.$confirm('是否确认删除访问编号为"' + logIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return remove(logIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 清空按钮操作 */
      handleClean() {
        this.$confirm('是否确认清空所有登录日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          let param={logType:1};//登录日志
          return clean(param);
        }).then(() => {
          this.getList();
          this.msgSuccess("清空成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有操作日志数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLog(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>

