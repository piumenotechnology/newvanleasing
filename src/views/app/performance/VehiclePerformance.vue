<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('performance.header')" />
        <div class="d-flex justify-content-stretch align-items-center top-right-button-container">
          <i class="h5 simple-icon-calendar mb-0 mr-2" />
          <datepicker
            :bootstrap-styling="true"
            class="mr-2"
            v-model="pastDate"
          ></datepicker>
          <datepicker
            :bootstrap-styling="true"
            :disabled-dates="availableDate"
            calendar-class="r-0"
            v-model="endDate"
          ></datepicker>
        </div>
        <!-- <div class="separator mb-5"></div> -->
      </b-colxx>
    </b-row>
    <b-row v-if="items" class="icon-cards-row invert d-flex mb-4">
      <b-colxx xxs="12" md="4" class="mt-xs-3">
        <icon-card
          icon="iconsminds-file-clipboard-file---text"
          :title="$t('performance.active-contracts')"
          :isComa="true"
          :value="Number(items.total_contract)"
        />
      </b-colxx>
      <b-colxx xxs="12" md="4" class="mt-xs-3">
        <icon-card
          icon="iconsminds-key"
          :title="$t('performance.total-vehicles')"
          :isComa="true"
          :value="Number(items.total_vehicle)"
        />
      </b-colxx>
      <b-colxx xxs="12" md="4" class="mt-xs-3">
        <icon-card
          :title="$t('performance.monthly-revenue')"
          icon="iconsminds-financial"
          :isComa="true"
          :isMoney="true"
          :value="Number(items.actual_income)"
        />
      </b-colxx>
      <b-colxx xxs="12" md="4" class="mt-3">
        <icon-card
          :title="$t('performance.monthly-payment')"
          icon="iconsminds-billing"
          :isComa="true"
          :isMoney="true"
          :value="Number(items.actual_cost)"
        />
      </b-colxx>
      <b-colxx xxs="12" md="4" class="mt-3">
        <icon-card
          :title="$t('performance.monthly-freecash')"
          icon="iconsminds-safe-box"
          :isComa="true"
          :isMoney="true"
          :value="Number(items.margin)"
        >
        <h6 class="position-absolute font-weight-normal card-top-buttons text-white">
          <b-badge pill id="annual-margin">{{items.margin_percentage}}%</b-badge>
          <b-tooltip target="annual-margin" placement="bottom" :title="$t('performance.tooltip-margin-2')"/>
        </h6>
        </icon-card>
      </b-colxx>
      <b-colxx xxs="12" md="4" class="mt-3">
        <icon-card
          :title="$t('performance.projected-contracts-margin')"
          icon="iconsminds-statistic"
          :isComa="true"
          :isMoney="true"
          :value="Number(items.avg_forecasting_income)"
        >
        <h6 class="position-absolute font-weight-normal card-top-buttons text-white">
          <b-badge pill id="projected-margin">{{items.percentage_forecasting}}%</b-badge>
          <b-tooltip target="projected-margin" placement="bottom" :title="$t('performance.tooltip-margin-projected')"/>
        </h6>
        </icon-card>
      </b-colxx>
      <!-- <b-colxx>
        <icon-card
          :title="$t('performance.residual')"
          icon="iconsminds-money-bag"
          :isComa="true"
          :isMoney="true"
          :value="Number(items.total_residual)"
        />
      </b-colxx> -->
      <!-- <b-colxx>
        <icon-card
          :title="$t('performance.rental-income')"
          icon="iconsminds-pricing"
          :isComa="true"
          :value="Number(items.actual_income)"
        />
      </b-colxx> -->
    </b-row>

    <b-row>
      <b-colxx xxs="12">
        <b-card>
          <datatable-heading :title="$t('performance.top-hired')" :changePageSize="changePageSize"
          :searchChange="searchChange" :from="from" :to="to" :total="total" :perPage="perPage" :separator="true" :noBreadcrumbs="true" />
          <vuetable ref="vuetable" class="responsive-table" :api-url="apiBase" :query-params="makeQueryParams"
            :per-page="perPage" :reactive-api-url="true" :fields="fields" data-path="data.data" pagination-path="data"
            @vuetable:pagination-data="onPaginationData">
            <template slot="vehicle" slot-scope="props">
              <span>{{props.rowData.vehicle_manufactur}} {{props.rowData.vehicle_model}}</span>
            </template>
            <template slot="action" slot-scope="props">
              <div>
                <b-button :to="{ path: `/app/performance/${props.rowData.id}` }" variant="light" class="mr-1" size="sm"><i class="simple-icon-magnifier mr-1" /> View details</b-button>
              </div>
            </template>
          </vuetable>
          <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import axios from 'axios'
import { apiUrl } from "../../../constants/config";
import Vuetable from "vuetable-2/src/components/Vuetable";
import IconCard from "../../../components/Cards/IconCard";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GradientWithRadialProgressCard from "../../../components/Cards/GradientWithRadialProgressCard";
import SoldVehicleChartCard from "../../../containers/dashboards/SoldVehicleChartCard";
import DatatableHeading from "../../../containers/datatable/DatatableHeading";
import Datepicker from "vuejs-datepicker";

export default {
  components: {
    vuetable: Vuetable,
    "icon-card" : IconCard,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "gradient-with-radial-progress-card": GradientWithRadialProgressCard,
    "sold-vehicle-chart-card": SoldVehicleChartCard,
    "datatable-heading": DatatableHeading,
    "datepicker": Datepicker
  },
  data() {
    return {
      cars: [],
      items: [],
      soldCars: [],
      hiredCars: [],
      apiBase: apiUrl + "/purchaseorderall",
      sort: "",
      order: "",
      page: 1,
      perPage: 15,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      returnCount: 0,
      totalContract: 0,
      selectedItem: "",
      componentKey: 0,
      startDate: null,
      endDate: new Date,
      checkStatus: "",
      costStatus: "",
      outstandingStatus: "",
      incomeStatus: "",
      fields: [
        {
          name: "vehicle_registration",
          sortField: "vehicle_registration",
          title: "Registration Number",
          titleClass: "center aligned",
          dataClass: "text-uppercase list-item-heading",
          width: "15%"
        },
        {
          name: "__slot:vehicle",
          sortField: "vehicle_manufactur",
          title: "Vehicles",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "purchase_method",
          sortField: "purchase_method",
          title: "Funding method",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "hire_purchase_starting_date",
          sortField: "hire_purchase_starting_date",
          title: "Purchase date",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "__slot:action",
          title: "",
          titleClass: "center aligned text-right",
          dataClass: "center aligned text-right",
          width: "20%"
        }
      ],
      sortOrder: [
        {
          field: 'updated_at',
          sortField: 'updated_at',
          direction: 'desc'
        }
      ]
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().slice(0, 10)
    },
    getSum(total, num) {
      return total + Math.round(num);
    },
    getMonthDifference(startDate, endDate, term) {
      let outstanding = endDate.getMonth() -
          startDate.getMonth() +
          12 * (endDate.getFullYear() - startDate.getFullYear());
      return (term >= outstanding && outstanding > 0) ? outstanding : 0
    },
    async fetchData() {
      let date1 = this.formatDate(this.pastDate),
      date2 = this.formatDate(this.endDate),
      url = apiUrl + `/showdashboard/${date1},${date2}`;
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.items = res.data
        }).catch(_error => {
          console.log(_error)
        })
    },
    async fetchContract() {
      let url = apiUrl + "/showactivesales?per_page=1";
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.totalContract = res.data.total
        }).catch(_error => {
          console.log(_error)
        })
    },
    async onStartChange(date1) {
      console.log(date1)
      let newDate1 = this.formatDate(date1),
      date2 = this.formatDate(this.endDate),
      url = apiUrl + `/showdashboard/${newDate1},${date2}`;
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.items = res.data
        }).catch(_error => {
          console.log(_error)
        })
    },
    async onEndChange(date2) {
      console.log(date2)
      let date1 = this.formatDate(this.startDate),
      newDate2 = this.formatDate(date2),
      url = apiUrl + `/showdashboard/${date1},${newDate2}`;
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.items = res.data
        }).catch(_error => {
          console.log(_error)
        })
    },
    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },
    searchChange(val) {
      this.search = val;
      this.$refs.vuetable.refresh();
    },
    async fetchCars() {
      let url = apiUrl + "/purchaseorder";
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.cars = res.data
        }).catch(_error => {
          console.log(_error)
        })
    },
    makeQueryParams(sortOrder, currentPage, perPage) {
      this.isLoading = false;
      return sortOrder[0]
        ? {
          order: sortOrder[0]
            ? sortOrder[0].direction
            : "",
          sort: sortOrder[0]
            ? sortOrder[0].sortField
            : "",
          page: currentPage,
          per_page: this.perPage,
          search: this.search
        }
        : {
          page: currentPage,
          per_page: this.perPage,
          order: this.sortOrder[0].direction,
          sort: this.sortOrder[0].sortField,
          search: this.search
        };
    },
    onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
  },
  computed: {
    totalCars() {
      const sold = this.cars.filter(x => x.status_next_step !== 'Sold').length
      return Number(sold)
    },
    currentHiredVehicle() {
      let num = this.items.filter(x => x.next_step_status_sales == 'Hired').length
      return Number(num)
    },
    hirePercentage() {
      return Math.round(this.currentHiredVehicle*100/this.totalContract)
    },
    pastDate: {
      get (val) {
        let past = new Date();
        past.setMonth(past.getMonth() - 1)
        return past.toISOString()
      },
      set (val) {
        this.startDate = val
      }
    },
    availableDate() {
      let dates = {
        to: new Date(this.startDate)
      }
      return dates
    },

  },
  watch: {
    startDate(newId, oldId) {
      if(newId) {
        this.onStartChange(newId)
      }
    },
    endDate(newId, oldId) {
      if(newId) {
        this.onEndChange(newId)
      }
    }
  },
  mounted() {
    this.fetchData()
    this.fetchContract()
    this.fetchCars()
  }
}
</script>
