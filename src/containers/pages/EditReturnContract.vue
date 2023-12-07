<template>
  <b-modal
    id="modalEditReturn"
    ref="modalEditReturn"
    :title="$t('contract.edit-return')"
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
          v-model.trim="$v.id_sales_order.$model"
          disabled
          :state="!$v.id_sales_order.$error"
        />
        <b-form-invalid-feedback v-if="!$v.id_sales_order.required">Please enter agreement no</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('contract.vehicle-registration')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.id_purchase_order.$model"
          disabled
          :state="!$v.id_purchase_order.$error"
        />
        <b-form-invalid-feedback v-if="!$v.id_purchase_order.required">Please enter agreement no</b-form-invalid-feedback>
      </b-form-group>
      <div class="form-group has-top-label">
        <datepicker
          :bootstrap-styling="true"
          v-model="$v.vehicle_return_date.$model"
          :disabled-dates="availableDate"
        ></datepicker>
        <span>{{ $t('contract.return-date') }}</span>
        <div
          :class="{ 'invalid-feedback': true, 'd-block': $v.vehicle_return_date.$error && !$v.vehicle_return_date.required }"
        >Please select a date</div>
      </div>
    </b-form>
    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('modalEditReturn')">{{ $t('pages.cancel') }}</b-button>
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
import Datepicker from "vuejs-datepicker";
import {
  validationMixin
} from "vuelidate";
const {
  required
} = require("vuelidate/lib/validators");

export default {
  components: {
    "v-select": vSelect,
    "datepicker": Datepicker
  },
  props: ["selectedItem"],
  data() {
    return {
      buttonTitle: "",
      isProcessing: false,
      status: "default",
      message: "",
      optionData: [],
      direction: getDirection().direction,
      availableDate: {
        to: new Date()
      },
      editId: "",
      id_sales_order: "",
      id_purchase_order: "",
      vehicle_return_date: "",
      tempId: "",
      tempSalesOrder: "",
      tempPurchaseOrder: "",
      tempOrderNumber: ""
    };
  },
  mixins: [validationMixin],
  validations: {
    id_sales_order: { required },
    id_purchase_order: { required },
    vehicle_return_date: { required }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    getReturnData(obj) {
      this.$refs.modalEditReturn.show()
      this.editId = obj.id
      this.id_sales_order = obj.agreement_number
      this.id_purchase_order = obj.vehicle_registration
      this.tempId = obj.agreement_number
      this.tempSalesOrder = obj.id_sales_order
      this.tempPurchaseOrder = obj.id_purchase_order
      this.tempOrderNumber = obj.new_sales_order_no
      this.vehicle_return_date = obj.vehicle_return_date
      
      let url = apiUrl + "/purchaseorder/" + obj.id_purchase_order;
      axios
        .get(url)
        .then(r => r.data)
        .then(res => {
          this.availableDate.to = new Date(res.data.tgl_available)
        }).catch(_error => {
          console.log(_error)
        })
    },
    onAddContractSubmit() {
      let url = apiUrl + "/rehiringorder/" + this.editId;
      this.$v.$touch();
      let salesId = this.id_sales_order.id
      let orderId = this.id_purchase_order.id_purchase_order
      let orderNumber = this.id_sales_order.new_sales_order_no
      const soldContract = {
        id_sales_order: (salesId == undefined) ? this.tempSalesOrder : salesId,
        id_purchase_order: (orderId == undefined) ? this.tempPurchaseOrder : orderId,
        new_sales_order_no: (orderNumber == undefined) ? this.tempOrderNumber : orderNumber,
        vehicle_return_date: this.formatDate(this.vehicle_return_date)
      }
      // console.log("adding item : ", soldContract);
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
            this.hideModal('modalEditReturn');
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
  // computed: {
  //   itemId() {
  //     if(typeof this.id_sales_order === 'object') {
  //       return this.id_sales_order.agreement_number
  //     } else {
  //       return this.id_sales_order
  //     }
  //   },
  //   orderId() {
  //     if(typeof this.id_purchase_order === 'object') {
  //       return this.id_purchase_order.vehicle_registration
  //     } else {
  //       return this.id_purchase_order
  //     }
  //   }
  // }
};
</script>

