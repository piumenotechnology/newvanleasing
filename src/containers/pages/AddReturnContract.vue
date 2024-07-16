<template>
  <b-modal
    id="modalright"
    ref="modalright"
    :title="$t('contract.add-return')"
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
          v-model="$v.id_sales_order.$model"
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
        <div v-if="!$v.id_sales_order.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.id_sales_order.$error && !$v.id_sales_order.required }"
        >This field is required</div>
      </b-form-group>
      <!-- <b-form-group :label="$t('contract.vehicle-registration')" class="has-top-label">
        <v-select
          label="id"
          v-model="$v.id_purchase_order.$model"
          :filterable="false"
          :options="optionData"
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
        <div v-if="!$v.id_purchase_order.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.id_purchase_order.$error && !$v.id_purchase_order.required }"
        >This field is required</div>
      </b-form-group> -->
      <b-form-group :label="$t('contract.vehicle-registration')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.vehicle_registration.$model"
          disabled
          :state="!$v.vehicle_registration.$error"
        />
        <b-form-invalid-feedback v-if="!$v.vehicle_registration.required">Please enter agreement no</b-form-invalid-feedback>
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
  props: ["categories", "statuses"],
  data() {
    return {
      buttonTitle: "",
      isProcessing: false,
      status: "default",
      message: "",
      optionData: [],
      availableDate: {
        to: new Date()
      },
      direction: getDirection().direction,
      id_sales_order: null,
      id_purchase_order: null,
      vehicle_registration: "",
      vehicle_return_date: ""
    };
  },
  mixins: [validationMixin],
  validations: {
    id_sales_order: { required },
    vehicle_registration: { required },
    vehicle_return_date: { required }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    fetchOptions(search, loading) {
      let url = apiUrl + "/showagreementnumberinrehiring"
      loading(true);
      setTimeout(() => {
        axios
          .get(url)
          .then(r => r.data)
          .then(res =>  {
            // console.log(res.data)
            if(search) {
              this.optionData = res.data.filter((item)=>{
                return search.toLowerCase().split(' ').every(v => item.agreement_number.toLowerCase().includes(v))
              })
            } else {
              this.optionData = res.data
            }
          }).catch(_error => {
            console.log(_error)
          }).finally(() => {
            loading(false);
          })
      }, 1000);
    },
    onAddContractSubmit() {
      let url = apiUrl + "/rehiringorder";
      this.$v.$touch();
      const soldContract = {
        id_sales_order: this.id_sales_order.id,
        id_purchase_order: this.id_purchase_order,
        vehicle_return_date: this.formatDate(this.vehicle_return_date)
      }
      // console.log("adding item : ", soldContract);
      this.isProcessing = true;
      this.status = "processing";
      axios
        .post(url, soldContract)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "Your data was saved!";
          setTimeout(() => {
            this.hideModal('modalright');
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
    async getRegistration(obj) {
      // let url = apiUrl + "/showactivesales?per_page=99"
      let url = apiUrl + `/salesorder/${obj.id}`
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          // let item = res.data.data.filter(x => x.agreement_number == obj.agreement_number)
          let item = res.data
          this.vehicle_registration = item[0].vehicle_registration
          this.id_purchase_order = item[0].id_purchase_order
          this.availableDate = {
            to: new Date(item[0].contract_start_date)
          }
        }).catch(_error => {
          console.log(_error)
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
  watch: {
    id_sales_order(newId, oldId) {
      if (newId) {
        this.getRegistration(newId)
      }
    }
  }
};
</script>

