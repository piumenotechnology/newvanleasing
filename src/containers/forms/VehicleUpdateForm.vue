<template>
  <b-row class="app-row">
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('vehicle.step-name-1')">
        <b-form id="updateVehicleForm"
          class="av-tooltip tooltip-right-bottom"
          label="Bottom Right"
          >
          <b-form-group :label="$t('vehicle.registration')" class="has-top-label">
            <b-form-input
            v-model.trim="$v.vehicleForm.vehicleRegistration.$model"
            :state="!$v.vehicleForm.vehicleRegistration.$error"
            :placeholder="'i.e GF23 WSN'"
            @keyup="uppercase" />
            <div v-if="!$v.vehicleForm.vehicleRegistration.required"
              :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.vehicleRegistration.$error && !$v.vehicleForm.vehicleRegistration.required }"
            >This field is required!</div>
          </b-form-group>
          <b-form-group :label="$t('vehicle.manufacture')" class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="$v.vehicleForm.manufacture.$model"
              :state="!$v.vehicleForm.manufacture.$error"
            />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.manufacture.required">Vehicle manufacture required!</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group :label="$t('vehicle.model')" class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="$v.vehicleForm.model.$model"
              :state="!$v.vehicleForm.model.$error"
            />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.model.required">Model is required!</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group :label="$t('vehicle.variant')" class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="$v.vehicleForm.variant.$model"
              :state="!$v.vehicleForm.variant.$error"
            />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.variant.required">Variant is required!</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group :label="$t('vehicle.colour')"  class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="$v.vehicleForm.colour.$model"
              :state="!$v.vehicleForm.colour.$error"
            />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.colour.required">Colour is required!</b-form-invalid-feedback>
          </b-form-group>
          <b-form-row>
            <b-colxx sm="6">
              <b-form-group :label="$t('vehicle.list-price')" class="has-top-label">
                <currency-field v-model="$v.vehicleForm.listPrice.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.listPrice.$error" />
                <div
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.listPrice.$error && !$v.vehicleForm.listPrice.required }"
                >This field is required!</div>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('vehicle.otr-price')" class="has-top-label">
                <currency-field v-model="$v.vehicleForm.otrPrice.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.otrPrice.$error" />
                <div
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.otrPrice.$error && !$v.vehicleForm.otrPrice.required }"
                >This field is required!</div>
              </b-form-group>
            </b-colxx>
          </b-form-row>
          <p class="mb-3">{{ $t('vehicle.min-contract-price') }}</p>
          <b-form-row>
            <b-colxx sm="6">
              <b-form-group :label="$t('vehicle.10k-desc')" class="has-top-label">
                <currency-field v-model="$v.vehicleForm.minContract10k.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.minContract10k.$error" />
                <div :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.minContract10k.$error && !$v.vehicleForm.minContract10k.required }"
                >This field is required!</div>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('vehicle.18k-desc')" class="has-top-label">
                <currency-field v-model="$v.vehicleForm.minContract18k.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.minContract18k.$error" />
                <div :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.minContract18k.$error && !$v.vehicleForm.minContract18k.required }"
                >This field is required!</div>
              </b-form-group>
            </b-colxx>
          </b-form-row>
          <b-form-group :label="$t('vehicle.service-intervals')" class="has-top-label">
            <money v-model="$v.vehicleForm.serviceMaintenance.$model" v-bind="distance" class="form-control" :state="!$v.vehicleForm.serviceMaintenance.$error"></money>
            <div v-if="!$v.vehicleForm.serviceMaintenance.numeric"
                :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.serviceMaintenance.$error && !$v.vehicleForm.serviceMaintenance.numeric }"
            >Must be a number</div>
          </b-form-group>
          <p class="mb-3">{{ $t('vehicle.due-date') }}</p>
          <div class="form-group has-top-label">
            <datepicker
              :bootstrap-styling="true"
              placeholder="Choose a date"
              v-model="$v.vehicleForm.motDate.$model"
            ></datepicker>
            <span>{{ $t('vehicle.mot-date') }}</span>
          </div>
          <div class="form-group has-top-label">
            <datepicker
              :bootstrap-styling="true"
              placeholder="Choose a date"
              v-model="$v.vehicleForm.rflDate.$model"
            ></datepicker>
            <span>{{ $t('vehicle.rfl-date') }}</span>
          </div>
          <b-form-row>
            <b-colxx sm="12">
              <p class="mb-3">{{ $t('vehicle.service-schedule') }}</p>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('vehicle.service-miles')" class="has-top-label">
                <money v-model="$v.vehicleForm.serviceMiles.$model" v-bind="distance" class="form-control" :state="!$v.vehicleForm.serviceMiles.$error"></money>
                <div v-if="!$v.vehicleForm.serviceMiles.numeric"
                    :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.serviceMiles.$error && !$v.vehicleForm.serviceMiles.numeric }"
                >Must be a number</div>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="6">
              <b-form-group :label="$t('vehicle.service-years')" class="has-top-label">
                <b-form-input
                  type="text"
                  v-model.trim="$v.vehicleForm.serviceYears.$model"
                  :state="!$v.vehicleForm.serviceYears.$error"
                />
                <div v-if="!$v.vehicleForm.serviceYears.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.serviceYears.$error && !$v.vehicleForm.serviceYears.required }"
                >This field is required!</div>
                <div v-if="!$v.vehicleForm.serviceYears.numeric"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.serviceYears.$error && !$v.vehicleForm.serviceYears.numeric }"
                >Must be a number</div>
              </b-form-group>
            </b-colxx>
          </b-form-row> 
          <b-form-row>
            <b-colxx sm="12">
              <p class="mb-3">{{ $t('vehicle.service-last') }}</p>
            </b-colxx>
            <b-colxx sm="12">
              <b-form-group :label="$t('vehicle.service-mileage')" class="has-top-label">
                <money v-model="$v.vehicleForm.serviceMileage.$model" v-bind="distance" class="form-control" :state="!$v.vehicleForm.serviceMileage.$error"></money>
                <div v-if="!$v.vehicleForm.serviceMileage.numeric"
                    :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.serviceMileage.$error && !$v.vehicleForm.serviceMileage.numeric }"
                >Must be a number</div>
              </b-form-group>
            </b-colxx>
            <b-colxx sm="12">
              <div class="form-group has-top-label">
                <datepicker
                  :bootstrap-styling="true"
                  placeholder="Choose a date"
                  v-model="$v.vehicleForm.serviceLast.$model"
                ></datepicker>
                <span>{{ $t('vehicle.service-date') }}</span>
                <div
                  :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.serviceLast.$error && !$v.vehicleForm.serviceLast.required }"
                >Date required</div>
              </div>
            </b-colxx>
          </b-form-row>
        </b-form>
      </b-card>
      <b-card class="mb-4" :title="$t('vehicle.step-name-2')">
        <b-form id="addvehicleForm"
        class="av-tooltip tooltip-right-bottom"
        label="Bottom Right"
        >
          <b-form-group :label="$t('vehicle.purchase-date')">
            <datepicker :inline="true" :bootstrap-styling="true"
              placeholder="Choose a date"
              class="embeded"
              v-model="$v.vehicleForm.purchaseDate.$model"
            ></datepicker>
            <div :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.purchaseDate.$error && !$v.vehicleForm.purchaseDate.required }"
            >Date required</div>
          </b-form-group>
          <b-form-group :label="$t('vehicle.residual-value')" class="has-top-label">
            <b-input-group>
              <currency-field v-model="$v.vehicleForm.residualValue.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.residualValue.$error" />
            </b-input-group>
            <div v-if="!$v.vehicleForm.residualValue.required"
              :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.residualValue.$error && !$v.vehicleForm.residualValue.required }"
            >This field is required!</div>
          </b-form-group>
          <b-form-group :label="$t('vehicle.funding-methods')" class="has-top-label">
            <v-select v-model="$v.vehicleForm.fundingMethods.$model" :options="fundingMethodData" />
            <div :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.fundingMethods.$error && !$v.vehicleForm.fundingMethods.required }"
            >Method is required!</div>
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase' || methodsType === 'Rent/Return'"
          :label="$t('vehicle.funder')"
          class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="$v.vehicleForm.funder.$model"
            />
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase'"
          :label="$t('vehicle.interest-type')" class="has-top-label">
            <v-select v-model.trim="$v.vehicleForm.interestType.$model" :options="selectData" />
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase'"
          :label="$t('vehicle.interest-rate')"  class="has-top-label">
            <money v-model="$v.vehicleForm.interestRate.$model" v-bind="percent" class="form-control"></money>
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase' || methodsType === 'Rent/Return'"
          :label="$t('vehicle.terms')"  class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="$v.vehicleForm.terms.$model"
              :state="!$v.vehicleForm.terms.$error"
            />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.terms.numeric">Must be a number</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase'"
          :label="$t('vehicle.deposit')" class="has-top-label">
            <currency-field v-model="$v.vehicleForm.deposit.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.deposit.$error" />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.deposit.numeric">Must be a number</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase' || methodsType === 'Rent/Return'"
          :label="$t('vehicle.monthly-repayment')" class="has-top-label">
            <currency-field v-model="$v.vehicleForm.monthlyRepay.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.monthlyRepay.$error" />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.monthlyRepay.numeric">Must be a number</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase' || methodsType === 'Cash'"
          :label="$t('vehicle.final-payment')" class="has-top-label">
            <currency-field v-model="$v.vehicleForm.finalPay.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.finalPay.$error" />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.finalPay.numeric">Must be a number</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase' || methodsType === 'Cash'"
          :label="$t('vehicle.documentation-fee')" class="has-top-label">
            <currency-field v-model="$v.vehicleForm.docFee.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.docFee.$error" />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.docFee.numeric">Must be a number</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase' || methodsType === 'Cash'"
          :label="$t('vehicle.final-fee')" class="has-top-label">
            <currency-field v-model="$v.vehicleForm.finalFee.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.finalFee.$error" />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.finalFee.numeric">Must be a number</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group v-show="methodsType === 'Hire Purchase' || methodsType === 'Cash'"
          :label="$t('vehicle.other-fee')" class="has-top-label">
            <currency-field v-model="$v.vehicleForm.otherFee.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.otherFee.$error" />
            <b-form-invalid-feedback v-if="!$v.vehicleForm.otherFee.numeric">Must be a number</b-form-invalid-feedback>
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
import { Money } from 'v-money';
import CurrencyField from "../../components/Common/CurrencyField"
import Datepicker from "vuejs-datepicker";
import {
  validationMixin
} from "vuelidate";
const {
  required,
  numeric,
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
  props: ["items"],
  data() {
    return {
      status:"",
      message: "",
      vehicleForm: {
        vehicleRegistration: this.items.vehicle_registration,
        manufacture: this.items.vehicle_manufactur,
        model: this.items.vehicle_model,
        variant: this.items.vehicle_variant,
        colour: this.items.colour,
        listPrice: this.items.basic_list_price,
        otrPrice: this.items.price_otr,
        minContract10k: this.items.min_contract_price_satu,
        minContract18k: this.items.min_contract_price_dua,
        serviceMaintenance: this.items.service_maintenance,
        motDate: this.items.mot_due_date,
        rflDate: this.items.rfl_due_date,
        serviceMiles: this.items.service_schedule_miles,
        serviceYears: this.items.service_schedule_years,
        serviceMileage: this.items.last_service_mileage,
        serviceLast: this.items.last_service_date,
        purchaseDate: this.items.hire_purchase_starting_date,
        residualValue: this.items.residual_value,
        fundingMethods: this.items.purchase_method,
        funder: this.items.hp_finance_provider,
        interestType: this.items.hp_interest_type,
        interestRate: this.items.hp_interest_per_annum,
        terms: this.items.hp_term,
        deposit: this.items.hp_deposit_amount,
        monthlyRepay: this.items.monthly_payment,
        finalPay: this.items.final_payment,
        docFee: this.items.documentation_fees_pu,
        finalFee: this.items.final_fees,
        otherFee: this.items.other_fees,
        stockStatus: this.items.stock_status
      },
      fundingMethodData: [
        { label: "Hire Purchase", value: "hire" },
        { label: "Cash", value: "cash" },
        { label: "Rent/Return", value: "rent" }
      ],
      selectData: [
        "Variable",
        "Non HP",
        "Fixed"
      ],
      distance: {
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
    vehicleForm: {
      vehicleRegistration: { required },
      manufacture: { required },
      model: { required },
      variant: { required },
      colour: { required },
      listPrice: { required },
      otrPrice: { required },
      minContract10k: { required },
      minContract18k: { required },
      serviceMaintenance: { numeric },
      rflDate: {},
      motDate: {},
      serviceMiles: { numeric },
      serviceYears: { numeric },
      serviceMileage: { numeric },
      serviceLast: { },
      purchaseDate: { required },
      residualValue: { required },
      fundingMethods: { required },
      funder: { },
      interestType: { },
      interestRate: { },
      terms: { numeric },
      deposit: { },
      monthlyRepay: { },
      finalPay: { },
      docFee: { },
      finalFee: { },
      otherFee: { },
      stockStatus: { }
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    uppercase() {
      this.vehicleForm.vehicleRegistration = this.vehicleForm.vehicleRegistration.toUpperCase();
    },
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 2000, permanent: false });
    },
    onValitadeFormSubmit() {
      this.$v.$touch();
      
      if (this.methodsType === "Cash") {
        this.vehicleForm.funder = null;
        this.vehicleForm.interestType = null;
        this.vehicleForm.interestRate = "";
        this.vehicleForm.terms = null;
      } else if(this.methodsType === "Rent/Return") {
        this.vehicleForm.interestType = null;
        this.vehicleForm.interestRate = "";
        this.vehicleForm.deposit = "";
        // this.vehicleForm.monthlyRepay = "";
        this.vehicleForm.finalPay = "";
        this.vehicleForm.docFee = "";
        this.vehicleForm.finalFee = "";
        this.vehicleForm.otherFee = "";
      }
      const newData = {
        vehicle_registration: this.vehicleForm.vehicleRegistration,
        vehicle_manufactur: this.vehicleForm.manufacture,
        vehicle_model: this.vehicleForm.model,
        vehicle_variant: this.vehicleForm.variant,
        colour: this.vehicleForm.colour,
        basic_list_price: this.vehicleForm.listPrice,
        price_otr: this.vehicleForm.otrPrice,
        min_contract_price_satu: this.vehicleForm.minContract10k, min_contract_price_dua: this.vehicleForm.minContract18k,
        service_maintenance: this.vehicleForm.serviceMaintenance,
        rfl_due_date: this.formatDate(this.vehicleForm.rflDate),
        mot_due_date: this.formatDate(this.vehicleForm.motDate),
        service_schedule_miles: this.vehicleForm.serviceMiles,
        service_schedule_years: this.vehicleForm.serviceYears,
        last_service_mileage: this.vehicleForm.serviceMileage,
        last_service_date: this.formatDate(this.vehicleForm.serviceLast),
        hire_purchase_starting_date: this.formatDate(this.vehicleForm.purchaseDate),
        residual_value: this.vehicleForm.residualValue,
        purchase_method: this.methodsType,
        hp_finance_provider: this.vehicleForm.funder,
        hp_interest_type: (this.vehicleForm.interestType !== null) ? this.vehicleForm.interestType : null,
        hp_interest_per_annum: this.vehicleForm.interestRate,
        hp_term: (this.vehicleForm.terms)? this.vehicleForm.terms : null,
        hp_deposit_amount: this.vehicleForm.deposit,
        monthly_payment: this.vehicleForm.monthlyRepay,
        final_payment: this.vehicleForm.finalPay,
        documentation_fees_pu: this.vehicleForm.docFee,
        final_fees: this.vehicleForm.finalFee,
        other_fees: this.vehicleForm.otherFee,
        stock_status: this.vehicleForm.stockStatus
      };
      let url = apiUrl + "/purchaseorder/" + this.items.id;
      this.$emit('update-vehicle', 'processing');

      if (!this.$v.$invalid) {
        axios
          .put(url, newData)
          .then(r => r.data)
          .then(res => {
            this.status = "success filled";
            this.message = "Your data was saved!";
            setTimeout(() => {
              this.$emit('update-vehicle', 'success');
              // this.addNotification(this.status, "Yay!", this.message);
              // console.log("form submitting : ", newData);
              // this.$emit('add-modal-hide');
            }, 1500)
          }).catch(_error => {
            this.status = "error filled";
            this.message = "An error occured while saving the data. Please try again later.";
            this.addNotification(this.status, "Oppss!", this.message);
          })
      } else {
        setTimeout(() => {
          this.$emit('update-vehicle', 'fail');
        }, 1500)
      }
    }
  },
  computed: {
    methodsType() {
      let type = JSON.parse(JSON.stringify(this.vehicleForm.fundingMethods))
      if(this.vehicleForm.fundingMethods === this.items.purchase_method) {
        return this.items.purchase_method;
      } else {
        return type.label;
      }
    }
  }
};
</script>
