<template>
  <el-container direction="vertical" class="loading-area">
    <!--百度地图展示-->
    <el-card :body-style="{ padding: '0px' }" class="box-card map-card">
      <div slot="header" class="clearfix">
        <span>设备分布</span>
        <el-button style="float: right; padding: 3px 0" @click="$router.push({ path: '/demo/device/list' })" type="text">详情</el-button>
      </div>
      <div style="height:500px;padding:0px;">
        <baidu-map class="map" style="height:500px;" :scroll-wheel-zoom="true" :center="map.center" :zoom="map.zoom" @ready="handlerMapChange">
          <div v-for="marker in map.markers" :key="marker.id">
            <bm-marker
              :dragging="true"
              :position="marker.geo"
              :icon="marker.markerIcon"
              @click="handleMarkerClick(marker)">

              <bm-info-window
                :position="marker.geo"
                :show="marker.showFlag"
                @close="infoWindowClose(marker)"
              >
                <span>设备编码：{{ marker.deviceCode }}</span>
                <br/>
                <span>工作状态：{{marker.state === 'online' ? '开机' : marker.state === 'offline' ? '关机' : '维修'}}</span>
                <br/>
                <span>铺设点名称：{{ marker.devicePtName }}</span>
                <br/>
                <span>详细地址：{{ marker.deviceArea }}</span>
              </bm-info-window>
              <bm-label
                :content="marker.devicePtName"
                :labelStyle="{color: 'green', fontSize : '12px',border:'1px solid green',borderRadius:'5px',padding:'5px'}"
                :offset="{width: -20, height: 75}"
                @click="handleMarkerClick(marker)"
              />
            </bm-marker>
          </div>
        </baidu-map>
      </div>
    </el-card>
  </el-container>
</template>

<script>
    import {BaiduMap,BmNavigation,BmView,BmMarker,BmGeolocation,BmCityList} from "vue-baidu-map";
    import markerImg from "@/assets/image/markerIcon.png";
    import { locationList } from "@/api/demo/device";
    export default {
        name: "deviceMap",
        components: {
          BaiduMap,
          BmNavigation,
          BmView,
          BmMarker,
          BmGeolocation,
          BmCityList
        },
        data() {
            return {
                //地图配置参数
                map:{
                  center: { lng: 0, lat: 0 },
                  zoom: 12,
                  markers:[],
                  markerIconUrl:markerImg,//标记图片
                }
            };
        },
        created() {

        },
        methods: {
            //根据定位的位置获取设备列表
            getDeviceLocationList(location) {
              let params = {
                location:location
              };
              locationList(params).then(res => {
                if (res.code === 0) {
                  for(let i=0;i<res.data.length;i++){
                    let marker = res.data[i]
                    marker.geo = {
                      lng:Number(res.data[i].longitude),
                      lat:Number(res.data[i].latitude)
                    };
                    marker.showFlag = false
                    marker.markerIcon = {
                      url:this.map.markerIconUrl,
                      //一定要设置size，要不然不显示图标
                      size:{
                        width:60,
                        height: 72
                      }
                    }
                  }
                  this.map.markers = res.data;
                }
              });
            },
            handlerMapChange ({BMap, map}) {
              const that = this;
              //添加城市列表控件
              map.addControl(new BMap.CityListControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                offset: new BMap.Size(10, 20),
                // 切换城市成功响应事件
                onChangeSuccess: function (e) {
                  that.getDeviceLocationList(e.city)
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
                that.getDeviceLocationList(e.addressComponent.city)
              });
              //监听定位失败事件
              geoCtrl.addEventListener("locationError",function(e){
                console.log(e);
                alert(e.message);
              });
              // 将定位控件添加到地图
              map.addControl(geoCtrl);

              //自动定位
              let geolocation = new BMap.Geolocation();
              geolocation.getCurrentPosition(function(r) {
                let city = '';
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {//定位成功
                  city = r.address.city
                  that.map.center.lng = r.longitude;
                  that.map.center.lat = r.latitude;
                }
                that.getDeviceLocationList(city)
              });
            },
            // 关闭信息窗口 @close 自带的方法
            infoWindowClose (marker) {
              marker.showFlag = false
            },
            infoWindowOpen (marker) {
              marker.showFlag = true
            },
            handleMarkerClick (marker) {
              this.infoWindowOpen(marker)
            }
        }
    }
</script>
