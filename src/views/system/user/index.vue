<template>
  <div class="app-container">
    <el-row :gutter="20" class="loading-area">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="cellphone">
            <el-input
              v-model="queryParams.cellphone"
              placeholder="请输入手机号码"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
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
              v-hasPermi="['post:sys:user']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['put:sys:user']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['delete:sys:user']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-lock"
              size="mini"
              :disabled="multiple"
              @click="handleForbid"
              v-hasPermi="['put:sys:user:forbid']"
            >禁用</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-unlock"
              size="mini"
              :disabled="multiple"
              @click="handleEnable"
              v-hasPermi="['put:sys:user:enable']"
            >启用</el-button>
          </el-col>
        </el-row>

        <el-table :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="用户编号" align="center" prop="id" />
          <el-table-column label="用户名称" align="center" prop="username" :show-overflow-tooltip="true" />
          <el-table-column label="真实姓名" align="center" prop="realName" :show-overflow-tooltip="true" />
          <el-table-column label="电子邮箱" align="center" prop="email" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" prop="cellphone" width="120" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <!--
              el-switch用法注意：
              https://blog.csdn.net/shaleilei/article/details/88538568
              Swich默认是boolean类型，而后台传值 为number类型，这个时候我们想用number来取代boolean类型
              <el-switch v-model="scope.row.status"
                   active-value="0"
                   inactive-value="1">
              </el-switch>
              请注意上面的写法，active-value和inactive-value的值分别是字符串的1和2,
              如果赋值为数字类型的0或1是无法正常工作的，若赋值为数值类型，需这样写
              -->
              <el-switch
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['put:sys:user']"
              >修改</el-button>
              <el-button
                v-if="scope.row.id !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['delete:sys:user']"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
                v-hasPermi="['put:sys:user:resetPwd']"
              >重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      <!--分页组件-->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.id == undefined" label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="cellphone">
              <el-input v-model="form.cellphone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <!--
              element的select下拉框设定初值后，不能重新选择
              原因：下拉框数据是循环得来的，因为数据层次太多，render函数没有自动更新，需手动强制刷新
              解决方案 添加 @change="$forceUpdate()" 强制更新视图
              -->
              <el-select @change="$forceUpdate()" v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <!--status的类型为int，dict.dictCode的值为字符串，类型不匹配时无法选中，所以需要将status转换成字符串-->
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictCode"
                  :label="dict.dictCode"
                >{{dict.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作岗位">
              <el-select @change="$forceUpdate()" v-model="form.postIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.id"
                  :label="item.postName"
                  :value="item.id"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在部门" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" :normalizer="normalizer" placeholder="请选择所属部门" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, deleteUser, addUser, updateUser, forbidUser, enableUser,resetUserPwd, changeUserStatus,getSecretKey } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { treeSelect } from "@/api/system/dept";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import { rsaEncrypt,aesEncrypt } from '@/utils/encrypt' //加密
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import store from "@/store";
export default {
  name: "User",
  components: { Treeselect },
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      rsaPublicKey: "",//rsa公钥
      aesKey:"",//AES秘钥
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label" //部门树显示的文本字段
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        cellphone: undefined,
        status: undefined,
        deptId: undefined
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        cellphone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        roleIds: [
          { required: true, message: "请选择角色", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请指定用户状态", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeSelect();
    this.getDicts("user_status").then(response => {
      this.statusOptions = [];
      response.data.forEach((dict)=>{
        let tmpDict = {};
        tmpDict.dictCode = Number(dict.dictCode);//数据类型转换，el-select数据回显数据类型必须要一致
        tmpDict.dictLabel = dict.dictLabel;
        this.statusOptions.push(tmpDict);
      });
    });
    this.getConfigKey("user.initPassword").then(response => {
      this.initPassword = response.data.configValue;
    });
    this.getEncryptKey();
  },
  methods: {
    getEncryptKey(){
      getSecretKey().then(res =>{
        this.rsaPublicKey = res.data.rsaPublicKey
        this.aesKey = res.data.aesSecretKey
      })
    },
    /** 查询用户列表 */
    getList() {
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.data.rows;
          this.total = response.data.total;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeSelect() {
      treeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      };
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === 0 ? "启用" : "禁用";
      this.$confirm('确认要"' + text + '""' + row.username + '"用户吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === 0 ? 1 : 0;
        });
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
        deptId: undefined,
        username: undefined,
        realName: undefined,
        password: undefined,
        cellphone: undefined,
        email: undefined,
        status: 0,
        remark: undefined,
        postIds: [],
        roleIds: []
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 查询重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          username: undefined,
          cellphone: undefined,
          status: undefined,
          deptId: undefined
      };
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getUser().then(response => {
        this.postOptions = response.data.posts;
        this.roleOptions = response.data.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.id || this.ids;
      getUser(userId).then(response => {
        this.form = response.data.userInfo;
        this.postOptions = response.data.posts;
        this.roleOptions = response.data.roles;
        this.form.postIds = response.data.postIds;
        this.form.roleIds = response.data.roleIds;
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.username + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
          resetUserPwd(row.id, value,this.rsaPublicKey).then(response => {
            if (response.code === 0) {
              this.msgSuccess("重置成功，新密码是：" + value);
            } else {
              this.msgError(response.msg);
            }
          });
        }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateUser(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            //将整个Form表单的数据进行AES加密后传输
            const formEncrypt = aesEncrypt(JSON.stringify(this.form),this.aesKey);
            addUser(formEncrypt).then(response => {
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
      const userIds = row.id || this.ids;
      this.$confirm('是否确认删除用户编号为"' + userIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return deleteUser(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 禁用按钮操作 */
    handleForbid(row) {
      const userIds = row.id || this.ids;
      this.$confirm('是否确认禁用用户编号为"' + userIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return forbidUser(userIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("禁用成功");
      }).catch(function() {});
    },
    /** 启用按钮操作 */
    handleEnable(row) {
      const userIds = row.id || this.ids;
      this.$confirm('是否确认启用用户编号为"' + userIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return enableUser(userIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("启用成功");
      }).catch(function() {});
    }
  }
};
</script>
