<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
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
        default: '350px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
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
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
      setOptions(chartData) {
        this.chart.setOption({
          backgroundColor: '#fff',
          title: {
            text: "7天内用户访问曲线",
            left: "18px",
            top: "0",
            textStyle: {
              color: "#999",
              fontSize: 12,
              fontWeight: '400'
            }
          },
          color: ['#73A0FA', '#73DEB3', '#FFB761'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              },
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          grid: {
            left: '25',
            right: '25',
            bottom: '24',
            top: '75',
            containLabel: true
          },
          legend: {
            data: ['用户访问次数'],
            orient: 'horizontal',
            icon: "rect",
            show: true,
            left: 20,
            top: 25,
          },
          xAxis: {
            type: 'category',
            data: chartData.dateRangeList,
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#999',
              textStyle: {
                fontSize: 12
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F3F4F4'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
          },
          series: [
            {
              name: '用户访问次数',
              type: 'line',
              smooth: true,
              data: chartData.userAccessCountList
            }
          ]
        })
      }
    }
  }
</script>
