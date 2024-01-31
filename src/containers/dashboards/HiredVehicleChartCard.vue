<template>
  <b-card class="dashboard-filled-line-chart" no-body>
    <b-card-body>
      <div class="float-left float-none-xs">
        <div class="d-inline-block">
          <h5 class="d-inline">{{ $t('performance.monthly-rental-income') }}</h5>
          <span class="text-muted text-small d-block">{{ $t('performance.chart-2') }}</span>
        </div>
      </div>
      <!-- <b-dropdown
        id="ddown5"
        :text="$t('dashboards.this-week')"
        size="xs"
        variant="outline-primary"
        class="float-right float-none-xs mt-2"
      >
        <b-dropdown-item>{{ $t('dashboards.last-week') }}</b-dropdown-item>
        <b-dropdown-item>{{ $t('dashboards.this-month') }}</b-dropdown-item>
      </b-dropdown> -->
    </b-card-body>
    <div class="chart card-body pt-0">
      <area-chart :data="charData" :options="areaChartOptions" container-class="chart" shadow :key="chartkey" />
    </div>
  </b-card>
</template>
<script>
import axios from 'axios'
import { apiUrl } from "../../constants/config";
import moment from 'moment'
import AreaChart from "../../components/Charts/Area"
import { areaChartOptions } from "../../components/Charts/config";
import { areaChartData } from "../../data/charts"
import { ThemeColors } from '../../utils'
const colors = ThemeColors()

export default {
  props: ["data"],
  components: {
    "area-chart": AreaChart
  },
  data() {
    return {
      areaChartOptions,
      cars: [],
      chartkey: 0,
      datasets: {
        data: []
      }
    };
  },
  methods: {
    formatDate(date) {
      // return moment(new Date(date)).format('MMM, YYYY')
      return moment(new Date(date)).format('DD MMM')
    },
    refreshCart(val) {
      this.datasets.data = val
      this.chartkey++
    }
  },
  computed: {
    filtered() {
      return this.data.filter(x => x.status_next_step == 'Hired')
    },
    dataRental: {
      get(){
        // let hire = this.data.map(x => (Number(x.id)))
        // return this.data.map(x => (Number(x.final_fees)))
        // console.log(hire.length)
        return this.filtered.map(x => (Number(x.rental_income)))
      },
      set(newVal){
        return newVal
      } 
    },
    dataLabel() {
      // return [...new Map(this.data.map((x) => [x.id, this.formatDate(x.hire_purchase_starting_date)])).values()]
      return this.filtered.map(x => (this.formatDate(x.contract_start_date)))
    },
    charData() {
      const hired = {
        labels: this.dataLabel,
        datasets: [
          {
            label: 'test deh',
            data: this.datasets.data,
            borderColor: colors.themeColor1,
            pointBorderColor: colors.themeColor1,
            pointHoverBackgroundColor: colors.themeColor1,
            pointHoverBorderColor: colors.themeColor1,
            pointRadius: 2,
            pointBorderWidth: 3,
            pointHoverRadius: 2,
            fill: true,
            borderWidth: 3,
            backgroundColor: colors.themeColor2_10
          }
        ]
      };
      return hired
    }
  },
  watch: {
    dataRental(newVal, oldVal) {
      this.refreshCart(newVal)
    },
  }
};
</script>
