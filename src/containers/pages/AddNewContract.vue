<template>
  <b-modal
    id="modalright"
    ref="modalright"
    :title="$t('contract.add-new')"
    modal-class="modal-right"
  >
    <div v-if="isProcessing" class="bg-transparent pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-75 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>
   
    <b-form
      id="addContractForm"
      class="av-tooltip tooltip-right-bottom"
      label="Bottom Right"
      @submit.prevent="onAddContractSubmit"
      >
      <b-form-group :label="$t('contract.vehicle-registration')" class="has-top-label">
        <v-select
          label="id"
          v-model="$v.contractForm.vehicleRegistration.$model"
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
              {{ option.vehicle_registration }}
            </div>
          </template>
          <template slot="spinner" slot-scope="spinner">
            <div class="spinner-border text-primary" v-show="spinner"></div>
          </template>
        </v-select>
        <div v-if="!$v.contractForm.vehicleRegistration.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.vehicleRegistration.$error && !$v.contractForm.vehicleRegistration.required }"
        >This field is required</div>
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
        <b-colxx sm="6">
          <b-form-group :label="$t('contract.initial-rental')" class="has-top-label">
            <b-input-group>
              <currency-field v-model="$v.contractForm.initialRental.$model" :options="{ currency: 'GBP'}" :state="!$v.contractForm.initialRental.$error" />
            </b-input-group>
            <div v-if="!$v.contractForm.initialRental.required"
              :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.initialRental.$error && !$v.contractForm.initialRental.required }"
            >This field is required!</div>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('contract.monthly-rental')" class="has-top-label">
            <b-input-group>
              <currency-field v-model="$v.contractForm.monthlyRental.$model" :options="{ currency: 'GBP'}" :state="!$v.contractForm.monthlyRental.$error" />
            </b-input-group>
            <div v-if="!$v.contractForm.monthlyRental.required"
              :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.monthlyRental.$error && !$v.contractForm.monthlyRental.required }"
            >This field is required!</div>
          </b-form-group>
        </b-colxx>
      </b-form-row>
      <b-form-group :label="$t('contract.delivery-charge')" class="has-top-label">
        <b-input-group>
          <currency-field v-model="$v.contractForm.otherIncome.$model" :options="{ currency: 'GBP'}" :state="!$v.contractForm.otherIncome.$error" />
        </b-input-group>
        <div v-if="!$v.contractForm.otherIncome.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.contractForm.otherIncome.$error && !$v.contractForm.otherIncome.required }"
        >This field is required!</div>
      </b-form-group>
    </b-form>

    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('modalright')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :class="{
          'btn-multiple-state': true,
          'show-spinner': status === 'processing',
          'show-success': status === 'success',
          'show-fail': status === 'fail'
        }"
        variant="primary" type="submit" form="addContractForm"
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
        <span v-else class="label">
          {{ $t('pages.submit') }}
        </span>
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import axios from 'axios'
import { apiUrl } from "../../constants/config";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { getDirection } from "../../utils";
import { Money } from 'v-money';
import CurrencyField from "../../components/Common/CurrencyField";
import Datepicker from "vuejs-datepicker";
import {
  validationMixin
} from "vuelidate";
const {
  required,
  numeric,
  minLength,
  helpers
} = require("vuelidate/lib/validators");

export default {
  components: {
    "v-select": vSelect,
    "datepicker": Datepicker,
    "money": Money,
    "currency-field": CurrencyField
  },
  props: ["categories", "statuses"],
  data() {
    return {
      buttonTitle: "",
      isProcessing: false,
      status: "default",
      message: "",
      salesorders: [],
      dynamicDataOptions: [],
      contractForm: {
        vehicleRegistration: null,
        customerName: null,
        agreementNumber: null,
        contractType: null,
        contractPeriod: null,
        startDate: null,
        annualMileage: 0,
        docFee: 0,
        initialRental: 0,
        monthlyRental: 0,
        otherIncome: 0,
      },
      direction: getDirection().direction,
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
      otherIncome: { required }
    }
  },
  methods: {
    formatDate(date) {
      // let newDate = new Date(date);
      // return moment(newDate).format("Y-MM-DD");
      return new Date(date).toISOString().substr(0, 10)
    },
    objectToFormData(obj) {
      const formData = new FormData();

      Object.entries(obj).forEach(([key, value]) => {
        formData.append(key, value);
      });

      return formData;
    },
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 2000, permanent: false });
    },
    fetchOptions(search, loading) {
      let url = apiUrl + "/purchaseorderall?&search=" + encodeURI(search);
      loading(true);
      setTimeout(() => {
        axios
          .get(url)
          .then(r => r.data)
          .then(res =>  {
            let allowed = res.data.data.filter(function (el) {
              return el.status_next_step === "Available"
            });
            this.dynamicDataOptions = allowed
          }).catch(_error => {
            console.log(_error)
          }).finally(() => {
            loading(false);
          })
      }, 1000);
    },
    onAddContractSubmit() {
      let url = apiUrl + "/salesorder";
      this.$v.$touch();
      const newContract = {
        id_purchase_order: (this.contractForm.vehicleRegistration) ? this.contractForm.vehicleRegistration.id : null,
        cust_name: this.contractForm.customerName,
        agreement_number: this.contractForm.agreementNumber,
        type: this.contractForm.contractType,
        term_months: this.contractForm.contractPeriod,
        contract_start_date: this.formatDate(this.contractForm.startDate),
        annual_mileage: this.contractForm.annualMileage,
        documentation_fees: this.contractForm.docFee,
        initial_rental: this.contractForm.initialRental,
        monthly_rental: this.contractForm.monthlyRental,
        other_income: this.contractForm.otherIncome
      }
      // console.log("adding item : ", newContract);
      this.salesorders = this.objectToFormData(newContract);
      this.isProcessing = true;
      this.status = "processing";
      axios
        .post(url, this.salesorders)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "Your data was saved!";
          setTimeout(() => {
            this.hideModal('modalright');
          }, 1000)
        }).catch(_error => {
          this.status = "fail";
          this.message = "The agreement number has already been taken, please use different number";
          this.addNotification("error filled", "Oppss!", this.message);
          setTimeout(() => {
            this.isProcessing = false;
            this.status = "default";
            this.buttonTitle = "Try again"
          }, 1000)
        })
    },
    hideModal(refname) {
      this.status = "default"
      this.$refs[refname].hide()
      setTimeout(() => {
        this.$emit('added-data-table')
      }, 1000)
    }
  },
  computed: {
    availableDate() {
      return (this.contractForm.vehicleRegistration) ? {
        to: new Date(this.contractForm.vehicleRegistration.tgl_available)
      } : {
        to: new Date()
      }
    }
  }
};
</script>

