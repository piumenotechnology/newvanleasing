<template>
  <div>
    <b-row>
      <b-colxx xxs="12" class="mb-4">
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
    <!-- <b-row >
      <b-colxx sm="12">
        <b-card class="bg-dark text-white mb-3">
          <ul class="list-unstyled">
            <li v-for="item in items" class="nav-item">
              <p>{{ item.id_purchase_order }}: {{ item.agreement_number }}, {{ item.cust_name }} | {{ item.contract_start_date }} => {{ item.total_income }} | 
              {{ item.monthly_rental }}</p>
            </li>
          </ul>
        </b-card>
      </b-colxx>
    </b-row> -->
    <b-row>
      <b-colxx sm="12" lg="4" class="mb-4">
        <gradient-with-radial-progress-card
          icon="iconsminds-inbox-out"
          :title="`${currentHiredVehicle}`"
          :detail="`Total Vehicles: ${totalCars}`"
          :suffix="'Hire Contract'"
          :percent="`${currentHiredVehicle}`*100/`${totalContract}`"
          :progressText="`${hirePercentage}%`"
        />
      </b-colxx>
      <b-colxx xs="6" lg="4" class="mb-3">
        <gradient-with-growth-progress-card
          icon="iconsminds-financial"
          :title="`${theIncome}`"
          :status="checkStatus"
          :prefix="'£'"
          :detail="$t('performance.total-income')"
        />
      </b-colxx>
      <b-colxx xs="6" lg="4" class="mb-3">
        <gradient-with-growth-progress-card
          icon="iconsminds-billing"
          :title="`${theCost}`"
          :status="costStatus"
          :prefix="'£'"
          :detail="$t('performance.total-cost')"
        />
      </b-colxx>
      <!-- <b-colxx xs="6" lg="2" class="mb-3">
        <gradient-with-growth-progress-card
          icon="iconsminds-basket-coins"
          :title="`${potentialIncome}`"
          :status="incomeStatus"
          :prefix="'£'"
          :detail="$t('performance.potential-income')"
        />
      </b-colxx>
      <b-colxx xs="6" lg="2" class="mb-3">
        <gradient-with-growth-progress-card
          icon="iconsminds-letter-open"
          :title="`${loanOutstanding}`"
          :status="outstandingStatus"
          :prefix="'£'"
          :detail="$t('performance.loan-outstanding')"
        />
      </b-colxx> -->
      <b-colxx sm="12" lg="12" class="mb-4">
        <hired-vehicle-chart-card :data="items"></hired-vehicle-chart-card>
      </b-colxx>
      <!-- <b-colxx sm="12" md="6" class="mb-4">
        <sold-vehicle-chart-card></sold-vehicle-chart-card>
      </b-colxx> -->
    </b-row>
    <b-row>
      <b-colxx xxs="12" class="mb-4">
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
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import GradientWithRadialProgressCard from "../../../components/Cards/GradientWithRadialProgressCard";
import GradientWithGrowthProgressCard from "../../../components/Cards/GradientWithGrowthProgressCard";
import SoldVehicleChartCard from "../../../containers/dashboards/SoldVehicleChartCard";
import HiredVehicleChartCard from "../../../containers/dashboards/HiredVehicleChartCard";
import DatatableHeading from "../../../containers/datatable/DatatableHeading";
import Datepicker from "vuejs-datepicker";

export default {
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "gradient-with-radial-progress-card": GradientWithRadialProgressCard,
    "gradient-with-growth-progress-card": GradientWithGrowthProgressCard,
    "sold-vehicle-chart-card": SoldVehicleChartCard,
    "hired-vehicle-chart-card": HiredVehicleChartCard,
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
      return new Date(date).toISOString().substr(0, 10)
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
        return past.setDate(past.getDate() - 30)
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
    rentalIncome() {
      let income = this.items.map(x => x.monthly_payment)
      return income.reduce(this.getSum, 0)
    },
    totalIncome() {
      let total = this.items.map(x => x.total_income)
      return total.reduce(this.getSum, 0)
    },
    otherIncome() {
      let other = this.items.map(x => x.other_income)
      return other.reduce(this.getSum, 0)
    },
    theIncome() {
      return this.totalIncome + this.otherIncome
    },
    initialIncome() {
      let old = this.initial.map(x => x.total_income)
      return old.reduce(this.getSum, 0)
    },
    totalCost() {
      // let total = this.items.map(x => x.total_cost)
      let costs = [...new Map(this.items.map((x) => [x.id, x.total_cost])).values()];
      return costs.reduce(this.getSum, 0)
    },
    otherCost() {
      let oc = this.items.map(x => x.amount_oc)
      return oc.reduce(this.getSum, 0)
    },
    theCost() {
      return this.totalCost + this.otherCost
    },
    potentialIncome() {
      var arr = this.items.map((x) => {
        const remaining = this.getMonthDifference(new Date(x.contract_start_date), this.endDate, x.term_months)
        return (remaining > 0) ? (x.term_months - remaining) * x.monthly_rental : 0
        // this.getMonthDifference(new Date(x.contract_start_date), this.endDate, x.hp_term) * x.monthly_payment));
      })
      return arr.reduce(this.getSum, 0)
    },
    loanOutstanding() {
      var arr = this.items.map((x) => {
        const remaining = this.getMonthDifference(new Date(x.contract_start_date), this.endDate, x.hp_term)
        return (remaining > 0) ? (x.hp_term - remaining) * x.monthly_payment : 0
      })
      return arr.reduce(this.getSum, 0)
      // var arr = this.items.map(x => (
      //   this.getMonthDifference(new Date(x.contract_start_date), this.endDate, x.term_months) * x.regular_monthly_payment));
      // return arr.reduce(this.getSum, 0)
    }
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
    },
    totalCost(newVal, oldVal) {
      if(oldVal > 0 && newVal > oldVal) {
        this.costStatus = "up"
      } else if (newVal < oldVal) {
        this.costStatus = "down"
      } else {
        this.costStatus = null
      }
    },
    theIncome(newVal, oldVal) {
      if(oldVal > 0 && newVal > oldVal) {
        this.checkStatus = "up"
      } else if (newVal < oldVal) {
        this.checkStatus = "down"
      } else {
        this.checkStatus = null
      }
    },
    potentialIncome(newVal, oldVal) {
      if(newVal > oldVal && oldVal > 0) {
        this.incomeStatus = "up"
      } else if (newVal < oldVal && newVal > 0) {
        this.incomeStatus = "down"
      } else {
        this.incomeStatus = null
      }
    },
    loanOutstanding(newVal, oldVal) {
      if(newVal > oldVal && oldVal > 0) {
        this.outstandingStatus = "up"
      } else if (newVal < oldVal && newVal > 0) {
        this.outstandingStatus = "down"
      } else {
        this.outstandingStatus = null
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
