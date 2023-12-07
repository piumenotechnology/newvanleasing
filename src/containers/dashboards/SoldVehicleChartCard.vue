<template>
  <b-card v-if="isLoaded" class="dashboard-filled-line-chart" no-body>
    <b-card-body>
      <div class="float-left float-none-xs">
        <div class="d-inline-block">
          <h5 class="d-inline">{{ $t('performance.chart-1') }}</h5>
          <span class="text-muted text-small d-block">{{ $t('dashboards.per-session') }}</span>
        </div>
      </div>
      <b-dropdown
        id="ddown5"
        :text="$t('dashboards.this-week')"
        size="xs"
        variant="outline-secondary"
        class="float-right float-none-xs mt-2"
      >
        <b-dropdown-item>{{ $t('dashboards.last-week') }}</b-dropdown-item>
        <b-dropdown-item>{{ $t('dashboards.this-month') }}</b-dropdown-item>
      </b-dropdown>
    </b-card-body>
    <div class="chart card-body pt-0">
      <area-chart :data="charData" :options="soldChartOptions" container-class="chart" shadow :key="soldkey" />
    </div>
  </b-card>
  <div v-else class="spinner-border text-primary card-spinner"></div>
</template>
<script>
import axios from "axios";
import { apiUrl } from "../../constants/config";
import AreaChart from "../../components/Charts/Area";
import { soldChartOptions } from "../../components/Charts/config";
import {
  ThemeColors
} from "../../utils";
const colors = ThemeColors();

export default {
  components: {
    "area-chart": AreaChart
  },
  data() {
    return {
      isLoaded: false,
      dataY: new Array(),
      dataX: [],
      soldkey: 0,
      soldChartOptions
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    refreshCart(val) {
      this.dataY = val
      this.soldkey++
    },
    getDates(current) {
      let week= new Array();
      current.setDate((current.getDate() - current.getDay() +1));
      for (var i = 0; i < 7; i++) {
        this.fetchData(this.formatDate(current))
        week.push(
          new Date(current).toLocaleDateString('en-us', { weekday:"short" })
        ); 
        current.setDate(current.getDate() +1);
      }
      this.dataX = week
      this.isLoaded = true
    },
    async fetchData(date) {
      let url = apiUrl + `/countvehiclesold/${date}`
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.dataY.push(res.data)
        })
    }
  },
  computed: {
    charData() {
      const hired = {
        labels: this.dataX,
        datasets: [
          {
            label: '',
            data: this.dataY,
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
    dataY(newVal, oldVal) {
      this.refreshCart(newVal)
    },
  },
  mounted() {
    this.getDates(new Date())
  }
};
</script>
