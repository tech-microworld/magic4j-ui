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
  </div>
</template>

<script>
import { list, get, remove, add, update} from "@/api/system/dict";
import ElRow from "element-ui/packages/row/src/row";
import ElContainer from "../../../../node_modules/element-ui/packages/container/src/main.vue";

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
    }
  }
};
</script>
