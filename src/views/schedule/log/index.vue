<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="执行结果" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择执行结果"
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
      <el-form-item label="执行时间">
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
          v-hasPermi="['delete:schedule:jobLog']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          v-hasPermi="['delete:schedule:jobLog:clean']"
        >清空</el-button>
      </el-col>
    </el-row>

    <el-table class="loading-area" :data="jobLogList" @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="执行参数:">
              <span>{{ props.row.params }}</span>
            </el-form-item>
            <el-form-item label="执行耗时:">
              <span>{{ props.row.times }} 毫秒</span>
            </el-form-item>
            <el-form-item label="错误消息:">
              <span>{{ props.row.error }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日志ID" width="80" align="center" prop="id" />
      <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
      <el-table-column label="bean名称" align="center" prop="beanName" :show-overflow-tooltip="true" />
      <el-table-column label="方法名称" align="center" prop="methodName" :show-overflow-tooltip="true" />
      <el-table-column label="执行服务器IP" align="center" prop="serverIp" :show-overflow-tooltip="true" />
      <el-table-column label="执行结果" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="执行时间" align="center" prop="createTime" width="180">
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
import { listJobLog, deleteJobLog, cleanJobLog } from "@/api/schedule/jobLog";

export default {
  name: "JobLog",
  data() {
    return {
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 调度日志表格数据
      jobLogList: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 执行结果字典
      statusOptions: [],
      // 任务组名字典
      jobGroupOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined
      },
      // 表单参数
      form: {}
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
    /** 查询调度日志列表 */
    getList() {
      listJobLog(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.jobLogList = response.data.rows;
          this.total = response.data.total;
        }
      );
    },
    // 执行状态字典翻译
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
      this.ids = selection.map(item => item.id);
      this.multiple = !selection.length;
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobLogIds = this.ids;
      this.$confirm('是否确认删除调度日志编号为"' + jobLogIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteJobLog(jobLogIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$confirm("是否确认清空所有调度日志数据项?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return cleanJobLog();
        }).then(() => {
          this.getList();
          this.msgSuccess("清空成功");
        }).catch(function() {});
    }
  }
};
</script>
