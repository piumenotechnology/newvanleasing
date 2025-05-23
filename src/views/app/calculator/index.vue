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
              id="calculatorForm"
              class="av-tooltip tooltip-right-bottom"
              label="Bottom Right"
              @submit.prevent="onCalculateSubmit"
              >

              <b-form-group label="Vehicle Type" class="has-top-label">
                <v-select :options="vehicleType" v-model="vehicle.type" :value="vehicle.type" :searchable="false" />
              </b-form-group>

              <b-form-group label="Contract Length" class="has-top-label">
                <b-input-group>
                  <money v-model.trim="$v.vehicle.contract_length.$model" v-bind="duration" class="form-control"
                  :state="!$v.vehicle.contract_length.$error"></money>
                </b-input-group>
                <div v-if="!$v.vehicle.contract_length.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicle.contract_length.$error && !$v.vehicle.contract_length.required }"
                >This field is required!</div>
              </b-form-group>

              <b-form-group label="Annual Mileage" class="has-top-label">
                <b-input-group>
                  <money v-model.trim="$v.vehicle.annual_mileage.$model" v-bind="distance" class="form-control"
                  :state="!$v.vehicle.annual_mileage.$error"></money>
                </b-input-group>
                <div v-if="!$v.vehicle.annual_mileage.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicle.annual_mileage.$error && !$v.vehicle.annual_mileage.required }"
                >This field is required!</div>
                <p v-show="manualApprove" class="alert-danger rounded-small mt-2 px-3 py-2">Manual approval required for mileage above 18,000</p>
              </b-form-group>

              <b-form-group label="Minimum Contract Total" class="has-top-label">
                <b-input-group>
                  <currency-field v-model="$v.vehicle.minimum_contract.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicle.minimum_contract.$error" />
                </b-input-group>
                <div v-if="!$v.vehicle.minimum_contract.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicle.minimum_contract.$error && !$v.vehicle.minimum_contract.required }"
                >This field is required!</div>
                <div v-if="!$v.vehicle.minimum_contract.maxValue"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicle.minimum_contract.$error && !$v.vehicle.minimum_contract.maxValue }"
                >Value must be greater than zero</div>
              </b-form-group>

              <b-form-group label="Initial Rental" class="has-top-label">
                <b-input-group>
                  <currency-field v-model="$v.vehicle.initial_rental.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicle.initial_rental.$error" />
                </b-input-group>
                <div v-if="!$v.vehicle.initial_rental.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicle.initial_rental.$error && !$v.vehicle.initial_rental.required }"
                >This field is required!</div>
                <div v-if="!$v.vehicle.initial_rental.maxValue"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicle.initial_rental.$error && !$v.vehicle.initial_rental.maxValue }"
                >Value must be greater than zero</div>
              </b-form-group>
              <b-button
                class="btn-lg btn-square w-100"
                :class="{
                  'btn-multiple-state': true,
                  'show-spinner': status === 'processing',
                  'show-success': status === 'success',
                  'show-fail': status === 'fail'
                }"
                variant="primary" type="submit" form="calculatorForm"
                :disabled="status != 'default' || this.$v.$anyError">
                <span class="spinner d-inline-block">
                  <span class="bounce1"></span>
                  <span class="bounce2"></span>
                  <span class="bounce3"></span>
                </span>
                <span class="icon success">
                  <i class="simple-icon-check"></i>
                </span>
                <span class="icon fail">
                  <i class="simple-icon-exclamation"></i>
                </span>
                <span v-if="buttonTitle" class="label">
                  {{ buttonTitle }}
                </span>
                <span v-else class="label">Calculate</span>
              </b-button>
            </b-form>

          </b-card>
      </b-colxx>
      <b-colxx xxs="12" lg="6">
        <b-card :title="$t('calculator.tab-2')" v-if="isCalculated === true">
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
          </ul>
          <b-form-group label="Monthly Rental (Confirmed)" class="has-top-label">
            <b-input-group>
              <currency-field v-model="$v.vehicle.monthly_rental.$model" :options="{ currency: 'GBP'}" />
            </b-input-group>
          </b-form-group>
          <hr>
          <div class="font-weight-bold">
            <span class="h4 mb-0 d-inline-block text-black">Dealer Code</span>
            <span ref="resultValue" class="float-right h4 mb-0">
              £ {{ dealerCode | withcoma }}
            </span>
          </div>
          <!-- <button class="btn btn-dark btn-square mt-3" @click="copyTextNoInput()">
            {{ copy_text }}<i class="iconsminds-duplicate-layer ml-2"></i>
          </button> -->
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
import {
  validationMixin
} from "vuelidate";
const {
  required
} = require("vuelidate/lib/validators");
const greaterThanZero = (value) => value > 0;

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
      buttonTitle: "",
      isProcessing: false,
      isCalculated: false,
      status: "default",
      copy_text: "Copy",
      vehicle: {
        type: "New/Pre Reg",
        contract_length: 12,
        annual_mileage: 10000,
        minimum_contract: 0,
        initial_rental: 0,
        monthly_rental: 0
      },
      result: {
        mmr: 0,
        tmr: 0,
        tmra: 0,
        dealerCode: 0
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
  mixins: [validationMixin],
  validations: {
    vehicle: {
      contract_length: { required },
      annual_mileage: { required },
      monthly_rental: { required },
      minimum_contract: {
        required,
        maxValue: greaterThanZero
      },
      initial_rental: {
        required,
        maxValue: greaterThanZero
      },
      monthly_rental: { required }
    },
  },
  methods: {
    onCalculateSubmit() {
      this.$v.vehicle.$touch();
      this.isProcessing = true;
      this.status = "processing";
      this.copy_text = "Copy"
      if(this.$v.vehicle.$invalid){
        setTimeout(() => {
          this.isProcessing = false;
          this.status = "default";
          this.buttonTitle = "Try again"
        }, 1000)
      } else {
        this.isCalculated = false;
        // this.getNumber();
        setTimeout(() => {
          this.isProcessing = false;
          this.isCalculated = true;
          this.status = "default";
          this.buttonTitle = "Calculate"
        }, 1000)
      }
    },
    getNumber() {
      if(this.vehicle.type == "Used") {
        this.millRate = 0.07
      } else {
        this.millRate = 0.125
      }
      this.result.mmr = this.mmr;
      this.result.tmr = this.tmr;
      this.result.tmra = this.tmra;
      this.result.dealerCode = this.dealerCode;
    },
    copyTextNoInput() {
      this.copy_text = "Copied"
      const storage = document.createElement('textarea');
      storage.value = this.$refs.resultValue.innerHTML;
      this.$el.appendChild(storage);
      storage.select();
      storage.setSelectionRange(0, 99999);
      document.execCommand('copy');
      this.$el.removeChild(storage);
      setTimeout(() => {
        this.copy_text = "Copy"
      }, 3000);
    }
  },
  computed: {
    mmr() {
      if(this.vehicle.type == "Used") {
        this.millRate = 0.07
      } else {
        this.millRate = 0.125
      }
      let res = 0
      if(this.vehicle.annual_mileage <= 10000){
        res = (this.vehicle.minimum_contract - this.vehicle.initial_rental) / this.vehicle.contract_length
      } else if(this.vehicle.annual_mileage > 10000) {
        let sliced = (this.vehicle.minimum_contract - this.vehicle.initial_rental)
        let temp = (this.vehicle.annual_mileage - 10000) * this.millRate
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
      return Math.round((this.mmr * 12) + this.vehicle.initial_rental)
    },
    ct() {
      let res = 0
      if(this.vehicle.monthly_rental > 0) {
        res = (this.vehicle.monthly_rental * 12) + this.vehicle.initial_rental
      }
      return Math.round(res)
    },
    dealerCode() {
      let res = this.initialDealerCode
      if(this.vehicle.monthly_rental > 0) {
        if(this.ct > this.mct) {
          res = 1800 + (this.ct - this.mct) * 0.5
        }
      }
      return Math.round(res)
    },
     manualApprove() {
      return this.vehicle.annual_mileage > 18000
    }
  }
}
</script>
