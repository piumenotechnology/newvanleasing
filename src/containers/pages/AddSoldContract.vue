<template>
  <b-modal
    id="modalsold"
    ref="modalsold"
    :title="$t('contract.add-sold')"
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
      <b-form-group :label="$t('contract.agreement-number')" class="has-top-label">
        <v-select
          label="id"
          v-model="$v.form.id_sales_order.$model"
          :filterable="false"
          :options="optionData"
          @search="fetchOptions"
          :dir="direction"
        >
          <template slot="no-options">type to search Aggrement number..</template>
          <template slot="option" slot-scope="option">
            <div class="d-center">
              {{ option.agreement_number }}
            </div>
          </template>
          <template slot="selected-option" slot-scope="option">
            <div class="selected d-center">
              {{ option.agreement_number }}
            </div>
          </template>
          <template slot="spinner" slot-scope="spinner">
            <div class="spinner-border text-primary" v-show="spinner"></div>
          </template>
        </v-select>
        <div v-if="!$v.form.id_sales_order.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.id_sales_order.$error && !$v.form.id_sales_order.required }"
        >This field is required</div>
      </b-form-group>
      <b-form-group :label="$t('contract.vehicle-registration')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.form.id_purchase_order.$model"
          disabled
          :state="!$v.form.id_purchase_order.$error"
        />
        <b-form-invalid-feedback v-if="!$v.form.id_purchase_order.required">Please enter agreement no</b-form-invalid-feedback>
      </b-form-group>
      <!-- <b-form-group :label="$t('contract.vehicle-registration')" class="has-top-label">
        <v-select
          label="id"
          v-model="$v.form.id_purchase_order.$model"
          :filterable="false"
          :options="optionCars"
          @search="fetchCars"
          :dir="direction"
        >
          <template slot="no-options">type to search Vehicale registration number..</template>
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
        <div v-if="!$v.form.id_purchase_order.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.id_purchase_order.$error && !$v.form.id_purchase_order.required }"
        >This field is required</div>
      </b-form-group> -->
      <div class="form-group has-top-label">
        <datepicker
          :bootstrap-styling="true"
          v-model="$v.form.vehicle_sold_date.$model"
          :disabled-dates="availableDate"
        ></datepicker>
        <span>{{ $t('contract.sold-date') }}</span>
        <div
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.vehicle_sold_date.$error && !$v.form.vehicle_sold_date.required }"
        >Please select a date</div>
      </div>
      <b-form-group :label="$t('contract.sold-price')" class="has-top-label">
        <b-input-group>
          <currency-field v-model="$v.form.sold_price.$model" :options="{ currency: 'GBP'}" :state="!$v.form.sold_price.$error" />
        </b-input-group>
        <div v-if="!$v.form.sold_price.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.sold_price.$error && !$v.form.sold_price.required }"
        >This field is required!</div>
        <div v-if="!$v.form.sold_price.maxValue"
          :class="{ 'invalid-feedback': true, 'd-block': $v.form.sold_price.$error && !$v.form.sold_price.maxValue }"
        >Value must be greater than zero</div>
      </b-form-group>
    </b-form>
    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('modalsold')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :class="{
          'btn-multiple-state': true,
          'show-spinner': status === 'processing',
          'show-success': status === 'success',
          'show-fail': status === 'fail'
        }"
        variant="primary" type="submit" form="addContractForm"
        :disabled="status != 'default' || this.$v.form.$anyError">
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
      optionData: [],
      optionCars: [],
      vehiclesolds: [],
      newSalesIdOrder: "",
      newPurchaseIdOrder: "",
      direction: getDirection().direction,
      availableDate: {
        to: new Date()
      },
      form: {
        id_sales_order: null,
        id_purchase_order: null,
        vehicle_sold_date: null,
        sold_price: 0
      }
    };
  },
  mixins: [validationMixin],
  validations: {
    form: {
      id_sales_order: { required },
      id_purchase_order: { required },
      vehicle_sold_date: { required },
      sold_price: {
        required,
        maxValue: greaterThanZero
      }
    }
  },
  computed: {
    dataAgreement() {
      return this.form.id_sales_order
    }
  },
  watch: {
    dataAgreement(newVal, oldVal) {
      this.form.id_purchase_order = newVal.vehicle_registration
      this.getSalesId(newVal.agreement_number)
    },
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
    fetchOptions(search, loading) {
      let url = apiUrl + "/showagreementnumberinvehiclesold?per_page=15&search=" + encodeURI(search);
      loading(true);
      setTimeout(() => {
        axios
          .get(url)
          .then(r => r.data)
          .then(res =>  {
            let latestContract = res.data.filter(x =>
              x.id == Math.max(...res.data.map(o => o.id))
            )
            this.optionData = res.data
            // this.getSalesId(latestContract[0].agreement_number)
          }).catch(_error => {
            console.log(_error)
          }).finally(() => {
            loading(false);
          })
      }, 1000);
    },
    async getSalesId(val) {
      let url = apiUrl + "/salesorder?per_page=250"
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          let salesId = res.data.data.filter(x => x.agreement_number == val)
          this.newSalesIdOrder = salesId[0].id
          this.newPurchaseIdOrder = salesId[0].id_purchase_order
          this.getMinDate(salesId[0].id_purchase_order)
        })
    },
    async getMinDate(id) {
      let url = apiUrl + "/purchaseorder/" + id
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.availableDate.to = new Date(res.data.tgl_available)
        })
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
      let url = apiUrl + "/vehiclesold";
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // this.$v.form.$touch();
      // this.vehiclesolds.append("id_sales_order", this.form.id_sales_order.id);
      // this.vehiclesolds.append("id_purchase_order", this.form.id_purchase_order.id);
      // this.vehiclesolds.append("vehicle_sold_date", this.formatDate(this.form.vehicle_sold_date));
      // this.vehiclesolds.append("sold_price", this.form.sold_price);
      const soldContract = {
        id_sales_order: this.newSalesIdOrder,
        id_purchase_order: this.newPurchaseIdOrder,
        vehicle_sold_date: this.formatDate(this.form.vehicle_sold_date),
        sold_price: this.form.sold_price
      }
      this.vehiclesolds = this.objectToFormData(soldContract);
      // console.log("adding item : ", soldContract);
      this.isProcessing = true;
      this.status = "processing";
      axios
        .post(url, this.vehiclesolds, config)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "Your data was saved!";
          setTimeout(() => {
            this.hideModal('modalsold');
          }, 1500)
        }).catch(_error => {
          this.status = "fail";
          this.message = "An error occured while saving the data. Please try again later.";
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
      }, 1500)
    }
  }
};
</script>
