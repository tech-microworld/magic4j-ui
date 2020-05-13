<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择任务状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictCode"
            :label="dict.dictLabel"
            :value="dict.dictCode"
          />
        </el-select>
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
          v-hasPermi="['post:schedule:job']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['put:schedule:job']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['delete:schedule:job']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-caret-right"
          size="mini"
          :disabled="multiple"
          @click="handleRun"
          v-hasPermi="['put:schedule:job:run']"
        >执行</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-video-pause"
          size="mini"
          :disabled="multiple"
          @click="handlePause"
          v-hasPermi="['put:schedule:job:pause']"
        >暂停</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-s-promotion"
          size="mini"
          :disabled="multiple"
          @click="handleResume"
          v-hasPermi="['put:schedule:job:resume']"
        >恢复</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-s-operation"
          size="mini"
          @click="handleJobLog"
          v-hasPermi="['get:schedule:jobLog:list']"
        >调度日志</el-button>
      </el-col>
    </el-row>

    <el-table class="loading-area" :data="jobList" @selection-change="handleSelectionChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="任务描述:">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
            <el-form-item label="执行参数:">
              <span>{{ props.row.params }}</span>
            </el-form-item>
            <el-form-item label="任务负责人:">
              <span>{{ props.row.author }}</span>
            </el-form-item>
            <el-form-item label="通知邮箱:">
              <span>{{ props.row.alarmEmail }}</span>
            </el-form-item>
            <el-form-item label="Java类:">
              <span>{{ props.row.className }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务ID" align="center" prop="id" />
      <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true" />
      <el-table-column label="bean名称" align="center" prop="beanName" :show-overflow-tooltip="true" />
      <el-table-column label="方法名称" align="center" prop="methodName" :show-overflow-tooltip="true" />
      <el-table-column label="cron执行表达式" align="center" prop="cronExpression" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-caret-right"
            @click="handleRun(scope.row)"
            v-hasPermi="['put:schedule:job:run']"
          >执行</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-caret-right"
            @click="handlePause(scope.row)"
            v-hasPermi="['put:schedule:job:pause']"
          >暂停</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-caret-right"
            @click="handleResume(scope.row)"
            v-hasPermi="['put:schedule:job:resume']"
          >恢复</el-button>
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="任务名称" prop="jobName">
              <el-input v-model="form.jobName" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="beanName">
               <span slot="label">
                bean名称
                <el-tooltip placement="top">
                  <div slot="content">
                    如果一个task类标注为@Component("xxx")，那么bean名称就是xxx
                    <br/>
                    示例：@Component("testTask")，bean名称就是“testTask”
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.beanName" placeholder="Spring Bean名称，如：testTask" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="methodName">
              <span slot="label">
                调用方法
                <el-tooltip placement="top">
                  <div slot="content">
                    示例：test
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.methodName" placeholder="请输入定时任务要执行的方法名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="cron表达式" prop="cronExpression">
              <el-input v-model="form.cronExpression" placeholder="请输入cron执行表达式">
                <el-button slot="append" v-if="!showCronBox" icon="el-icon-arrow-up" @click="showCronBox = true" title="打开图形配置"></el-button>
                <el-button slot="append" v-else icon="el-icon-arrow-down" @click="showCronBox = false" title="关闭图形配置"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任务状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictCode"
                  :label="dict.dictCode"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider @click="showOption">【显示非必填】</el-divider>
        <el-collapse-transition>
        <el-row v-if="showOptionInput">
            <el-col :span="24">
              <el-form-item prop="params">
                <span slot="label">
                  执行参数
                  <el-tooltip placement="top">
                    <div slot="content">
                      定时任务只能接受一个参数；如果有多个参数，使用json格式传递
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </span>
                <el-input v-model="form.params" placeholder="请输入执行参数" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务负责人" prop="author">
                <el-input v-model="form.author" placeholder="请输入任务负责人" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="alarmEmail">
                 <span slot="label">
                  通知邮箱
                  <el-tooltip placement="top">
                    <div slot="content">
                      定时任务执行失败时，给指定的邮箱发送邮件通知
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                 </span>
                <el-input v-model="form.alarmEmail" placeholder="请输入报警邮箱，多个邮箱地址用逗号分隔开" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="remark">
                 <span slot="label">
                  Java类
                  <el-tooltip placement="top">
                    <div slot="content">
                      Spring Bean对应的Java类，方便查找定时任务执行的方法
                      <br/>
                      示例：com.itgacl.magic4j.modules.schedule.task.TestTask
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                 </span>
                <el-input v-model="form.className" placeholder="请输入任务所在的Java类"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务描述" prop="remark">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入任务描述"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
        </el-collapse-transition>
      </el-form>
      <el-dialog :visible.sync="showCronBox" width="65%" append-to-body>
        <cron v-if="showCronBox" v-model="form.cronExpression"></cron>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
</style>
<script>
import { listJob, getJob, deleteJob, addJob, updateJob, pauseJob, runJob, resumeJob } from "@/api/schedule/job";
import cron from '@/components/cron/cron.vue'
export default {
  name: "Job",
  components: {
    cron
  },
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
      // 定时任务表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //是否显示cronBox
      showCronBox: false,
      //是否显示选填项
      showOptionInput:false,
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        beanName: [
          { required: true, message: "调用目标bean名称不能为空", trigger: "blur" }
        ],
        methodName: [
          { required: true, message: "调用目标方法名称不能为空", trigger: "blur" }
        ],
        cronExpression: [
          { required: true, message: "cron执行表达式不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请指定任务状态", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("schedule_job_status").then(res => {
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
    /** 查询定时任务列表 */
    getList() {
      listJob(this.queryParams).then(response => {
        this.jobList = response.data.rows;
        this.total = response.data.total;
      });
    },
    showOption(){
      this.showOptionInput = !this.showOptionInput;
    },
    // 状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status);
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
        jobName: undefined,
        className: undefined,
        beanName: undefined,
        methodName: undefined,
        params: undefined,
        cronExpression: undefined,
        remark: undefined,
        author: undefined,
        alarmEmail: undefined,
        status: 0
      };
      this.showOptionInput = false;
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /* 执行任务 */
    handleRun(row) {
      const jobIds = row.id || this.ids;
      this.$confirm('确认要执行任务ID为"' + jobIds + '"的任务吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return runJob(jobIds);
        }).then(() => {
          this.msgSuccess("执行成功");
        }).catch(function() {});
    },
    /* 暂停任务 */
    handlePause(row) {
      const jobIds = row.id || this.ids;
      this.$confirm('确认要暂停任务ID为"' + jobIds + '"的任务吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return pauseJob(jobIds);
      }).then(() => {
        this.msgSuccess("暂停成功");
        this.getList();
      }).catch(function() {})
    },
    /* 恢复任务 */
    handleResume(row) {
      const jobIds = row.id || this.ids;
      this.$confirm('确认要恢复任务ID为"' + jobIds + '"的任务吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return resumeJob(jobIds);
      }).then(() => {
        this.msgSuccess("恢复成功");
        this.getList();
      }).catch(function() {});
    },
    /** 跳转到调度日志页面 */
    handleJobLog() {
      this.$router.push("/schedule/log");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const jobId = row.id || this.ids;
      getJob(jobId).then(response => {
        this.form = response.data;
        this.open = true;
        if(this.form.params || this.form.className || this.form.author || this.form.alarmEmail || this.form.remark){
          this.showOptionInput = true; //非必填项有内容才显示
        }
        this.title = "修改任务";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateJob(this.form).then(response => {
              if (response.code === 0) {
                this.open = false;
                this.msgSuccess("修改成功");
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addJob(this.form).then(response => {
              if (response.code === 0) {
                this.open = false;
                this.msgSuccess("新增成功");
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
      const jobIds = row.id || this.ids;
      this.$confirm('是否确认删除定时任务编号为"' + jobIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteJob(jobIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>
