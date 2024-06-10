<template>
   <form-wizard :with-validate="true" :last-step-end="true" :top-nav-disabled="true">
      <tab :name="$t('vehicle.step-name-1')" :desc="$t('vehicle.step-desc-1')" :selected="true" :validate="validateStep1">
         <div class="wizard-basic-step">
            <b-form id="addVehicleForm"
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
                        <div v-if="!$v.vehicleForm.minContract10k.required"
                           :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.minContract10k.$error && !$v.vehicleForm.minContract10k.required }"
                        >This field is required!</div>
                     </b-form-group>
                  </b-colxx>
                  <b-colxx sm="6">
                     <b-form-group :label="$t('vehicle.18k-desc')" class="has-top-label">
                        <currency-field v-model="$v.vehicleForm.minContract18k.$model" :options="{ currency: 'GBP'}" :state="!$v.vehicleForm.minContract18k.$error" />
                        <div v-if="!$v.vehicleForm.minContract18k.required"
                           :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.minContract18k.$error && !$v.vehicleForm.minContract18k.required }"
                        >This field is required!</div>
                     </b-form-group>
                  </b-colxx>
               </b-form-row>
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
                        <money v-model="$v.vehicleForm.serviceMiles.$model" v-bind="locale" class="form-control" :state="!$v.vehicleForm.serviceMiles.$error"></money>
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
               <b-form-group :label="$t('vehicle.service-intervals')" class="has-top-label d-none">
                  <money v-model="$v.vehicleForm.serviceMaintenance.$model" v-bind="locale" class="form-control" :state="!$v.vehicleForm.serviceMaintenance.$error"></money>
                  <div v-if="!$v.vehicleForm.serviceMaintenance.numeric"
                     :class="{ 'invalid-feedback': true, 'd-block': $v.vehicleForm.serviceMaintenance.$error && !$v.vehicleForm.serviceMaintenance.numeric }"
                  >Must be a number</div>
               </b-form-group>
               <b-form-row>
                  <b-colxx sm="12">
                     <p class="mb-3">{{ $t('vehicle.service-last') }}</p>
                  </b-colxx>
                  <b-colxx sm="12">
                     <b-form-group :label="$t('vehicle.service-mileage')" class="has-top-label">
                        <money v-model="$v.vehicleForm.serviceMileage.$model" v-bind="locale" class="form-control" :state="!$v.vehicleForm.serviceMileage.$error"></money>
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
         </div>
      </tab>
      <tab :name="$t('vehicle.step-name-2')" :desc="$t('vehicle.step-desc-2')" :validate="validateStep2" :submit="submitForm">
         <div class="wizard-basic-step">
            <b-form class="av-tooltip tooltip-right-bottom" label="Bottom Right">
               <b-form-group :label="$t('vehicle.purchase-date')" class="has-float-label">
                  <datepicker :inline="true" :bootstrap-styling="true"
                     placeholder="Choose a date"
                     class="embeded"
                     v-model="$v.purchaseForm.purchaseDate.$model"
                  ></datepicker>
                  <div
                     :class="{ 'invalid-feedback': true, 'd-block': $v.purchaseForm.purchaseDate.$error && !$v.purchaseForm.purchaseDate.required }"
                  >Date required</div>
               </b-form-group>
               <b-form-group :label="$t('vehicle.residual-value')" class="has-top-label">
                  <b-input-group>
                     <currency-field v-model="$v.purchaseForm.residualValue.$model" :options="{ currency: 'GBP'}" :state="!$v.purchaseForm.residualValue.$error" />
                  </b-input-group>
                  <div v-if="!$v.purchaseForm.residualValue.required"
                  :class="{ 'invalid-feedback': true, 'd-block': $v.purchaseForm.residualValue.$error && !$v.purchaseForm.residualValue.required }"
                  >This field is required!</div>
               </b-form-group>
               <b-form-group :label="$t('vehicle.funding-methods')" class="has-top-label">
                  <v-select v-model="$v.purchaseForm.fundingMethods.$model" :options="fundingMethodData" />
                  <div
                     :class="{ 'invalid-feedback': true, 'd-block': $v.purchaseForm.fundingMethods.$error && !$v.purchaseForm.fundingMethods.required }"
                  >Method is required!</div>
               </b-form-group>
               <Transition name="fade" mode="out-in">
                  <type-data v-model="methodsData" ref="childComp" :methodsType="component"></type-data>
               </Transition>
            </b-form>
         </div>
      </tab>
      <tab type="done">
         <div class="wizard-basic-step text-center pt-3">
            <div v-if="isProcessing">
               <b-spinner variant="primary" label="Spinning" class="mb-1"></b-spinner>
               <!-- <p>{{$t('wizard.async')}}</p> -->
               <p>{{message}}</p>
            </div>
            <div v-else>
               <h2 class="mb-2">{{status}}</h2>
               <p>{{message}}</p>
            </div>
         </div>
      </tab>
   </form-wizard>
</template>

<script>
import axios from 'axios';
import { apiUrl } from "../../constants/config";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import { Money } from 'v-money';
import CurrencyField from "../../components/Common/CurrencyField";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import FormWizard from "../../components/Form/Wizard/FormWizard";
import Tab from "../../components/Form/Wizard/Tab";
import TypeData from "./vehicle/TypeData";

import { validationMixin } from "vuelidate";
const {
   required,
   numeric,
   decimal,
   minLength
} = require("vuelidate/lib/validators");

export default {
   components: {
      "v-select": vSelect,
      "datepicker": Datepicker,
      "form-wizard": FormWizard,
      "tab": Tab,
      "type-data": TypeData,
      "money": Money,
      "currency-field": CurrencyField
   },
   provide() {
      return {
         $v: this.$v,
      }
   },
   data() {
      return {
         status: "",
         message: "",
         isProcessing: true,
         interestCollection: [],
         activeInterest: [],
         vehicleForm: {
            vehicleRegistration: "",
            manufacture: "",
            model: "",
            variant: "",
            colour: "",
            listPrice: 0,
            otrPrice: 0,
            minContract10k: 0,
            minContract18k: 0,
            serviceMaintenance: 0,
            motDate: null,
            rflDate: null,
            serviceMiles: 0,
            serviceYears: 0,
            serviceMileage: 0,
            serviceLast: null,
            stock_status: null
         },
         purchaseForm: {
            purchaseDate: null,
            fundingMethods: null,
            residualValue: 0
         },
         methodsData: {
            funder: "",
            interestType: null,
            interestRate: 0,
            terms: "",
            deposit: 0,
            monthlyRepay: 0,
            finalPay: 0,
            docFee: 0,
            finalFee: 0,
            otherFee: 0
         },
         fundingMethodData: [
            { label: "Hire Purchase", value: "hire" },
            { label: "Cash", value: "cash" },
            { label: "Rent/Return", value: "rent" }
         ],
         locale: {
            decimal: '.',
            thousands: ',',
            suffix: ' miles',
            precision: 0,
            masked: false
         },
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
         serviceLast: {},
         stock_status: {}
      },
      purchaseForm: {
         purchaseDate: { required },
         fundingMethods: { required },
         residualValue: { required }
      },
      methodsData: {
         funder: {},
         interestType: {},
         interestRate: {},
         terms: { numeric },
         deposit: { decimal },
         monthlyRepay: { decimal },
         finalPay: { decimal },
         docFee: { decimal },
         finalFee: { decimal },
         otherFee: { decimal }
      }
   },
   methods: {
      validateStep1() {
         this.$v.vehicleForm.$touch();
         return !this.$v.vehicleForm.$anyError;
      },
      validateStep2() {
         this.$v.purchaseForm.$touch();
         // this.$refs.childComp.validateForm();
         this.$refs.childComp.$v.$touch();
         return !this.$v.purchaseForm.$anyError && !this.$refs.childComp.$v.methodsData.$anyError;
         // let methodType = this.component;
         // if (methodType === "hire") {
         //    return !this.$v.purchaseForm.$anyError && !this.$refs.childComp.$v.hire.$anyError;
         // } else if (methodType === "cash") {
         //    return !this.$v.purchaseForm.$anyError && !this.$refs.childComp.$v.cash.$anyError;
         // } else if (methodType === "rent") {
         //    return !this.$v.purchaseForm.$anyError && !this.$refs.childComp.$v.rent.$anyError;
         // }
         this.submitForm();
      },
      formatDate(date) {
         let newDate = new Date(date);
         return moment(newDate).format("Y-MM-DD");
      },
      uppercase() {
        this.vehicleForm.vehicleRegistration = this.vehicleForm.vehicleRegistration.toUpperCase();
      },
      getActiveInterest() {
         let url = `${apiUrl}/findbaseinterest`;
         axios
            .get(url)
            .then(r => r.data)
            .then(res => {
               this.activeInterest = res.data.pop()
            })
      },
      async addInterest(pid) {
         let date1 = new Date(this.purchaseForm.purchaseDate).getTime();
         let date2 = new Date(this.activeInterest.start_date).getTime();
         let url = `${apiUrl}/baseinterestdetail`;
         this.message = "Calculating Bank interest..";
         const interests = this.interestCollection;
         const responses = [];
         if(date1 > date2) {
            await axios.post(url, {
               id_base_interest : this.activeInterest.id,
               id_purchase_order : pid
            })
         } else {
            for (let i = 0; i < interests.length; i++) {
               responses.push(await axios.post(url, {
                  id_base_interest : interests[i].id,
                  id_purchase_order : pid
               }));
            }
         }
         // if(interests.length === 0) {
         //    return
         // }
      },
      async getInterest(newDate) {
         let startDate = this.formatDate(this.purchaseForm.purchaseDate)
         let url = `${apiUrl}/showbaseinterest/${startDate},${newDate}`;
         if(startDate === null && newDate === null) {
            return
         }
         axios
            .get(url)
            .then(r => r.data)
            .then(res => {
               this.interestCollection = res.data
            })
            .catch(error => {
               this.interestCollection = []
            })
      },
      async createVehicle() {
         const form = {
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
            stock_status: this.vehicleForm.stock_status,
            last_service_date: this.formatDate(this.vehicleForm.serviceLast),
            hire_purchase_starting_date: this.formatDate(this.purchaseForm.purchaseDate),
            purchase_method: this.purchaseForm.fundingMethods.label,
            residual_value: this.purchaseForm.residualValue,
            hp_finance_provider: this.methodsData.funder,
            hp_interest_type: (this.methodsData.interestType !== null) ? this.methodsData.interestType : null,
            hp_interest_per_annum: this.methodsData.interestRate,
            hp_term: this.methodsData.terms,
            hp_deposit_amount: this.methodsData.deposit,
            monthly_payment: this.methodsData.monthlyRepay,
            final_payment: this.methodsData.finalPay,
            documentation_fees_pu: this.methodsData.docFee,
            final_fees: this.methodsData.finalFee,
            other_fees: this.methodsData.otherFee
         };
         let url = apiUrl + "/purchaseorder";
         this.message = "Creating Vehicle..";
         // const data = {
         //    id: 281,
         //    purchase_method: 'Hire Purchase'
         // }
         const data = axios
            .post(url, form)
            .then(r => r.data)
            .then(res => {
               return res.data
            }).catch(_error => {
               // this.addNotification(this.status, this.status, this.message);
            });
         return data
      },
      async submitForm() {
         this.status = "processing";
         const vehicle = await this.createVehicle()
         if(vehicle) {
            if(vehicle.purchase_method === 'Hire Purchase') {
               await this.addInterest(vehicle.id)
            }
            this.isProcessing = false;
            this.status = "Great";
            this.message = "Your vehicle was added";
            setTimeout(() => {
               this.isProcessing = false;
               this.$emit('add-modal-hide');
            }, 2000)
         } else {
            this.isProcessing = false;
            this.status = "Oops!";
            this.message = "An error occured while saving the data. Please try again later.";
         }
      },
      addNotification(type, title , message) {
         this.$notify(type, title, message, { duration: 1000, permanent: false });
      }
   },
   watch: {
      endDate(newdate) {
         if(newdate) {
            this.getInterest(newdate)
         }
      },
   },
   computed: {
      component() {
         if (this.purchaseForm.fundingMethods !== null) {
            return this.purchaseForm.fundingMethods.value;
         }
      },
      endDate() {
         let startDate = new Date(this.purchaseForm.purchaseDate);
         let terms = Number(this.methodsData.terms);
         if (this.component === 'hire' && terms > 0) {
            return this.formatDate(startDate.setMonth(startDate.getMonth() + terms));
         }
      }
   },
   mounted() {
      this.getActiveInterest()
   }
};
</script>
