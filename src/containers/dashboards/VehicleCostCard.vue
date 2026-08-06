<template>
  <div>
    <p class="font-weight-semibold">
      <span class="text-muted font-weight-light d-inline mr-1">{{ $t("performance.otr-price") }}
      </span>£ {{ vehicle.price_otr | withcoma }}
    </p>
    <div class="separator mb-3" />
    <p class="font-weight-semibold">
      <span class="text-muted font-weight-light d-inline mr-1">{{ $t("performance.installment") }}
      </span>£ {{ vehicle.total_cost | withcoma }}
      <!-- </span><i id="other-cost" >£ {{ getInterest(vehicle.price_otr, vehicle.hp_interest_per_annum, period) | withcoma }}</i>
      <b-tooltip target="other-cost" placement="left" :title="$t('performance.tooltip-cost')">
      </b-tooltip> -->
    </p>
    <div class="separator mb-3" />
    <p class="font-weight-semibold">
      <span class="text-muted font-weight-light d-inline mr-1">{{ $t("performance.other-cost") }}
      </span>£ {{ otherCost | withcoma }}
    </p>
    <div class="separator mb-3" />
    <p class="font-weight-semibold">
      <span class="text-muted font-weight-light d-inline mr-1">{{ $t("performance.total-cost") }}
      </span>£ {{ theCost | withcoma }}
    </p>
    <div v-show="this.vehicle.purchase_method === 'Hire Purchase'">
      <div class="separator mb-3" />
      <p class="font-weight-semibold">
        <span class="text-muted font-weight-light d-inline mr-1">{{ $t("performance.current-settlement") }}
        </span>£ {{ currentSettlement | withcoma }}
      </p>
    </div>

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
  </div>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '../../constants/config';
import moment from 'moment';
export default {
  props: ['vehicle', 'costs'],
  data() {
    return {
      otherCost: 0,
      totalCost: 0,
      currentSettlement: 0
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
    getMonthDifference(startDate, endDate) {
      let outstanding = endDate.getMonth() -
          startDate.getMonth() +
          12 * (endDate.getFullYear() - startDate.getFullYear());
      return outstanding
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
    },
    async getCurrentSettlement(id) {
      let url = apiUrl + "/listtotalcost/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.currentSettlement = res.data.est_current_settlement
        })
    },
  },
  computed: {
    period() {
      return this.vehicle.hp_term / 12
    },
    purchaseProvider() {
      return (this.vehicle.hp_finance_provider !== null) ? this.vehicle.hp_finance_provider : "n/a"
    },
    theCost() {
      this.otherCost = this.costs.sum_other_cost
      return (this.otherCost > 0) ? Math.abs(Number(this.otherCost) + Number(this.vehicle.total_cost))
      : this.vehicle.total_cost
    },
    // currentSettlement() {
      // const {
      //   hp_term,
      //   monthly_payment,
      //   hp_deposit_amount,
      //   total_cost,
      //   hire_purchase_starting_date
      // } = this.vehicle;

      // if (!hp_term || !monthly_payment || !total_cost) return 0;

      // const ongoing =
      //   this.getMonthDifference(
      //     new Date(hire_purchase_starting_date),
      //     new Date()
      //   ) + 1;

      // if (ongoing > hp_term) return 0;

      // const running_payment =
      //   (monthly_payment * ongoing) + hp_deposit_amount;

      // return Math.max(0, Number((total_cost - running_payment).toFixed(2)));
      // return this.costs.est_current_settlement
    // }
  },
  mounted() {
    this.getCurrentSettlement(this.$route.params.id)
  }
};
</script>
