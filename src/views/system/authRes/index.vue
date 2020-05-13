<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="handleRefreshAuthRes" v-hasPermi="['post:sys:resource:refreshAuthRes']">刷新资源</el-button>
      </el-col>
    </el-row>
    <el-table
      class="loading-area"
      :data="authResList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="url" label="访问地址" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="perms" label="权限标识"></el-table-column>
      <el-table-column prop="requestTypes" label="请求方式" width="80px"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['put:sys:resource']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['delete:sys:resource']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { listAuthRes, update, del,refreshAuthRes} from "@/api/system/authRes";

export default {
  name: "authRes",
  components: {
  },
  data() {
    return {
      // 表格树数据
      authResList: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询菜单列表 */
    getList() {
      listAuthRes(this.queryParams).then(response => {
        this.authResList = response.data;
      });
    },
    handleRefreshAuthRes(){
      refreshAuthRes().then(response => {
        if (response.code === 0) {
          this.msgSuccess("刷新成功");
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$prompt('请输入"' + row.name + '"的新名称', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        const data = {
          id:row.id,
          name:value
        };
        update(data).then(response => {
          if (response.code === 0) {
            this.msgSuccess("修改成功");
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      }).catch(() => {});
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return del(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    }
  }
};
</script>
