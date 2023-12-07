<template>
  <b-modal
    id="modalEditSold"
    ref="modalEditSold"
    :title="$t('contract.edit-sold')"
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
        <b-form-input
          type="text"
          v-model.trim="$v.form.id_sales_order.$model"
          disabled
          :state="!$v.form.id_sales_order.$error"
        />
        <b-form-invalid-feedback v-if="!$v.form.id_sales_order.required">Please enter agreement no</b-form-invalid-feedback>
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
      <b-button variant="outline-secondary" @click="hideModal('modalEditSold')">{{ $t('pages.cancel') }}</b-button>
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
import CurrencyField from "../../components/Common/CurrencyField";
import Datepicker from "vuejs-datepicker";
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
    "datepicker": Datepicker,
    "currency-field": CurrencyField
  },
  props: ["selectedItem"],
  data() {
    return {
      buttonTitle: "",
      isProcessing: false,
      status: "default",
      message: "",
      optionData: [],
      optionCars: [],
      vehiclesolds: [],
      direction: getDirection().direction,
      availableDate: {
        to: new Date()
      },
      new_id_sales_order: "",
      new_id_purchase_order: "",
      form: {
        id_sales_order: "",
        id_purchase_order: "",
        vehicle_return_date: "",
        sold_price: ""
      },
      editId: ""
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
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    // fetchOptions(search, loading) {
    //   let url = apiUrl + "/rehiringorder?per_page=99&search=" + encodeURI(search);
    //   loading(true);
    //   setTimeout(() => {
    //     axios
    //       .get(url)
    //       .then(r => r.data)
    //       .then(res =>  {
    //         this.optionData = res.data.data
    //       }).catch(_error => {
    //         console.log(_error)
    //       }).finally(() => {
    //         loading(false);
    //       })
    //   }, 1000);
    // },
    // fetchCars(search, loading) {
    //   let url = apiUrl + "/showvehiclenumberexceptsold?per_page=99&search=" + encodeURI(search);
    //   loading(true);
    //   setTimeout(() => {
    //     axios
    //       .get(url)
    //       .then(r => r.data)
    //       .then(res =>  {
    //         this.optionCars = res.data.data
    //       }).catch(_error => {
    //         console.log(_error)
    //       }).finally(() => {
    //         loading(false);
    //       })
    //   }, 1000);
    // },
    getReturnData(obj) {
      let url = apiUrl + "/vehiclesold/" + obj.id;
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          this.editId = res.data.id
          this.form.vehicle_sold_date = res.data.vehicle_sold_date
          this.form.sold_price = res.data.sold_price
          this.getMaskData(res.data.id_sales_order)
        }).catch(_error => {
          console.log(_error)
        })
      this.new_id_sales_order = obj.id_sales_order
      this.new_id_purchase_order = obj.id_purchase_order
      this.$refs.modalEditSold.show()
    },
    async getMaskData(id) {
      let url = apiUrl + "/salesorder/" + id
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          console.log(res.data[0])
          this.form.id_sales_order = res.data[0].agreement_number
          this.form.id_purchase_order = res.data[0].vehicle_registration
          this.availableDate.to = new Date(res.data[0].contract_start_date)
        })
    },
    onAddContractSubmit() {
      let url = apiUrl + "/vehiclesold/" + this.editId;
      const soldContract = {
        id_sales_order: this.new_id_sales_order,
        id_purchase_order: this.new_id_purchase_order,
        vehicle_sold_date: this.formatDate(this.form.vehicle_sold_date),
        sold_price: this.form.sold_price
      }
      // console.log(soldContract);
      this.$v.form.$touch();
      this.isProcessing = true;
      this.status = "processing";
      axios
        .put(url, soldContract)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "Your data was saved!";
          setTimeout(() => {
            this.hideModal('modalEditSold');
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
  },
  computed: {
    itemReturn() {
      if(typeof this.form.id_sales_order === 'object') {
        return this.form.id_sales_order.agreement_number
      } else {
        return this.form.id_sales_order
      }
    },
    itemSold() {
      if(typeof this.form.id_purchase_order === 'object') {
        return this.form.id_purchase_order.vehicle_registration
      } else {
        return this.form.id_purchase_order
      }
    }
  }
};
</script>

