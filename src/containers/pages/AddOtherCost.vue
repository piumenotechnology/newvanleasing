<template>
  <b-modal
    id="modalothercost"
    ref="modalothercost"
    :title="$t('additional.add-cost')"
    modal-class="modal-right"
  >
    <div v-if="isProcessing" class="bg-transparent pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-75 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>
   
    <b-form
      id="addCostForm"
      class="av-tooltip tooltip-right-bottom"
      label="Bottom Right"
      @submit.prevent="onAddContractSubmit"
      >
      <div class="form-group has-top-label">
        <datepicker
          :bootstrap-styling="true"
          v-model="$v.date.$model"
        ></datepicker>
        <span>{{ $t('additional.date') }}</span>
        <div
          :class="{ 'invalid-feedback': true, 'd-block': $v.date.$error && !$v.date.required }"
        >Please select a date</div>
      </div>
      <b-form-group :label="$t('additional.vehicle')" class="has-top-label">
        <v-select
          label="id"
          v-model="$v.id_purchase_order.$model"
          :filterable="false"
          :options="optionCars"
          @search="fetchCars"
          :dir="direction"
        >
          <template slot="no-options">type to search Aggrement number..</template>
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
        <div v-if="!$v.id_purchase_order.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.id_purchase_order.$error && !$v.id_purchase_order.required }"
        >This field is required</div>
      </b-form-group>
      <b-form-group :label="$t('additional.cost-description')" class="has-top-label">
        <b-textarea v-model.trim="$v.description_expenses.$model" :state="!$v.description_expenses.$error"></b-textarea>
        <b-form-invalid-feedback v-if="!$v.description_expenses.required">Please enter description</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('additional.vendor')"  class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.vendor_name.$model"
          :state="!$v.vendor_name.$error"
        />
        <b-form-invalid-feedback v-if="!$v.vendor_name.required">Customer name is required!</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('additional.amount')" class="has-top-label">
        <b-input-group>
          <currency-field v-model="$v.amount_oc.$model" :options="{ currency: 'GBP'}" :state="!$v.amount_oc.$error" />
        </b-input-group>
        <div v-if="!$v.amount_oc.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.amount_oc.$error && !$v.amount_oc.required }"
        >This field is required!</div>
        <div v-if="!$v.amount_oc.maxValue"
          :class="{ 'invalid-feedback': true, 'd-block': $v.amount_oc.$error && !$v.amount_oc.maxValue }"
        >Value must be greater than zero</div>
      </b-form-group>
    </b-form>
    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('modalothercost')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :class="{
          'btn-multiple-state': true,
          'show-spinner': status === 'processing',
          'show-success': status === 'success',
          'show-fail': status === 'fail'
        }"
        variant="primary" type="submit" form="addCostForm"
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
import CurrencyField from "../../components/Common/CurrencyField";
import Datepicker from "vuejs-datepicker";
import {
  validationMixin
} from "vuelidate";
const {
  required,
  maxValue
} = require("vuelidate/lib/validators");
const greaterThanZero = (value) => value > 0;

export default {
  components: {
    "v-select": vSelect,
    "datepicker": Datepicker,
    "currency-field": CurrencyField
  },
  props: ["categories", "statuses"],
  data() {
    return {
      buttonTitle: "",
      isProcessing: false,
      status: "default",
      message: "",
      optionCars: [],
      addtionalCosts: [],
      direction: getDirection().direction,
      date: null,
      id_purchase_order: "",
      description_expenses: "",
      amount_oc: "",
      vendor_name: ""
    };
  },
  mixins: [validationMixin],
  validations: {
    date: { required },
    id_purchase_order: { required },
    description_expenses: { required },
    amount_oc: {
      required,
      maxValue: greaterThanZero
    },
    vendor_name: { required }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    objectToFormData(obj) {
      const formData = new FormData();

      Object.entries(obj).forEach(([key, value]) => {
        formData.append(key, value);
      });

      return formData;
    },
    fetchCars(search, loading) {
      let url = apiUrl + "/showvehiclenumberexceptsold?per_page=99&search=" + encodeURI(search);
      loading(true);
      setTimeout(() => {
        axios
          .get(url)
          .then(r => r.data)
          .then(res =>  {
            this.optionCars = res.data.data
          }).catch(_error => {
            console.log(_error)
          }).finally(() => {
            loading(false);
          })
      }, 1000);
    },
    onAddContractSubmit() {
      let url = apiUrl + "/othercost";
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.$v.$touch();
      const addedCost = {
        date: this.formatDate(this.date),
        id_purchase_order: this.id_purchase_order.id,
        description_expenses: this.description_expenses,
        amount_oc: this.amount_oc,
        vendor_name: this.vendor_name,
      }
      this.addtionalCosts = this.objectToFormData(addedCost);
      // console.log("adding item : ", addedCost);
      this.isProcessing = true;
      this.status = "processing";
      axios
        .post(url, this.addtionalCosts, config)
        .then(r => r.data)
        .then(res => {
          setTimeout(() => {
            this.isProcessing = false;
            this.message = "Your data was saved!";
            this.status = "success";
            this.hideModal('modalothercost');
          }, 1000)
        }).catch(_error => {
          this.isProcessing = false;
          this.status = "fail";
          this.message = "An error occured while saving the data. Please try again later.";
          setTimeout(() => {
            this.status = "default";
            this.buttonTitle = "Try again"
          }, 1500)
        })
    },
    hideModal(refname) {
      this.status = "default"
      this.$refs[refname].hide()
      setTimeout(() => {
        this.$emit('added-data-table')
      }, 1500)
    }
  }
};
</script>
