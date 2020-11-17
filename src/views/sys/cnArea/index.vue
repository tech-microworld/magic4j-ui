<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
              <el-form-item label="名称" prop="name">
                <el-input
                        v-model="queryParams.name"
                        placeholder="请输入名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
              <el-form-item label="简称" prop="shortName">
                <el-input
                        v-model="queryParams.shortName"
                        placeholder="请输入简称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
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
                >新增</el-button>
            </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
            >导入</el-button>
          </el-col>
            <el-col :span="1.5" style="float: right" v-if="dynamicColumnSetting">
                <el-popover
                        placement="bottom"
                        min-width="80"
                        trigger="click"
                        popper-class="col-setting-popover"
                >
                    <el-button
                            slot="reference"
                            type="primary"
                            icon="el-icon-setting"
                            size="mini"
                    >筛选</el-button>
                    <div class="col-setting-title">显示设置</div>
                    <el-checkbox-group v-model="visibleIndexs" :min="0" class="col-setting-group">
                        <el-checkbox
                                v-for="colInfo in columnInfos"
                                :label="colInfo.index"
                                :key="colInfo.index"
                                :disabled="colInfo.disabled"
                                v-show="!colInfo.disabled || showAlwaysShowColumnInCheckbox"
                        >{{ colInfo.label }}</el-checkbox>
                    </el-checkbox-group>
                </el-popover>
            </el-col>
        </el-row>

        <el-table
          ref="pageTable"
          class="loading-area"
          :data="dataList"
          row-key="id"
          lazy
          :load="loadData"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column label="名称" align="center" prop="name" width="160px" v-if="columnVisibles[0]"/>
            <el-table-column label="简称" align="center" prop="shortName" v-if="columnVisibles[1]"/>
            <el-table-column label="邮政编码" align="center" prop="zipCode" v-if="columnVisibles[2]"/>
            <el-table-column label="城市编码" align="center" prop="cityCode" v-if="columnVisibles[3]"/>
            <el-table-column label="行政代码" align="center" prop="areaCode" v-if="columnVisibles[4]"/>
            <el-table-column label="拼音" align="center" prop="pinyin" v-if="columnVisibles[5]"/>
            <el-table-column label="级别" align="center" prop="level" v-if="columnVisibles[6]"/>
            <el-table-column label="经度" align="center" prop="lng" v-if="columnVisibles[7]"/>
            <el-table-column label="纬度" align="center" prop="lat" v-if="columnVisibles[8]"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                    >修改</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="上级区域" prop="parentId">
                    <tree-select
                      v-model="form.parentId"
                      :options="areaOptions"
                      :load-options="loadOptions"
                      :normalizer="normalizer"
                      placeholder="选择上级区域" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入名称" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="简称" prop="shortName">
                    <el-input v-model="form.shortName" placeholder="请输入简称" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="邮政编码" prop="zipCode">
                    <el-input v-model="form.zipCode" placeholder="请输入邮政编码" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="城市编码" prop="cityCode">
                    <el-input v-model="form.cityCode" placeholder="请输入城市编码" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

      <!--数据导入对话框 -->
      <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
        <el-form ref="form" label-width="80px">
          <el-form-item label="上级区域" prop="parentId">
            <tree-select
              v-model="upload.parentId"
              :options="areaOptions"
              :load-options="loadOptions"
              :normalizer="normalizer"
              placeholder="选择上级区域" />
          </el-form-item>
        </el-form>
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?isCovered=' + upload.isCovered+'&parentId='+upload.parentId"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
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
    import { listAreaTree,treeSelect, get, remove, add, update} from "@/api/sys/cnArea";
    import store from "@/store";
    import {getToken,isTokenValid} from '@/utils/auth'
    import {MessageBox} from "element-ui";
    import TreeSelect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    export default {
        name: "cnArea",
        components: { TreeSelect },
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
                // 表格数据
                dataList: [],
                areaOptions:[],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                     id: undefined,
                     name: undefined,
                     shortName: undefined,
                     parentId: undefined
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
                  //选择的父级ID
                  parentId:undefined,
                  // 设置上传的请求头部
                  headers: { Authorization: getToken() },
                  // 上传的地址
                  url: process.env.VUE_APP_BASE_API + "/api/sys/cnArea/importData"
                },
                columnInfos: [], // 所有列信息
                showAlwaysShowColumnInCheckbox:true,
                dynamicColumnSetting:true,
                columnVisibles: new Array(9).fill(true),//设置列可见性
                visibleIndexs: [], // 可见列的下标集合
                alwaysShowColumnIndexs:[],//总是显示的列的下标（不可隐藏的列）,列下标从 0 开始
                hidenColumnIndexs:[],//隐藏列的下标集合
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                     name: [
                        { required: true, message: "名称不能为空", trigger: "blur" }
                    ]
                }
            };
        },
        created() {
            this.getList();
        },
        methods: {
            /** 查询列表 */
            getList() {
              listAreaTree(this.queryParams).then(response => {
                    this.dataList = response.data;
                    this.dataList.forEach(item => {
                      item.hasChildren = true //给每条数据默认加了个hasChildren属性
                    })
              });
            },
            getTreeData(){
              treeSelect(this.queryParams).then(response => {
                this.areaOptions = response.data;
                this.areaOptions.forEach(item => {
                  item.children = null
                })
              });
            },
            loadData(tree, treeNode, resolve) {
              listAreaTree({
                  parentId: tree.id
              }).then((res) => {
                  let dataList = res.data || [];
                  dataList.forEach(item => {
                    item.hasChildren = true //给每条数据默认加了个hasChildren属性，实现load动态数据获取懒加载
                  })
                  resolve(dataList);
              });
            },
            loadOptions({ action, parentNode, callback }) {
              if (action === 'LOAD_CHILDREN_OPTIONS') {
                let pId = parentNode.id;
                treeSelect({
                  parentId: pId
                }).then((res) => {
                  let dataList = res.data || [];
                  dataList.forEach(item => {
                    item.children = null
                  })
                  parentNode.children = dataList
                  callback()
                });
              }
            },
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
            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {
                     id: undefined,
                     name: undefined,
                     shortName: undefined,
                     parentId: undefined,
                     zipCode: undefined,
                     cityCode: undefined
                }
                this.resetForm("form");
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length!==1
                this.multiple = !selection.length
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.getTreeData()
                this.reset();
                this.open = true;
                this.title = "添加";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
              this.reset();
              const id = row.id || this.ids
              treeSelect({id:id}).then(response => {
                this.areaOptions = response.data;
                this.areaOptions.forEach(item => {
                  if(item.children.length===0){
                    item.children = null
                  }
                })
                get(id).then(response => {
                  this.form = response.data;
                  if(row.level===1){
                    /**
                     * vue-treeSelect出现unknown解决方法
                     * vue-treeSelect 绑定的值需要与options输出的id相对应，若是空值，请不要给空字符串，0，等，因为会出现unknown，并且当选择了值以后，会出现选中的值后面会拼上unknown。
                     解决办法就是把v-model绑定的值设为null，必须是null，不能是‘null’，初始化的时候才不会出现unknown。
                     */
                    this.form.parentId = null
                  }
                  this.open = true;
                  this.title = "修改";
                });
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
                const ids = row.id || this.ids;
                this.$confirm('是否确认删除ID为"' + ids + '"的数据项?', "警告", {
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
            oprColumns(indexs, isShow) {
                let self = this;
                indexs.forEach(index => {
                    self.$set(self.columnVisibles, index, isShow);
                });
            },
          /** 导入按钮操作 */
          handleImport() {
            this.getTreeData()
            this.upload.title = "数据导入";
            this.upload.open = true;
            this.upload.isCovered = false
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
            window.open(process.env.VUE_APP_BASE_API+'/api/sys/cnArea/import/template?Authorization='+getToken());
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
        },
        mounted() {
            let self = this;
            if (self.$refs.pageTable.$slots.default) {
                let columnIndex = 0;
                self.$refs.pageTable.$slots.default.forEach((columnIns, index) => {
                    if (columnIns.componentOptions === undefined) {
                        return;
                    }
                    let props = columnIns.componentOptions.propsData;
                    if (
                        props.prop === undefined ||
                        props.type === "selection" ||
                        props.type === "index"
                    ) {
                        return;
                    }
                    // 保存所有列的信息
                    let label = props.label
                    let colName = props.prop
                    self.columnInfos.push({
                        label: label,
                        colName: colName,
                        index: columnIndex,
                        disabled: false
                    })
                    // 记录初始展示的列的下标
                    if (self.hidenColumnIndexs.indexOf(columnIndex) === -1) {
                        self.visibleIndexs.push(columnIndex);
                    }
                    columnIndex++
                })
                // 处理总是显示的列（不可隐藏的列）
                self.alwaysShowColumnIndexs.forEach(
                    index => (self.columnInfos[index].disabled = true)
                );
                // 处理初始隐藏的列
                self.oprColumns(self.hidenColumnIndexs, false);
            }

        },
        beforeUpdate() {
            let self = this;
            self.$nextTick(_ => {
                self.$refs.pageTable.doLayout();
            });
        },
        watch: {
            visibleIndexs(newValue, oldValue) {
                let self = this;
                let willHideIndexs = [], willShowIndexs = [];
                willShowIndexs = newValue.filter(index => {
                    return oldValue.indexOf(index) === -1;
                });
                willHideIndexs = oldValue.filter(index => {
                    return newValue.indexOf(index) === -1;
                });
                self.oprColumns(willShowIndexs, true);
                self.oprColumns(willHideIndexs, false);
            }
        }
    }
</script>
