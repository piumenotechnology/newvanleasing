<template>
  <div v-if="isLoading" class="loading" key="itemLoading"></div>
  <div v-else>
    <b-row class="mb-3">
      <b-colxx xxs="12">
        <b-link @click.prevent="$router.go(-1)" class="heading-icon baseline">
          <i class="simple-icon-arrow-left" />
        </b-link>
        <piaf-breadcrumb :heading="vehicle.vehicle_registration" />
        <div class="top-right-button-container">
          <h4 class="d-flex align-items-center">
            <span class="text-muted font-weight-light text-small">{{ $t("pages.status") }}</span>
            <b-badge v-if="vehicle.status_next_step == 'Available'" pill variant="success"
              class="ml-2">{{ vehicle.status_next_step }}</b-badge>
            <b-badge v-else-if="vehicle.status_next_step == 'Hired'" pill variant="primary"
              class="ml-2">{{ vehicle.status_next_step }}</b-badge>
            <b-badge v-else pill variant="dark"
              class="ml-2">{{ vehicle.status_next_step }}</b-badge>
          </h4>
        </div>
        <!-- <div class="separator mb-5"></div> -->
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12" lg="12">
        <performance-card :vehicle="vehicle" :subTotal="subTotal" />
      </b-colxx>
      <b-colxx xxs="12" lg="5">
        <b-row>
          <b-colxx xxs="6" class="mb-4">
            <b-card class="mb-lg-3" no-body>
              <vehicle-detail-card v-if="vehicle" :vehicle="vehicle" />
            </b-card>
          </b-colxx>
          <b-colxx xxs="6" class="mb-4">
            <b-card class="mb-lg-3" no-body>
              <vehicle-cost-card v-if="vehicle" :vehicle="vehicle" />
            </b-card>
          </b-colxx>
        </b-row>
      </b-colxx>
      <b-colxx xxs="12" lg="7" class="mb-4">
        <b-card class="mb-lg-3" no-body>
          <contract-history-card v-if="vehicle" :id="$route.params.id" />
        </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '../../../constants/config';
import VehicleDetailCard from '../../../containers/dashboards/VehicleDetailCard';
import VehicleCostCard from '../../../containers/dashboards/VehicleCostCard';
import PerformanceCard from '../../../containers/dashboards/PerformanceCard';
import ContractHistoryCard from '../../../containers/dashboards/ContractHistoryCard';

export default {
  components: {
    'vehicle-detail-card': VehicleDetailCard,
    'vehicle-cost-card': VehicleCostCard,
    'performance-card': PerformanceCard,
    'contract-history-card': ContractHistoryCard
  },
  data() {
  return {
    isLoading: true,
    subTotal: 0,
    vehicle: [],
    report: []
  }
  },
  methods: {
    getSum(total, num) {
      return total + Math.round(num);
    },
    fetchCar(id) {
      let url = apiUrl + "/listvehicleinvehiclecard/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.isLoading = false
          let subTotal = res.data.filter(x => x.next_step_status_sales !== "Hired").map(x => x.total_income)
          // console.log(subTotal);
          if(subTotal.length > 0) {
            this.subTotal = subTotal.reduce(this.getSum, 0)
          } else {
            this.subTotal = 0
          }
          this.vehicle = res.data.pop()
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  },
  mounted() {
    this.fetchCar(this.$route.params.id)
  }
}
</script>
