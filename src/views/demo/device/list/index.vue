<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
              <el-form-item label="设备编码" prop="deviceCode">
                <el-input
                        v-model="queryParams.deviceCode"
                        placeholder="请输入设备编码"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
              <el-form-item label="设备名称" prop="deviceName">
                <el-input
                        v-model="queryParams.deviceName"
                        placeholder="请输入设备名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                />
            </el-form-item>
              <el-form-item label="设备状态" prop="state">
                <el-input
                        v-model="queryParams.state"
                        placeholder="请输入设备状态"
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
                        type="success"
                        icon="el-icon-edit"
                        size="mini"
                        :disabled="single"
                        @click="handleUpdate"
                >修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                >删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="info"
                        icon="el-icon-upload2"
                        size="mini"
                        @click="handleImport"
                >导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="warning"
                        icon="el-icon-download"
                        size="mini"
                        @click="handleExport"
                >导出</el-button>
            </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-view"
              size="mini"
              @click="handleView"
            >设备地图</el-button>
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

        <el-table ref="pageTable" class="loading-area" :data="dataList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="ID" align="center" prop="id" v-if="columnVisibles[0]"/>
            <el-table-column label="设备编码" align="center" prop="deviceCode" v-if="columnVisibles[1]"/>
            <el-table-column label="设备名称" align="center" prop="deviceName" v-if="columnVisibles[2]"/>
            <el-table-column label="所在区域" align="center" prop="deviceArea" v-if="columnVisibles[3]"/>
            <el-table-column label="铺设点位" align="center" prop="devicePtName" v-if="columnVisibles[4]"/>
            <el-table-column label="经度" align="center" prop="longitude" v-if="columnVisibles[5]"/>
            <el-table-column label="纬度" align="center" prop="latitude" v-if="columnVisibles[6]"/>
            <el-table-column label="地理位置" align="center" prop="gePoName" v-if="columnVisibles[7]"/>
            <el-table-column label="设备状态" align="center" prop="state" v-if="columnVisibles[8]"/>
            <el-table-column label="所在省份" align="center" prop="province" v-if="columnVisibles[9]"/>
            <el-table-column label="所在城市" align="center" prop="city" v-if="columnVisibles[10]"/>
            <el-table-column label="所在地区" align="center" prop="district" v-if="columnVisibles[11]"/>
            <el-table-column label="创建时间" align="center" prop="createTime" v-if="columnVisibles[12]"/>
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

        <pagination
                v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                  <el-form-item label="设备编码" prop="deviceCode">
                    <el-input v-model="form.deviceCode" placeholder="请输入设备编码" />
                </el-form-item>
                  <el-form-item label="设备名称" prop="deviceName">
                    <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
                </el-form-item>
                  <el-form-item label="所在区域" prop="deviceArea">
                    <el-input v-model="form.deviceArea" placeholder="请输入设备所在区域" />
                </el-form-item>
                  <el-form-item label="铺设点位" prop="devicePtName">
                    <el-input v-model="form.devicePtName" placeholder="请输入设备铺设点位名称" />
                </el-form-item>
                  <el-form-item label="地理位置" prop="gePoName">
                    <el-input v-model="form.gePoName" placeholder="请输入地理位置名称" />
                </el-form-item>
            </el-form>
          <el-card :body-style="{ padding: '0px' }" class="box-card map-card">
            <baidu-map class="map" style="height:400px;" :center="center" :zoom="zoom" @ready="handlerMapChange"
                        :scroll-wheel-zoom="true"
                        @click="clickEvent">
              <!-- //定位当前位置  -->
              <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"  :showaddressBar="true" :autoLocation="true" @locationSuccess="getLoctionSuccess" ></bm-geolocation>
            </baidu-map>
          </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 数据导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
            <el-upload
                    ref="upload"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :headers="upload.headers"
                    :action="upload.url + '?isCovered=' + upload.isCovered"
                    :disabled="upload.isUploading"
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

        <!-- 导出列设置对话框 -->
        <el-dialog
                title="请选择需要导出的列"
                class="dyn-col-ctn"
                :visible.sync="dynColSettingDialogVisible"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                :show-close="false"
        >
            <el-checkbox-group v-model="exportColumnNames">
                <el-checkbox
                        v-for="colInfo in columnInfos"
                        :label="colInfo.colName"
                        :key="colInfo.index"
                >{{ colInfo.label }}</el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dynColSettingCancel">取消</el-button>
                <el-button type="primary" @click="dynColSettingConfirm">导出</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
      BaiduMap,
      BmNavigation,
      BmView,
      BmGeolocation,
      BmCityList
    } from "vue-baidu-map";
    import positionPic from "@/assets/image/position.png";
    import { list, get, remove, add, update,exportData} from "@/api/demo/device";
    import store from "@/store";
    import qs from 'qs'
    import {getToken,isTokenValid} from '@/utils/auth'
    import {MessageBox} from "element-ui";
    export default {
        name: "device",
        components: {
          BaiduMap,
          BmNavigation,
          BmView,
          BmGeolocation,
          BmCityList
        },
        data() {
            return {
                center: { lng: 0, lat: 0 },
                zoom: 12,
                iconUrl: positionPic,
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
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                     id: undefined,
                     deviceCode: undefined,
                     deviceName: undefined,
                     deviceArea: undefined,
                     devicePtName: undefined,
                     longitude: undefined,
                     latitude: undefined,
                     gePoName: undefined,
                     state: undefined,
                     maName: undefined,
                     maPhone: undefined,
                     country: undefined,
                     province: undefined,
                     city: undefined,
                     district: undefined,
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
                    url: process.env.VUE_APP_BASE_API + "/demo/device/importData"
                },
                dynColSettingDialogVisible: false, // '导出列设置'弹窗开关
                exportColumnNames: [], // 导出列集合
                columnInfos: [], // 所有列信息
                showAlwaysShowColumnInCheckbox:true,
                dynamicColumnSetting:true,
                columnVisibles: new Array(12).fill(true),//设置列可见性
                visibleIndexs: [], // 可见列的下标集合
                alwaysShowColumnIndexs:[1,2],//总是显示的列的下标（不可隐藏的列）,列下标从 0 开始
                hidenColumnIndexs:[0,3],//隐藏列的下标集合
                // 表单参数
                form: {},
                // 表单校验
                rules: {
                     id: [
                        { required: true, message: "ID不能为空", trigger: "blur" }
                    ],
                     deviceCode: [
                        { required: true, message: "设备编码不能为空", trigger: "blur" }
                    ],
                     deviceName: [
                        { required: true, message: "设备名称不能为空", trigger: "blur" }
                    ],
                     deviceArea: [
                        { required: true, message: "设备所在区域不能为空", trigger: "blur" }
                    ],
                     devicePtName: [
                        { required: true, message: "设备铺设点位名称不能为空", trigger: "blur" }
                    ],
                     gePoName: [
                        { required: true, message: "地理位置名称不能为空", trigger: "blur" }
                    ],
                     state: [
                        { required: true, message: "设备状态不能为空", trigger: "blur" }
                    ],
                     maName: [
                        { required: true, message: "设备维护人员姓名不能为空", trigger: "blur" }
                    ],
                     maPhone: [
                        { required: true, message: "设备维护人员电话不能为空", trigger: "blur" }
                    ]
                }
            };
        },
        created() {
            this.getList();
        },
        methods: {
          handlerMapChange({ BMap, map }) {
            let _this = this; // 设置一个临时变量指向vue实例，因为在百度地图回调里使用this，指向的不是vue实例；
            //添加城市列表控件
            map.addControl(new BMap.CityListControl({
              anchor: BMAP_ANCHOR_TOP_LEFT,
              offset: new BMap.Size(10, 20),
              // 切换城市成功响应事件
              onChangeSuccess: function (e) {

              }
            }));

            // 添加定位控件
            let geoCtrl = new BMap.GeolocationControl({
              anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
              showAddressBar: true, //是否显示
              enableAutoLocation: false //首次是否进行自动定位
            });
            //监听定位成功事件
            geoCtrl.addEventListener("locationSuccess",function(e){
              console.log(e);

            });
            //监听定位失败事件
            geoCtrl.addEventListener("locationError",function(e){
              console.log(e);
              alert(e.message);
            });
            // 将定位控件添加到地图
            map.addControl(geoCtrl);

            let geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(
              function(r) {
                _this.center = { lng: r.longitude, lat: r.latitude }; // 设置center属性值
                _this.autoLocationPoint = { lng: r.longitude, lat: r.latitude }; // 自定义覆盖物
                _this.initLocation = true;
              },
              { enableHighAccuracy: true }
            );

            window.map = map;
          },
          //点击地图监听
          clickEvent(e) {
            map.clearOverlays();
            let Icon_0 = new BMap.Icon(
              positionPic,
              new BMap.Size(64, 64),
              { anchor: new BMap.Size(18, 32), imageSize: new BMap.Size(36, 36) }
            );
            let myMarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat), {
              icon: Icon_0
            });
            map.addOverlay(myMarker);
            //用所定位的经纬度查找所在地省市街道等信息
            let point = new BMap.Point(e.point.lng, e.point.lat);
            let gc = new BMap.Geocoder();
            let _this = this;
            gc.getLocation(point, function(rs) {
              console.log(rs);
              let addComp = rs.addressComponents;
              _this.form.deviceArea = rs.address;//详细地址
              _this.form.gePoName = addComp.province+addComp.city+addComp.district;
              _this.form.devicePtName = addComp.street+addComp.streetNumber;
              _this.form.country = '中国';
              _this.form.province = addComp.province;
              _this.form.city = addComp.city;
              _this.form.district = addComp.district;
            });
            this.form.longitude = e.point.lng;
            this.form.latitude = e.point.lat;
          },
          //定位成功回调
          getLoctionSuccess(point, addressComponent, marker) {
            map.clearOverlays();
            let Icon_0 = new BMap.Icon(
              positionPic,
              new BMap.Size(64, 64),
              { anchor: new BMap.Size(18, 32), imageSize: new BMap.Size(36, 36) }
            );
            let myMarker = new BMap.Marker(
              new BMap.Point(point.point.lng, point.point.lat),
              { icon: Icon_0 }
            );
            map.addOverlay(myMarker);
            this.form.longitude = point.point.lng;
            this.form.latitude = point.point.lat;
            console.log(addressComponent)
            let addComp = addressComponent;
            this.form.gePoName = addComp.province+addComp.city+addComp.district;
            this.form.devicePtName = addComp.street+addComp.streetNumber;
            this.form.deviceArea = this.form.gePoName+this.form.devicePtName;//详细地址
            this.form.country = '中国';
            this.form.province = addComp.province;
            this.form.city = addComp.city;
            this.form.district = addComp.district;
          },
            /** 查询列表 */
            getList() {
                list(this.queryParams).then(response => {
                    this.dataList = response.data.rows;
                    this.total = response.data.total;
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
                     deviceCode: undefined,
                     deviceName: undefined,
                     deviceArea: undefined,
                     devicePtName: undefined,
                     longitude: undefined,
                     latitude: undefined,
                     gePoName: undefined,
                     state: undefined,
                     maName: undefined,
                     maPhone: undefined,
                     country: undefined,
                     province: undefined,
                     city: undefined,
                     district: undefined,
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
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.id)
                this.single = selection.length!==1
                this.multiple = !selection.length
            },
            /** 新增按钮操作 */
            handleAdd() {
                this.reset();
                this.open = true;
                this.title = "添加";
            },
            /** 修改按钮操作 */
            handleUpdate(row) {
                this.reset();
                const id = row.id || this.ids
                get(id).then(response => {
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


            /** 导出按钮操作 */
            handleExport(row) {
                let that = this
                // 重置导出列集合
                this.exportColumnNames = [];
                //导出列设置中默认选中所有的列
                this.columnInfos.forEach(
                    columnInfo => (that.exportColumnNames.push(columnInfo.colName))
                );
                this.dynColSettingDialogVisible = true
            },
            dynColSettingCancel() {
                this.dynColSettingDialogVisible = false;
                // 重置导出列集合
                this.exportColumnNames = [];
            },
            dynColSettingConfirm(row) {
                const postIds = row.id || this.ids;
                const queryParams = this.queryParams;
                queryParams.postIds = postIds
                queryParams.exportColumnNames = this.exportColumnNames
                //导出数据
                exportData(queryParams).then(res => {
                    if(res.code===0){
                        //导出成功后，服务端返回生成的Excel的下载地址和文件名
                        let fileUrl = res.data.fileUrl;
                        let fileName = res.data.originalFileName;
                        this.download(fileUrl,fileName);//调用服务端接口下载文件
                    }else {
                        this.msgError(res.msg);
                    }
                }).catch(function() {});
                this.dynColSettingDialogVisible = false;
            },
            /** 导入按钮操作 */
            handleImport() {
                this.upload.title = "导入数据";
                this.upload.open = true;
                this.upload.isCovered = false
                this.$refs.upload.clearFiles();
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
                window.open(process.env.VUE_APP_BASE_API+'/demo/device/import/template?Authorization='+getToken());
            },
            // 文件上传中处理
            handleFileUploadProgress(event, file, fileList) {
                this.upload.isUploading = true;
            },
            // 文件超出个数限制时的钩子
            handleExceed(file, fileList) {
                this.$message.warning('只能上传一个文件')
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
            oprColumns(indexs, isShow) {
                let self = this;
                indexs.forEach(index => {
                    self.$set(self.columnVisibles, index, isShow);
                });
            },
            handleView(){
              this.$router.push("/demo/device/map");
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
