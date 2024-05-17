<template>
  <b-row class="app-row">
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('vehicle.step-name-1')">
        <b-form
          id="addContractForm"
          class="av-tooltip tooltip-right-bottom"
          label="Bottom Right"
          @submit.prevent="onValitadeFormSubmit"
          >
          <b-form-group :label="$t('contract.vehicle-registration')" class="has-top-label">
            <v-select
              label="id"
              v-model="$v.contractForm.vehicleRegistration.$model"
              :state="!$v.contractForm.vehicleRegistration.$error"
              :filterable="false"
              :options="dynamicDataOptions"
              @search="fetchOptions"
              :dir="direction"
            >
              <template slot="no-options">type to search Vehicle registration..</template>
              <template slot="option" slot-scope="option">
                <div class="d-center">
                  {{ option.vehicle_registration }}
                </div>
              </template>
              <template slot="selected-option" slot-scope="option">
                <div class="selected d-center">
                  <!-- {{ items.vehicle_registration }} -->
                  {{ registration }}
                </div>
              </template>
              <template slot="spinner" slot-scope="spinner">
                <div class="spinner-border text-primary" v-show="spinner"></div>
              </template>
            </v-select>
            <div v-if="!$v.contractForm.vehicleRegistration.required"
              :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.vehicleRegistration.$error && !$v.contractForm.vehicleRegistration.required }"
            >This field is required</div>
            <!-- <b-form-invalid-feedback v-if="!$v.contractForm.vehicleRegistration.required">Please select a vehicle</b-form-invalid-feedback> -->
          </b-form-group>
          <b-form-group :label="$t('contract.customer-name')" class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="$v.contractForm.customerName.$model"
              :state="!$v.contractForm.customerName.$error"
            />
            <b-form-invalid-feedback v-if="!$v.contractForm.customerName.required">Please enter a customer name</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group :label="$t('contract.type')" class="has-top-label">
            <v-select v-model="$v.contractForm.contractType.$model" :options="selectData"
            :dir="direction" />
            <div :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.contractType.$error && !$v.contractForm.contractType.required }"
            >Please select at least one type</div>
          </b-form-group>
          <b-form-group :label="$t('contract.agreement')" class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="$v.contractForm.agreementNumber.$model"
              v-mask="'####'"
              :state="!$v.contractForm.agreementNumber.$error"
            />
            <b-form-invalid-feedback v-if="!$v.contractForm.agreementNumber.required">Please enter agreement no</b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.contractForm.agreementNumber.numeric">Must be a number</b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.contractForm.agreementNumber.minLength">Minimum 4 characters</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group :label="$t('contract.period')" class="has-top-label">
            <b-form-input
            v-model.trim="$v.contractForm.contractPeriod.$model"
            :state="!$v.contractForm.contractPeriod.$error" />
            <b-form-invalid-feedback v-if="!$v.contractForm.contractPeriod.required">Contract period is required!</b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.contractForm.contractPeriod.numeric">Must be number!</b-form-invalid-feedback>
          </b-form-group>
          <div class="form-group has-top-label">
            <datepicker
              :bootstrap-styling="true"
              v-model="$v.contractForm.startDate.$model"
              :disabled-dates="availableDate"
            ></datepicker>
            <span>{{ $t('contract.start-date') }}</span>
            <div
              :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.startDate.$error && !$v.contractForm.startDate.required }"
            >Please select a date</div>
          </div>
          <b-form-row>
            <b-colxx sm="6">
              <b-form-group :label="$t('contract.mileage')" class="has-top-label">
                <b-input-group>
                  <money v-model="$v.contractForm.annualMileage.$model" v-bind="miles" class="form-control" :state="!$v.contractForm.annualMileage.$error"></money>
                  <!-- <b-form-input
                    type="text"
                    v-model.trim="$v.contractForm.annualMileage.$model"
                    :state="!$v.contractForm.annualMileage.$error"
                  /> -->
                </b-input-group>
                <div v-if="!$v.contractForm.annualMileage.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.annualMileage.$error && !$v.contractForm.annualMileage.required }"
                >This field is required!</div>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('contract.doc-fee')" class="has-top-label">
                <b-input-group>
                  <currency-field v-model="$v.contractForm.docFee.$model" :options="{ currency: 'GBP'}" :state="!$v.contractForm.docFee.$error" />
                </b-input-group>
                <div v-if="!$v.contractForm.docFee.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.docFee.$error && !$v.contractForm.docFee.required }"
                >This field is required!</div>
              </b-form-group>
            </b-colxx>
          </b-form-row>
          <b-form-row>
            <b-colxx sm="4">
              <b-form-group :label="$t('contract.initial-rental')" class="has-top-label">
                <b-input-group>
                  <currency-field v-model="$v.contractForm.initialRental.$model" :options="{ currency: 'GBP'}" :state="!$v.contractForm.initialRental.$error" />
                </b-input-group>
                <div v-if="!$v.contractForm.initialRental.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.initialRental.$error && !$v.contractForm.initialRental.required }"
                >This field is required!</div>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="4">
              <b-form-group :label="$t('contract.monthly-rental')" class="has-top-label">
                <b-input-group>
                  <currency-field v-model="$v.contractForm.monthlyRental.$model" :options="{ currency: 'GBP'}" :state="!$v.contractForm.monthlyRental.$error" />
                </b-input-group>
                <div v-if="!$v.contractForm.monthlyRental.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.monthlyRental.$error && !$v.contractForm.monthlyRental.required }"
                >This field is required!</div>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="4">
              <b-form-group :label="$t('contract.delivery-charge')" class="has-top-label">
                <b-input-group>
                  <currency-field v-model="$v.contractForm.otherIncome.$model" :options="{ currency: 'GBP'}" :state="!$v.contractForm.otherIncome.$error" />
                </b-input-group>
                <div v-if="!$v.contractForm.otherIncome.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.otherIncome.$error && !$v.contractForm.otherIncome.required }"
                >This field is required!</div>
              </b-form-group>
            </b-colxx>
          </b-form-row>
          <b-form-group :label="$t('contract.residual-value')" class="has-top-label">
            <b-input-group>
              <currency-field v-model="$v.contractForm.residualValue.$model" :options="{ currency: 'GBP'}" :state="!$v.contractForm.residualValue.$error" />
            </b-input-group>
            <div v-if="!$v.contractForm.residualValue.required"
              :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.residualValue.$error && !$v.contractForm.residualValue.required }"
            >This field is required!</div>
          </b-form-group>
        </b-form>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import axios from 'axios'
import { apiUrl } from "../../constants/config";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { getDirection } from "../../utils";
import { Money } from 'v-money';
import Datepicker from "vuejs-datepicker";
import CurrencyField from '../../components/Common/CurrencyField';
import {
  validationMixin
} from "vuelidate";
const {
  required,
  numeric,
  minLength,
  helpers
} = require("vuelidate/lib/validators");
const upperCase = helpers.regex("upperCase", /^[A-Z]*$/);

export default {
  components: {
    "v-select": vSelect,
    "datepicker": Datepicker,
    "money": Money,
    "currency-field": CurrencyField
  },
  props: ["items", "minDate"],
  data() {
    return {
      direction: getDirection().direction,
      dynamicDataOptions: [],
      contractForm: {
        vehicleRegistration: this.items.id_purchase_order,
        customerName: this.items.cust_name,
        agreementNumber: this.items.agreement_number,
        contractType: this.items.type,
        contractPeriod: this.items.term_months,
        startDate: this.items.contract_start_date,
        annualMileage: this.items.annual_mileage,
        docFee: this.items.documentation_fees,
        initialRental: this.items.initial_rental,
        monthlyRental: this.items.monthly_rental,
        otherIncome: this.items.other_income,
        residualValue: 0
      },
      selectData: [
        "Contract Hire (Unregulated)",
        "Hire (Unregulated)"
      ],
      miles: {
        decimal: '.',
        thousands: ',',
        suffix: ' miles',
        precision: 0,
        masked: false
      },
      percent: {
        decimal: '.',
        thousands: ',',
        suffix: ' %',
        precision: 2,
        masked: false
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    contractForm: {
      vehicleRegistration: { required },
      customerName: { required },
      agreementNumber: {
        required,
        numeric,
        minLength: minLength(4)
      },
      contractType: { required },
      contractPeriod: { required, numeric },
      startDate: { required },
      annualMileage: { required, numeric },
      docFee: { required },
      initialRental: { required },
      monthlyRental: { required },
      otherIncome: { required },
      residualValue: { required }
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 2000, permanent: false });
    },
    fetchOptions(search, loading) {
      let url = apiUrl + "/purchaseorderall?search=" + encodeURI(search);
      loading(true);
      setTimeout(() => {
        axios
          .get(url)
          .then(r => r.data)
          .then(res => {
            let allowed = res.data.data.filter(function (el) {
              return el.status_next_step == "Available"
            });
            this.dynamicDataOptions = allowed
            console.log(this.dynamicDataOptions)
          }).catch(_error => {
            console.log(_error)
          }).finally(() => {
            loading(false);
          })
      }, 1000);
    },
    getResidual(id) {
      let url = apiUrl + "/purchaseorder/" + id;
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          // console.log(res.data)
          this.contractForm.residualValue = res.data.residual_value
        }).catch(_error => {
          console.log(_error)
        })
    }, 
    onValitadeFormSubmit() {
      this.$v.contractForm.$touch();
      let purchaseId = this.contractForm.vehicleRegistration.id
      const newContract = {
        id_purchase_order: (purchaseId == undefined) ? this.contractForm.vehicleRegistration : purchaseId,
        cust_name: this.contractForm.customerName,
        agreement_number: this.contractForm.agreementNumber,
        type: this.contractForm.contractType,
        term_months: this.contractForm.contractPeriod,
        contract_start_date: this.formatDate(this.contractForm.startDate),
        annual_mileage: this.contractForm.annualMileage,
        documentation_fees: this.contractForm.docFee,
        initial_rental: this.contractForm.initialRental,
        monthly_rental: this.contractForm.monthlyRental,
        other_income: this.contractForm.otherIncome,
        residual_value: this.contractForm.residualValue
      }
      // console.log(newContract)
      let url = apiUrl + "/salesorder/" + this.items.id;
      this.$emit('update-contract', 'processing');
      if (!this.$v.contractForm.$invalid) {
        axios
          .put(url, newContract)
          .then(r => r.data)
          .then(res => {
            setTimeout(() => {
              this.$emit('update-contract', 'success');
            }, 1500)
          }).catch(_error => {
            let message = "The agreement number has already been taken, please use different number";
            // this.addNotification("error filled", "Oppss!", message);
            console.log(_error)
          })
      } else {
        setTimeout(() => {
          this.$emit('update-contract', 'fail');
        }, 1500)
      }
    }
  },
  computed: {
    registration() {
      if(typeof this.contractForm.vehicleRegistration === 'object') {
        return this.contractForm.vehicleRegistration.vehicle_registration
      } else {
        return this.items.vehicle_registration
      }
    },
    registrationPreData() {
      return this.contractForm.vehicleRegistration
    },
    availableDate() {
      return (this.minDate !== null) ? {
        to: new Date(this.minDate )
      } : {
        to: new Date()
      }
    }
  },
  mounted() {
    this.getResidual(this.items.id_purchase_order)
  },
  watch: {
    registrationPreData(newId, oldId) {
      if (newId) {
        this.contractForm.residualValue = newId.residual_value
      }
    }
  }
};
</script>
