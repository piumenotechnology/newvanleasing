<template>
  <div>
    <b-row class="icon-cards-row invert d-flex justify-content-stretch">
      <b-colxx xxs="12" class="px-3">
        <h3 v-if="vehicle.next_step_status_sales == 'Sold'" class="list-heading mb-3">Actual Value</h3>
        <h3 v-else class="list-heading mb-3">Projected Performance</h3>
      </b-colxx>
      <b-colxx>
        <icon-card
          :title="$t('performance.income')"
          icon="iconsminds-financial"
          :isComa="true"
          :value="Number(theIncome)"
        />
      </b-colxx>
      <b-colxx>
        <icon-card
          :title="$t('performance.cost')"
          icon="iconsminds-billing"
          :isComa="true"
          :value="Number(theCost)"
        />
      </b-colxx>
      <b-colxx>
        <icon-card
          :title="$t('performance.margin')"
          icon="iconsminds-scale"
          :isComa="true"
          :value="Number(theMargin)"
        >
        <h6 class="position-absolute font-weight-normal card-top-buttons text-white">
          <b-badge v-show="isComputed && theMargin > 0" pill id="annual-margin">{{annualMargin}}%</b-badge>
          <b-tooltip target="annual-margin" placement="bottom" :title="$t('performance.tooltip-margin')"/>
        </h6>
        </icon-card>
      </b-colxx>
      <b-colxx v-show="!isSold">
        <icon-card
          :title="$t('performance.residual')"
          icon="iconsminds-money-bag"
          :isComa="true"
          :value="Number(residualValue)"
        />
      </b-colxx>
      <b-colxx v-show="isSold">
        <icon-card
          :title="$t('performance.sold-price')"
          icon="iconsminds-pricing"
          :isComa="true"
          :value="Number(soldPrice)"
        />
      </b-colxx>
      <b-colxx>
        <icon-card
          :title="$t('performance.rental-income')"
          icon="iconsminds-pricing"
          :isComa="true"
          :value="Number(rentalIncome)"
        />
      </b-colxx>
    </b-row>
    <b-row v-if="vehicle.next_step_status_sales !== 'Sold'" class="icon-cards-row d-flex justify-content-stretch">
      <b-colxx xxs="12" class="px-3">
        <h3 class="list-heading mb-3">Current Performance (today)</h3>
      </b-colxx>
      <b-colxx>
        <icon-card
          :title="$t('performance.income')"
          icon="iconsminds-financial"
          :isComa="true"
          :value="Number(actualIncome)"
        />
      </b-colxx>
      <b-colxx>
        <icon-card
          :title="$t('performance.cost')"
          icon="iconsminds-billing"
          :isComa="true"
          :value="Number(actualCost)"
        />
      </b-colxx>
      <b-colxx>
        <icon-card
          :title="$t('performance.margin')"
          icon="iconsminds-scale"
          :isComa="true"
          :value="Number(actualMargin)"
        >
          <h6 class="position-absolute font-weight-normal card-top-buttons text-white">
            <b-badge v-show="isComputed && actualMargin > 0" pill id="annual-actualmargin">{{marginPercentage}}%</b-badge>
            <b-tooltip target="annual-actualmargin" placement="bottom" :title="$t('performance.tooltip-margin-2')"/>
          </h6>
        </icon-card>
      </b-colxx>
      <b-colxx v-show="!isSold">
        <icon-card
          :title="$t('performance.residual')"
          icon="iconsminds-money-bag"
          :isComa="true"
          :value="Number(residualValue)"
        />
      </b-colxx>
      <b-colxx v-show="isSold">
        <icon-card
          :title="$t('performance.sold-price')"
          icon="iconsminds-pricing"
          :isComa="true"
          :value="Number(soldPrice)"
        />
      </b-colxx>
      
    </b-row>
  </div>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '../../constants/config';
import IconCard from '../../components/Cards/IconCard';
export default {
  components: {
      'icon-card': IconCard
  },
  props: ['vehicle', 'subTotal'],
  data() {
    return {
      baseInterest: 0,
      totalIncome: 0,
      otherIncome: 0,
      totalCost: 0,
      otherCost: 0,
      residualValue: 0,
      rentalIncome: 0,
      soldPrice: 0,
      activeSales: '',
      isSold: false,
      isComputed: false
    }
  },
  methods: {
    getSum(total, num) {
      return total + Math.round(num);
    },
    getMonthDifference(startDate, endDate) {
      let outstanding = endDate.getMonth() -
          startDate.getMonth() +
          12 * (endDate.getFullYear() - startDate.getFullYear());
      return outstanding
    },
    async getBaseInterest(id) {
      let url = apiUrl + "/sumtotalbaseinterest/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.baseInterest = (res.data.sum_total_base_interest == null) ? 0 : res.data.sum_total_base_interest
        })
    },
    async getTotalIncome(id) {
      let url = apiUrl + "/listtotalincome/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.totalIncome = res.data.sum_total_income
        })
    },
    async getOtherIncome(id) {
      let url = apiUrl + "/listotherincome/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.otherIncome = res.data.sum_other_income
        })
    },
    async getTotalCost(id) {
      let url = apiUrl + "/listtotalcost/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.totalCost = res.data.sum_total_cost
        })
    },
    async getOtherCost(id) {
      let url = apiUrl + "/listothercost/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.otherCost = res.data.sum_other_cost
        })
    },
    async getResidualValue(id) {
      let url = apiUrl + "/listresidualvalue/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.residualValue = (res.data.sum_residual_value == null) ? 0 : res.data.sum_residual_value
        })
    },
    async getRentalIncome(id) {
      let url = apiUrl + "/listrentalincome/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          this.rentalIncome = (res.data.sum_rental_income == null) ? 0 : res.data.sum_rental_income
        })
    },
    async getSoldPrice(id) {
      let url = apiUrl + "/listsoldprice/" + id
      axios
      .get(url)
        .then(r => r.data)
        .then(res => {
          if(res.data.sum_sold_price !== null) {
            this.isSold = true
            this.soldPrice = res.data.sum_sold_price
          } else {
            this.soldPrice = 0
          }
        })
    }
  },
  computed: {
    theIncome() {
      if(this.isSold == true) {
        return (this.otherIncome !== null) ? Math.abs(Number(this.rentalIncome) + Number(this.soldPrice) + Number(this.otherIncome))
        : Math.abs(Number(this.rentalIncome) + Number(this.soldPrice))
      } else {
        return (this.otherIncome !== null) ? Math.abs(Number(this.rentalIncome) + Number(this.otherIncome) + Number(this.residualValue))
        : Math.abs(Number(this.rentalIncome) + Number(this.residualValue))
      }
    },
    theCost() {
      if(this.vehicle.purchase_method == "Cash") {
        return Number(this.vehicle.price_otr)
      } else {
        return (this.otherCost !== null) ? Math.abs(Number(this.totalCost) + Number(this.otherCost) + Number(this.baseInterest)) : this.totalCost + this.baseInterest
      }
    },
    theMargin() {
      return Number(this.theIncome) - Number(this.theCost)
    },
    actualIncome() {
      // const ongoing = this.getMonthDifference(new Date(this.vehicle.contract_start_date), new Date()) -1
      const ongoing = this.getMonthDifference(new Date(this.vehicle.contract_start_date), new Date())
      // console.log(`month: ${ongoing} ${this.subTotal} `);
      
      return (ongoing <= this.vehicle.term_months) ? ongoing * this.vehicle.monthly_rental + this.vehicle.first_payment + this.subTotal
      : this.theIncome - this.residualValue
    },
    actualCost() {
      let v = this.vehicle
      // let interest = 1 + (v.hp_interest_per_annum / 100)
      // let subTotal = v.monthly_payment * interest
      let subTotal = v.regular_monthly_payment + v.vehicle_tracking

      const ongoing = this.getMonthDifference(new Date(v.hire_purchase_starting_date), new Date())
      console.log(ongoing);
      return (ongoing > 0 && ongoing < v.hp_term) ? (ongoing * subTotal) + v.hp_deposit_amount + this.baseInterest : this.theCost
    },
    actualMargin() {
      return this.actualIncome - this.actualCost
    },
    annualMargin() {
      return parseFloat(this.theMargin / this.theIncome * 100).toFixed(2);
    },
    marginPercentage() {
      return parseFloat(this.actualMargin / this.actualIncome * 100).toFixed(2);
    }
  },
  mounted() {
    this.getBaseInterest(this.$route.params.id)
    this.getTotalIncome(this.$route.params.id)
    this.getOtherIncome(this.$route.params.id)
    this.getTotalCost(this.$route.params.id)
    this.getOtherCost(this.$route.params.id)
    this.getResidualValue(this.$route.params.id)
    this.getRentalIncome(this.$route.params.id)
    this.getSoldPrice(this.$route.params.id)
    setTimeout(() => {
      this.isComputed = true
    }, 1500);
    // this.getActiveSales(this.vehicle.id)
  }
}
</script>
