<template>
  <b-card>
    <p class="list-heading text-uppercase mb-4">{{ $t("performance.contract-history") }}</p>
    <vuetable
      table-height="280px"
      ref="vuetable-scrollable"
      :api-url="apiBase"
      :fields="fields"
      :reactive-api-url="true"
      :per-page="20"
      data-path="data"
    >
      <template slot="agreement" slot-scope="props">
        <span v-show="props.rowData.agreement_number" @click.prevent="showPerformanceModal(props.rowData)" class="cursor-pointer">{{ props.rowData.agreement_number }}</span>
      </template>
      <template slot="customer" slot-scope="props">
        <span v-show="props.rowData.cust_name" @click.prevent="showPerformanceModal(props.rowData)" class="cursor-pointer">{{ props.rowData.cust_name }}</span>
      </template>
      <template slot="income" slot-scope="props">
        <span v-if="props.rowData.next_step_status_sales === 'Sold'">{{ getTotalIncome(props.rowData.rental_income, props.rowData.sold_price) }}</span>
        <span v-else>£ {{ props.rowData.total_income | withcoma }}</span>
      </template>
      <template slot="mileage" slot-scope="props">
        <span v-show="props.rowData.annual_mileage">{{ props.rowData.annual_mileage }} miles</span>
      </template>
      <template slot="date" slot-scope="props">
        <span v-show="props.rowData.contract_start_date">{{ props.rowData.contract_start_date | datetime }}</span>
      </template>
      <template slot="end" slot-scope="props">
        <span v-if="props.rowData.vehicle_return_date">{{ props.rowData.vehicle_return_date | datetime }}</span>
        <span v-else>-</span>
      </template>
      <template slot="status" slot-scope="props">
        <b-badge v-show="props.rowData.next_step_status_sales === 'Hired'" variant="primary">{{ props.rowData.next_step_status_sales }}</b-badge>
        <b-badge v-show="props.rowData.next_step_status_sales === 'Innactive'" variant="light">{{ props.rowData.next_step_status_sales }}</b-badge>
        <b-badge v-show="props.rowData.next_step_status_sales === 'Sold'" variant="dark">{{ props.rowData.next_step_status_sales }}</b-badge>
      </template>
    </vuetable>
    <view-performance-details ref="performanceDetail"/>
    <p class="list-heading text-uppercase font-weight-semibold my-3">{{ $t("performance.other-cost") }}</p>
    <div v-if="costItems.length === 0">
      No additional cost found in this vehicle.
    </div>
    <b-table v-else striped :items="costItems" />
    <div class="separator my-4"></div>
    <p class="list-heading text-uppercase font-weight-semibold mb-3">Other income</p>
    <div v-if="incomeItems.length === 0">
      No additional income found in this vehicle.
    </div>
    <b-table v-else striped :items="incomeItems" />
  </b-card>
</template>
<style scoped>
.theader {
  font-size: 0.825rem;
  line-height: 1.2;
}
</style>
<script>
import moment from "moment"
import axios from 'axios';
import { apiUrl } from "../../constants/config";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../components/Common/VuetablePaginationBootstrap";
import ViewPerformanceDetails from "../pages/ViewPerformanceDetail";

export default {
  props: ['id'],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "view-performance-details": ViewPerformanceDetails,
  },
  data() {
    return {
      apiBase: apiUrl + "/listvehicleinvehiclecard/" + this.id,
      selected: [],
      fields: [
        {
          name: "__slot:agreement",
          title: "Agreement No",
          titleClass: "center aligned",
          dataClass: "enter aligned font-weight-semibold",
        },
        {
          name: "__slot:customer",
          title: "Customer",
          titleClass: "center aligned",
          dataClass: "enter aligned",
          width: "22%"
        },
        {
          name: "__slot:income",
          title: "Income",
          titleClass: "center aligned",
          dataClass: "text-muted",
        },
        // {
        //   name: "__slot:mileage",
        //   title: "Mileage",
        //   titleClass: "center aligned",
        //   dataClass: "text-muted",
        // },
        {
          name: "__slot:date",
          title: "Start Date",
          titleClass: "center aligned",
          dataClass: "text-muted",
        },
        {
          name: "__slot:end",
          title: "Return Date",
          titleClass: "center aligned",
          dataClass: "text-muted",
        },
        {
          name: "__slot:status",
          title: "Status",
          titleClass: "center aligned text-center",
          dataClass: "center aligned text-center",
        },
        // {
        //   name: "__slot:action",
        //   title: "",
        //   titleClass: "center aligned text-right",
        //   dataClass: "center aligned text-right",
        //   width: "20%"
        // }
      ],
      costItems: [],
      incomeItems: [],
      sortOrder: [
        {
          field: 'vehicle_return_date',
          sortField: "vehicle_return_date",
          direction: 'desc'
        }
      ]
    }
  },
  filters: {
    datetime: function(date) {
      return moment(date).format('ll')
    },
    withcoma: function(num) {
      return Number(num).toLocaleString()
    }
  },
  methods: {
    showPerformanceModal(obj) {
      this.$refs.performanceDetail.openModal(obj);
    },
    getTotalIncome(val1, val2) {
      const total = Math.abs(val1 + val2);
      const totalComa = Number(total).toLocaleString();
      return `£ ${totalComa}`;
    },
    getOtherCost(id) {
      let url = apiUrl + "/listothercost/" + id
      axios
      .get(url)
        .then(r => {
          // console.log(r.data.data);
          let costs = r.data.data
          if (costs.length === 0) return
          for (let i = 0; i < costs.length; i++) {
            const costObject = {
              no: i + 1,
              amount: `£ ${costs[i].amount_oc}`,
              description: costs[i].description_expenses,
            };
            this.costItems.push(costObject);
          }
        })
    },
    getOtherIncome(id) {
      let url = apiUrl + "/listotherincome/" + id
      axios
      .get(url)
        .then(r => {
          // console.log(r.data.data);
          let incomes = r.data.data
          if (incomes.length === 0) return
          for (let i = 0; i < incomes.length; i++) {
            const incomeObject = {
              no: i + 1,
              amount: `£ ${incomes[i].amount_oi}`,
              description: incomes[i].description_income,
            };
            this.incomeItems.push(incomeObject);
          }
        })
    }
  },
  mounted() {
    this.getOtherCost(this.$route.params.id)
    this.getOtherIncome(this.$route.params.id)
  }
}
</script>
