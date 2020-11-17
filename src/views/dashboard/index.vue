<template>
  <div class="dashboard-editor-container loading-area">
    <login-area-map :login-area-data="loginAreaData"/>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

  </div>
</template>

<script>
  import LoginAreaMap from './LoginAreaMap'
  import LineChart from './LineChart'
  import {accessMap,loginStatistic} from "@/api/sys/dashboard";

  export default {
    name: 'dashboard',
    components: {
      LoginAreaMap,
      LineChart,
    },
    data() {
      return {
        loginAreaData:{},
        lineChartData:{}
      }
    },
    created() {
      this.getLoginAreaMap();
      this.getLineChartData();
    },
    methods: {
      getLoginAreaMap() {
        accessMap().then(response => {
            this.loginAreaData = response.data;
          }
        );
      },
      getLineChartData(){
        loginStatistic().then(response => {
            this.lineChartData = response.data;
          }
        );
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
