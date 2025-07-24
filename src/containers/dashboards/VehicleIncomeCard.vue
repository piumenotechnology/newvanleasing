<template>
  <div>
    <!-- <p class="list-heading text-uppercase mb-4">Rental income</p>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Agreement Number</th>
          <th scope="col">Rental Income</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,i) in vehicles" :key="`vehicle_${i}`">
          <th scope="row">{{i+1}}</th>
          <td class="font-weight-semibold">{{ item.agreement_number }}</td>
          <td>£ {{ item.rental_income | withcoma }}</td>
        </tr>
      </tbody>
    </table> -->

    <p class="font-weight-semibold">
      <span class="text-muted font-weight-light d-inline mr-1">Rental income
      </span>£ {{totalRental | withcoma}}
    </p>

    <div>
      <!--
      <p class="list-heading text-uppercase mt-2">Other income</p>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(income,index) in otherIncome" :key="`oi_${index}`">
            <th scope="row">{{index+1}}</th>
            <td>{{ income.description_income}}</td>
            <td>£ {{ income.amount_oi | withcoma}}</td>
          </tr>
        </tbody>
      </table> -->
      <div class="separator mb-4" />
      <p v-if="totalOtherIncome != null" class="font-weight-semibold">
        <span class="text-muted font-weight-light d-inline mr-1">Other income
        </span>£ {{totalOtherIncome | withcoma}}
      </p>
      <p v-else class="font-weight-semibold">
        <span class="text-muted font-weight-light d-inline mr-1">Other income
        </span>£ 0
      </p>
    </div>

    <div class="separator mb-4" />
    <p class="font-weight-semibold">
      <span class="text-muted font-weight-light d-inline mr-1">Residual Value
      </span>£ {{ vehicles[0].residual_value | withcoma}}
    </p>
  </div>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '../../constants/config';
import moment from 'moment';
export default {
  props: ["vehicles"],
  data() {
    return {
      // costs: [],
      otherIncome: [],
      totalOtherIncome: null
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
    // getOtherIncome(id) {
    //   let url = apiUrl + "/othercost?per_page=500"
    //   axios
    //   .get(url)
    //     .then(r => r.data)
    //     .then(res => {
    //       let costs = res.data.data.filter(x => x.id_purchase_order == id).map(x => x.amount_oc);
    //       (costs.length > 0) ? this.otherCost = costs.reduce((a, b) => {
    //         return a + b
    //       },0) : 0
    //     })
    // }
    getOtherIncome(id) {
      let url = apiUrl + "/listotherincome/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.otherIncome = res.data
          this.totalOtherIncome = res.sum_other_income
        })
    }
  },
  computed: {
    totalRental() {
      let subTotal = this.vehicles.map(x => x.rental_income)
      if(subTotal.length > 0) {
        return subTotal.reduce((a, b) => {
          return a + b
        },0)
      } else {
        return 0
      }
    }
  },
  mounted() {
    this.getOtherIncome(this.$route.params.id)
  }
};
</script>
