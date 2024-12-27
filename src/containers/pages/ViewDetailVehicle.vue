<template>
  <b-modal
    id="modalvehicle"
    ref="modalvehicle"
    :title="$t('contract.view-rehire')"
    hide-footer
    size="lg"
  >
    <div v-if="isProcessing" class="bg-transparent pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-75 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>

    <template slot="modal-header" class="justify-content-start">
      <b-button @click="hideModal('modalvehicle')" variant="light" size="lg" class="icon-button"><i class="simple-icon-arrow-left" /></b-button>
    </template>

    <b-form
      id="addRehireForm"
      class="av-tooltip tooltip-right-bottom"
      label="Bottom Right"
      >
      <b-form-group :label="$t('vehicle.registration')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="vehicleRegistration"
          disabled
        />
      </b-form-group>

      <b-form-group :label="$t('vehicle.manufacture')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="manufacture"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.model')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="model"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.variant')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="variant"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.colour')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="colour"
          disabled
        />
      </b-form-group>
      <b-form-row>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.list-price')" class="has-top-label">
            <b-input-group>
              <money v-model="listPrice" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.otr-price')" class="has-top-label">
            <b-input-group>
              <money v-model="otrPrice" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.10k-desc')" class="has-top-label">
            <b-input-group>
              <money v-model="minContract10k" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.18k-desc')" class="has-top-label">
            <b-input-group>
              <money v-model="minContract18k" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
      </b-form-row>
      <b-form-group :label="$t('vehicle.service-intervals')" class="has-top-label">
        <b-input-group>
          <money v-model="serviceMaintenance" v-bind="distance" class="form-control" disabled></money>
        </b-input-group>
      </b-form-group>
      <b-form-row>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.mot-date')" class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="motDate"
              disabled
            />
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.rfl-date')" class="has-top-label">
            <b-form-input
              type="text"
              v-model.trim="rflDate"
              disabled
            />
          </b-form-group>
        </b-colxx>
      </b-form-row>
      <b-form-group :label="$t('vehicle.service-miles')" class="has-top-label">
        <b-input-group>
          <money v-model="serviceMiles" v-bind="distance" class="form-control" disabled></money>
        </b-input-group>
      </b-form-group>
      <b-form-group :label="$t('vehicle.service-years')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="serviceYears"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.service-mileage')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="serviceMileage"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.service-date')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="serviceLast"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.purchase-date')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="purchaseDate"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.residual-value')" class="has-top-label">
        <b-input-group>
          <money v-model="residualValue" v-bind="money" class="form-control" disabled></money>
        </b-input-group>
      </b-form-group>
      <b-form-group :label="$t('vehicle.funding-methods')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="fundingMethods"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.funder')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="funder"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.interest-type')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="interestType"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('vehicle.interest-rate')" class="has-top-label">
        <b-input-group>
          <money v-model="interestRate" v-bind="percent" class="form-control" disabled></money>
        </b-input-group>
      </b-form-group>
      <b-form-group :label="$t('vehicle.terms')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="terms"
          disabled
        />
      </b-form-group>
      <b-form-row>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.deposit')" class="has-top-label">
            <b-input-group>
              <money v-model="deposit" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.monthly-repayment')" class="has-top-label">
            <b-input-group>
              <money v-model="monthlyRepay" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.final-payment')" class="has-top-label">
            <b-input-group>
              <money v-model="finalPay" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.documentation-fee')" class="has-top-label">
            <b-input-group>
              <money v-model="docFee" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.final-fee')" class="has-top-label">
            <b-input-group>
              <money v-model="finalFee" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('vehicle.other-fee')" class="has-top-label">
            <b-input-group>
              <money v-model="otherFee" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
      </b-form-row>
      <b-form-group :label="$t('vehicle.stock-status')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="stockStatus"
          disabled
        />
      </b-form-group>
    </b-form>
    <template slot="modal-footer"> </template>
  </b-modal>
</template>

<script>
import axios from 'axios'
import { apiUrl } from "../../constants/config";
import { Money } from 'v-money';

export default {
  components: {
    "money": Money
  },
  data() {
    return {
      isProcessing: true,
      vehicleRegistration: "",
      manufacture: "",
      model: "",
      variant: "",
      colour: "",
      listPrice: "",
      otrPrice: "",
      minContract10k: "",
      minContract18k: "",
      serviceMaintenance: "",
      motDate: "",
      rflDate: "",
      serviceMiles: "",
      serviceYears: "",
      serviceMileage: "",
      serviceLast: "",
      purchaseDate: "",
      residualValue: "",
      fundingMethods: null,
      funder: "N/A",
      interestType: "N/A",
      interestRate: "N/A",
      terms: "N/A",
      deposit: "",
      monthlyRepay: "",
      finalPay: "",
      docFee: "",
      finalFee: "",
      otherFee: "",
      stockStatus: "Unknown",
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '£ ',
        precision: 2,
        masked: false
      },
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
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    fetchData(id) {
      let url = apiUrl + "/purchaseorder/" + id;
      this.$refs.modalvehicle.show()
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          // console.log(res.data[0])
          this.isProcessing = false
          let items = res.data
          this.vehicleRegistration = items.vehicle_registration
          this.manufacture = items.vehicle_manufactur
          this.model = items.vehicle_model
          this.variant = items.vehicle_variant
          this.colour = items.colour
          this.listPrice = items.basic_list_price
          this.otrPrice = items.price_otr
          this.minContract10k = items.min_contract_price_satu
          this.minContract18k = items.min_contract_price_dua
          this.serviceMaintenance = items.service_maintenance
          this.motDate = items.mot_due_date
          this.rflDate = items.rfl_due_date
          this.serviceMiles = items.service_schedule_miles
          this.serviceYears = items.service_schedule_years
          this.serviceMileage = items.last_service_mileage
          this.serviceLast = items.last_service_date
          this.purchaseDate = items.hire_purchase_starting_date
          this.residualValue = items.residual_value
          this.fundingMethods = items.purchase_method
          this.funder = (items.hp_finance_provider) ? items.hp_finance_provider : this.funder
          this.interestType = (items.hp_interest_type) ? items.hp_interest_type : this.interestType
          this.interestRate = (items.hp_interest_per_annum) ? items.hp_interest_per_annum : this.interestRate
          this.terms = (items.hp_term) ? items.hp_term : this.terms
          this.deposit = items.hp_deposit_amount
          this.monthlyRepay = items.monthly_payment
          this.finalPay = items.final_payment
          this.docFee = items.documentation_fees_pu
          this.finalFee = items.final_fees
          this.otherFee = items.other_fees
          this.stockStatus = (items.stock_status) ? items.stock_status : this.stockStatus
        }).catch(_error => {
          console.log(_error)
        })
    },
    hideModal(refname) {
      this.$refs[refname].hide()
    }
  }
};
</script>

