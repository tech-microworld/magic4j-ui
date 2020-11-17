<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import chinaJson from 'echarts/map/json/china.json'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    loginAreaData:{
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      geoCoordMap:{}
    }
  },
  watch: {
    loginAreaData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      echarts.registerMap('china', chinaJson);//注册中国地图
      /*获取地图数据*/
      const mapFeatures = echarts.getMap('china').geoJson.features;
      let _this = this;
      mapFeatures.forEach(function(v) {
        // 地区名称
        const name = v.properties.name;
        // 地区经纬度
        _this.geoCoordMap[name] = v.properties.cp;
      });
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.loginAreaData)
    },
    setOptions(loginAreaData) {
      let data = loginAreaData.dataList
      let toolTipDataList = loginAreaData.toolTipDataList
      this.chart.setOption({
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#0f378f' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#00091a' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        },
        title: {
          top: 20,
          text: '用户访问地图',
          subtext: '',
          x: 'center',
          textStyle: {
            color: '#ccc'
          }
        },

        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (typeof(params.value)[2] == "undefined") {
              let toolTiphtml = ''
              const toolTipData = toolTipDataList;
              for(let i = 0;i<toolTipData.length;i++){
                if(params.name==toolTipData[i].name){
                  toolTiphtml += toolTipData[i].name+':<br>'
                  for(let j = 0;j<toolTipData[i].value.length;j++){
                    toolTiphtml+=toolTipData[i].value[j].name+':'+toolTipData[i].value[j].value+"<br>"
                  }
                }
              }
              console.log(toolTiphtml)
              return toolTiphtml;
            } else {
              let toolTiphtml = ''
              const toolTipData = toolTipDataList;
              for(let i = 0;i<toolTipData.length;i++){
                if(params.name==toolTipData[i].name){
                  toolTiphtml += toolTipData[i].name+':<br>'
                  for(let j = 0;j<toolTipData[i].value.length;j++){
                    toolTiphtml+=toolTipData[i].value[j].name+':'+toolTipData[i].value[j].value+"<br>"
                  }
                }
              }
              console.log(toolTiphtml)
              return toolTiphtml;
            }
          }
        },

        legend: {
          orient: 'vertical',
          y: 'bottom',
          x: 'right',
          data: ['pm2.5'],
          textStyle: {
            color: '#fff'
          }
        },
        visualMap: {
          show: false,
          min: 0,
          max: 500,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: true,
          seriesIndex: [1],
          inRange: {

          }
        },
        geo: {
          map: 'china',
          show: true,
          roam: true,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#3a7fd5',
              borderColor: '#0a53e9', //线
              shadowColor: '#092f8f', //外发光
              shadowBlur: 20
            },
            emphasis: {
              areaColor: '#0a2dae', //悬浮区背景
            }
          }
        },
        series: [{

          symbolSize: 5,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: '#fff'
            }
          },
          name: 'light',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: this.convertData(loginAreaData),

        },
          {
            type: 'map',
            map: 'china',
            geoIndex: 0,
            aspectScale: 0.75, //长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#FFFFFF',
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            animation: false,
            data: loginAreaData.dataList
          },
          {
            name: 'Top 5',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            symbolSize: [50, 50],
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 9,
                },
                formatter(value) {
                  return value.data.value[2]
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#D8BC37', //标志颜色
              }
            },
            data: this.convertData(loginAreaData),
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            zlevel: 1
          }
        ]
      })
    },
    convertData:function (loginAreaData) {
      const res = [];
      const data = loginAreaData.dataList;
      if(data){
        for (let i = 0; i < data.length; i++) {
          const geoCoord = this.geoCoordMap[data[i].name];
          if (geoCoord) {
            let val = data[i].value;
            res.push({
              name: data[i].name,
              value: geoCoord.concat(val)
            });
          }
        }
      }
      return res;
    }
  }
}
</script>
