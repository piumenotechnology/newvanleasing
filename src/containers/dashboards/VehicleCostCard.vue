<template>
  <b-card-body>
    <p class="list-heading text-uppercase mb-4">{{ $t("performance.cost") }}</p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("performance.otr-price") }}
      </span>£ {{ vehicle.price_otr | withcoma }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("performance.installment") }}
      </span>£ {{ vehicle.total_cost | withcoma }}
      <!-- </span><i id="other-cost" >£ {{ getInterest(vehicle.price_otr, vehicle.hp_interest_per_annum, period) | withcoma }}</i>
      <b-tooltip target="other-cost" placement="left" :title="$t('performance.tooltip-cost')">
      </b-tooltip> -->
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("performance.other-cost") }}
      </span>£ {{ otherCost| withcoma }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("performance.total-cost") }}
      </span>£ {{ theCost | withcoma }}
    </p>
    
    <div class="separator mb-4" />
    <p class="list-heading text-uppercase mb-4">{{ $t("performance.funding") }}</p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.provider-name") }}
      </span>{{ purchaseProvider }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.purchase-date") }}
      </span>{{ vehicle.hire_purchase_starting_date | datetime }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.interest-rate") }}
      </span>{{ vehicle.hp_interest_per_annum | withcoma }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.terms") }}
      </span>{{ vehicle.hp_term }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.deposit") }}
      </span>£ {{ vehicle.hp_deposit_amount | withcoma }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.documentation-fee") }}
      </span>£ {{ vehicle.documentation_fees_pu | withcoma }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.final-fee") }}
      </span>£ {{ vehicle.final_fees | withcoma }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.other-fee") }}
      </span>£ {{ vehicle.other_fees | withcoma }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.monthly-repayment") }}
      </span>£ {{ vehicle.monthly_payment | withcoma }}
    </p>
    <p class="font-weight-semibold">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.final-payment") }}
      </span>£ {{ vehicle.final_payment | withcoma }}
    </p>
  </b-card-body>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '../../constants/config';
import moment from 'moment';
export default {
  props: ["vehicle"],
  data() {
    return {
      costs: [],
      otherCost: 0,
      totalCost: 0
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
    getInterest(p, r, t){
      let A = (p * r * t) / 100
      return Math.ceil(A)
    },
    // getOtherCost(id) {
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
    getOtherCost(id) {
      let url = apiUrl + "/listothercost/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.otherCost = res.data.sum_other_cost
        })
    }
  },
  computed: {
    period() {
      return this.vehicle.hp_term / 12
    },
    purchaseProvider() {
      return (this.vehicle.hp_finance_provider !== null) ? this.vehicle.hp_finance_provider : "n/a"
    },
    theCost() {
      return (this.otherCost > 0) ? Math.abs(Number(this.otherCost) + Number(this.vehicle.total_cost))
      : this.vehicle.total_cost
    }
  },
  mounted() {
    this.getOtherCost(this.$route.params.id)
  }
};
</script>
