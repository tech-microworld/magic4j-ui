<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

                        <el-form-item label="机构名称" prop="name">
                        <el-input
                                v-model="queryParams.name"
                                placeholder="请输入机构名称"
                                clearable
                                size="small"
                                @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                      <el-form-item label="状态" prop="status">
                        <el-select v-model="queryParams.status" placeholder="状态" clearable size="small" style="width: 180px">
                            <el-option
                                    v-for="dict in statusOptions"
                                    :key="dict.dictCode"
                                    :label="dict.dictLabel"
                                    :value="dict.dictCode"
                            />
                        </el-select>
                    </el-form-item>
                      <el-form-item label="类型" prop="type">
                        <el-select v-model="queryParams.type" placeholder="类型" clearable size="small" style="width: 180px">
                            <el-option
                                    v-for="dict in typeOptions"
                                    :key="dict.dictCode"
                                    :label="dict.dictLabel"
                                    :value="dict.dictCode"
                            />
                        </el-select>
                    </el-form-item>
                      <el-form-item label="所在区域" prop="regionId">
                        <tree-select
                                v-model="queryParams.regionId"
                                :options="treeSelectRegionOptions"
                                :load-options="loadRegionOptions"
                                :normalizer="normalizer"
                                style="width: 180px"
                                placeholder="请选择所在区域" />
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
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                >
            <el-table-column label="机构名称" align="center" prop="name" v-if="columnVisibles[0]"/>
            <el-table-column label="负责人" align="center" prop="leader" v-if="columnVisibles[1]"/>
            <el-table-column label="联系电话" align="center" prop="phone" v-if="columnVisibles[2]"/>
            <el-table-column label="邮箱" align="center" prop="email" v-if="columnVisibles[3]"/>
            <el-table-column label="状态" align="center" prop="status" v-if="columnVisibles[4]"/>
            <el-table-column label="机构类型" align="center" prop="type" v-if="columnVisibles[5]"/>
            <el-table-column label="所在区域" align="center" prop="regionId" v-if="columnVisibles[6]"/>
            <el-table-column label="创建者" align="center" prop="createUser" v-if="columnVisibles[7]"/>
            <el-table-column label="创建时间" align="center" prop="createTime" v-if="columnVisibles[8]"/>
            <el-table-column label="更新者" align="center" prop="updateUser" v-if="columnVisibles[9]"/>
            <el-table-column label="更新时间" align="center" prop="updateTime" v-if="columnVisibles[10]"/>
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
        <el-dialog :title="title" :visible.sync="open" width="600px">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="上级机构" prop="parentId">
                        <tree-select
                                v-model="form.parentId"
                                :options="treeSelectOptions"
                                :normalizer="normalizer"
                                placeholder="选择上级机构" />
                    </el-form-item>
                </el-col>
                    <el-col :span="12">
                    <el-form-item label="机构名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入机构名称" />
                    </el-form-item>
                </el-col>
                  <el-col :span="12">
                    <el-form-item label="负责人" prop="leader">
                        <el-input v-model="form.leader" placeholder="请输入负责人" />
                    </el-form-item>
                </el-col>
                  <el-col :span="12">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="form.phone" placeholder="请输入联系电话" />
                    </el-form-item>
                </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" placeholder="请输入邮箱" />
                    </el-form-item>
                </el-col>
                  <el-col :span="12">
                    <el-form-item label="排序顺序" prop="orderNum">
                      <el-input-number v-model="form.orderNum" controls-position="right" :min="1" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="所在区域" prop="regionId">
                      <tree-select
                        v-model="form.regionId"
                        :options="treeSelectRegionOptions"
                        :load-options="loadRegionOptions"
                        :normalizer="normalizer"
                        placeholder="请选择所在区域" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio
                                    v-for="dict in statusOptions"
                                    :key="dict.dictCode"
                                    :label="dict.dictCode"
                            >{{dict.dictLabel}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                  <el-col :span="24">
                    <el-form-item label="类型" prop="type">
                        <el-radio-group v-model="form.type">
                            <el-radio
                                    v-for="dict in typeOptions"
                                    :key="dict.dictCode"
                                    :label="dict.dictCode"
                            >{{dict.dictLabel}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                       </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 数据导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
            <el-form ref="form" label-width="80px">
                <el-form-item label="上级机构" prop="parentId">
                    <tree-select
                            v-model="upload.parentId"
                            :options="treeSelectOptions"
                            :normalizer="normalizer"
                            placeholder="选择上级机构" />
                </el-form-item>
            </el-form>
            <!--
            在用element的上传组件的时候，发现一个互斥问题
            重现：
            1：auto-upload设置为false
            2：before-upload事件里面做前置条件限制
            3：发现before-upload事件没效果
            原因：
            auto-upload设置为false的时候，before-upload事件是不起作用的；
            解决办法：
            使用on-change事件来代替before-upload
            -->
            <el-upload
                    ref="upload"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :headers="upload.headers"
                    :action="upload.url + '?isCovered=' + upload.isCovered+'&parentId='+upload.parentId"
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
                    <el-checkbox v-model="upload.isCovered" label="覆盖已经存在的数据" />
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
    import { listTree,treeSelect, get, add, update,remove} from "@/api/sys/org";
    import { treeSelect as treeRegionSelect} from "@/api/sys/cnArea";
    import TreeSelect from "@riophae/vue-treeselect";
    import "@riophae/vue-treeselect/dist/vue-treeselect.css";
    import store from "@/store";
    import qs from 'qs'
    import {getToken,isTokenValid} from '@/utils/auth'
    import { beforeUpload } from "@/utils/commonUtil";
    import {MessageBox} from "element-ui";
    export default {
        name: "org",
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
                // 状态数据字典
                statusOptions: [],
                //类型数据字典
                typeOptions:[],
                //区域下拉选择树选型数据
                treeSelectRegionOptions:[],
                //下拉选择树选型数据
                treeSelectOptions:[],
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                  name: undefined,
                  status: undefined,
                  type: undefined,
                  regionId: undefined,
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
                    url: process.env.VUE_APP_BASE_API + "/api/sys/org/importData"
                },
                dynColSettingDialogVisible: false, // '导出列设置'弹窗开关
                exportColumnNames: [], // 导出列集合
                columnInfos: [], // 所有列信息
                showAlwaysShowColumnInCheckbox:true,
                dynamicColumnSetting:true,
                columnVisibles: new Array(11).fill(true),//设置列可见性
                visibleIndexs: [], // 可见列的下标集合
                alwaysShowColumnIndexs:[0],//总是显示的列的下标（不可隐藏的列）,列下标从 0 开始
                hidenColumnIndexs:[8,9,10],//隐藏列的下标集合
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                  name: [
                    {required: true, message: "机构名称不能为空", trigger: "blur"}
                  ]
                }
            };
        },
        created() {
            this.getList();
            this.getTreeData();
            this.getDicts("org_status").then(res => {
                this.statusOptions = [];
                res.data.forEach((dict)=>{
                    let tmpDict = {};
                    tmpDict.dictCode = Number(dict.dictCode);//数据类型转换，el-select数据回显数据类型必须要一致
                    tmpDict.dictLabel = dict.dictLabel;
                    this.statusOptions.push(tmpDict);
                });
            });
        this.getDicts("org_type").then(res => {
            this.typeOptions = [];
            res.data.forEach((dict)=>{
                let tmpDict = {};
                tmpDict.dictCode = Number(dict.dictCode);//数据类型转换，el-select数据回显数据类型必须要一致
                tmpDict.dictLabel = dict.dictLabel;
                this.typeOptions.push(tmpDict);
            });
        });
            this.getTreeRegionData();
        },
        methods: {
            /** 查询列表 */
            getList() {
                listTree(this.queryParams).then(response => {
                    this.dataList = response.data;
                });
            },
            getTreeData(){
                treeSelect(this.queryParams).then(response => {
                    this.treeSelectOptions = response.data;
                });
            },
            getTreeRegionData(){
                treeRegionSelect(this.queryParams).then(response => {
                    this.treeSelectRegionOptions = response.data;
                    this.treeSelectRegionOptions.forEach(item => {
                        item.children = null
                    })
                });
            },
           loadRegionOptions({ action, parentNode, callback }) {
               if (action === 'LOAD_CHILDREN_OPTIONS') {
                   let pId = parentNode.id;
                   treeRegionSelect({
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
                     parentId: undefined,
                     parentName: undefined,
                     name: undefined,
                     orderNum: 1,
                     leader: undefined,
                     phone: undefined,
                     email: undefined,
                     status: 0,
                     type: 1,
                     regionId: undefined,
                }
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
            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "添加";
                this.getTreeData();
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                this.getTreeData();
                get(row.id).then(response => {
                    this.form = response.data;
                    this.open = true;
                    this.title = "修改";
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
                const ids = row.id;
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


            /** 导入按钮操作 */
            handleImport() {
                this.getTreeData()
                this.upload.title = "导入数据";
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
                window.open(process.env.VUE_APP_BASE_API+"/api/sys/org/import/template?Authorization="+getToken());
            },
            //选择上传文件后
            handleFileChange(file){
                const typeList = ["xls", "xlsx"];//允许上传的文件类型
                if(!beforeUpload(file,typeList)){//校验上传文件类型
                    this.$message.error('选择的文件不正确，请上传正确的Excel文件')
                    this.$refs.upload.clearFiles();
                }
            },
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                this.upload.isUploading = true;
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
            },
            //设置列显示隐藏
            oprColumns(indexs, isShow) {
                let self = this;
                indexs.forEach(index => {
                    self.$set(self.columnVisibles, index, isShow);
                });
            },
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
