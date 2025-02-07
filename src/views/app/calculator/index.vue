<template>
  <div>
    <b-row>
      <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('menu.calculator')"/>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12" lg="6">
          <b-card class="mb-4" :title="$t('calculator.tab-1')" >
            <b-form
              id="addContractForm"
              class="av-tooltip tooltip-right-bottom"
              label="Bottom Right"
              @submit.prevent="onAddContractSubmit"
              >

              <b-form-group label="Vehicle Type" class="has-top-label">
                <v-select :options="vehicleType" v-model="vehicle.type" :value="vehicle.type" :searchable="false"/>
              </b-form-group>

              <b-form-group label="Contract Length" class="has-top-label">
                <b-input-group>
                  <money v-model="vehicle.contractLength" v-bind="duration" class="form-control"></money>
                </b-input-group>
              </b-form-group>

              <b-form-group label="Annual Mileage" class="has-top-label">
                <b-input-group>
                  <money v-model="vehicle.annualMileage" v-bind="distance" class="form-control"></money>
                </b-input-group>
              </b-form-group>

              <b-form-group label="Minimum Contract Total" class="has-top-label">
                <b-input-group>
                  <currency-field v-model="vehicle.minimumContract" :options="{ currency: 'GBP'}"/>
                </b-input-group>
              </b-form-group>

              <b-form-group label="Initial Rental" class="has-top-label">
                <b-input-group>
                  <currency-field v-model="vehicle.initialRental" :options="{ currency: 'GBP'}"/>
                </b-input-group>
              </b-form-group>

              <h4 class="mt-5 mb-3">Dealer Code</h4>

              <b-form-group label="Monthly Rental (Confirmed)" class="has-top-label">
                <b-input-group>
                  <currency-field v-model="vehicle.monthlyRental" :options="{ currency: 'GBP'}"/>
                </b-input-group>
              </b-form-group>


            </b-form>

          </b-card>
      </b-colxx>
      <b-colxx xxs="12" lg="6">
          <b-card class="mb-4" :title="$t('calculator.tab-2')" >
            <ul class="list-unstyled mb-4">
               <li class="nav-item mb-3">
                  <span class="d-inline-block text-muted">Minimum Monthly Rental</span>
                  <span class="float-right text-one">£ {{ Math.round(mmr) | withcoma }}</span>
               </li>
               <li class="nav-item mb-3">
                  <span class="d-inline-block text-muted">Target Monthly Rental</span>
                  <span class="float-right text-one">£ {{ tmr | withcoma }}</span>
               </li>
               <li class="nav-item mb-3">
                  <span class="d-inline-block text-muted">Target Monthly Rental (Adverse)</span>
                  <span class="float-right text-one">£ {{ tmra | withcoma }}</span>
               </li>
               <li class="nav-item mt-3 pt-3 border-top border-1 font-weight-bold">
                  <span class="d-inline-block text-muted">Dealer Code</span>
                  <span class="float-right text-one">£ {{ dealerCode | withcoma }}</span>
               </li>
            </ul>
          </b-card>
      </b-colxx>
    </b-row>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { Money } from 'v-money';
import CurrencyField from "../../../components/Common/CurrencyField.vue";

export default {
  components: {
    "v-select": vSelect,
    "money": Money,
    "currency-field": CurrencyField
  },
  filters: {
    withcoma: function(num) {
      return Number(num).toLocaleString()
    }
  },
  data() {
    return {
      vehicle: {
        type: "New/Pre Reg",
        contractLength: 12,
        annualMileage: 0,
        minimumContract: 0,
        initialRental: 0,
        monthlyRental: 0
      },
      initialDealerCode: 0,
      millRate:0.125,
      vehicleType: [
        "New/Pre Reg",
        "Used",
      ],
      duration: {
        decimal: '.',
        thousands: ',',
        suffix: ' months',
        precision: 0,
        masked: false
      },
      distance: {
        decimal: '.',
        thousands: ',',
        suffix: ' miles',
        precision: 0,
        masked: false
      }
    }
  },
  computed: {
    mmr() {
      let res = 0
      if(this.vehicle.type == "Used") {
        this.millRate = 0.07
      }
      if(this.vehicle.annualMileage <= 10000){
        res = (this.vehicle.minimumContract - this.vehicle.initialRental) / this.vehicle.contractLength
      } else if(this.vehicle.annualMileage > 10000) {
        let sliced = (this.vehicle.minimumContract - this.vehicle.initialRental)
        let temp = (this.vehicle.annualMileage - 10000) * this.millRate
        res = (sliced + temp) / 12
      }
      return Number(res)
    },
    tmr() {
      let res = 0
      if(this.mmr > 0) {
        res = this.mmr + 33
      }
      return Math.round(res)
    },
    tmra() {
      let res = 0
      if(this.mmr > 0) {
        res = this.mmr + 55
      }
      return Math.round(res)
    },
    mct() {
      return Math.round((this.mmr * 12) + this.vehicle.initialRental)
    },
    ct() {
      let res = 0
      if(this.vehicle.monthlyRental > 0) {
        res = (this.vehicle.monthlyRental * 12) + this.vehicle.initialRental
      }
      return Math.round(res)
    },
    dealerCode() {
      let res = this.initialDealerCode
      if(this.vehicle.monthlyRental > 0) {
        if(this.ct > this.mct) {
          res = 1800 + (this.ct - this.mct) * 0.5
        }
      }
      return Math.round(res)
    }
  }
}
</script>
