<template>
  <b-modal
    id="modalrehire"
    ref="modalrehire"
    :title="$t('contract.view-rehire')"
    hide-footer
    modal-class="modal-right"
  >
    <div v-if="isProcessing" class="bg-transparent pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-75 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>

    <template slot="modal-header" class="justify-content-start">
      <b-button @click="hideModal('modalrehire')" variant="light" size="lg" class="icon-button"><i class="simple-icon-arrow-left" /></b-button>
    </template>
   
    <b-form
      id="addRehireForm"
      class="av-tooltip tooltip-right-bottom"
      label="Bottom Right"
      >
      <b-form-group :label="$t('contract.agreement-number')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="hireagreementNumber"
          disabled
        />
      </b-form-group>
      
      <b-form-group :label="$t('contract.vehicle-registration')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="hirevehicleRegistration"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('contract.customer-name')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="hirecustomerName"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('contract.type')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="hirecontractType"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('contract.period')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="hirecontractPeriod"
          disabled
        />
      </b-form-group>
      <b-form-group :label="$t('contract.start-date')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="hirestartDate"
          disabled
        />
      </b-form-group>
      <b-form-row>
        <b-colxx sm="6">
          <b-form-group :label="$t('contract.mileage')" class="has-top-label">
            <b-input-group>
              <money v-model="hireannualMileage" v-bind="distance" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('contract.doc-fee')" class="has-top-label">
            <b-input-group>
              <money v-model="hiredocFee" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
      </b-form-row>
      <b-form-row>
        <b-colxx sm="6">
          <b-form-group :label="$t('contract.initial-rental')" class="has-top-label">
            <b-input-group>
              <money v-model="hireinitialRental" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('contract.monthly-rental')" class="has-top-label">
            <b-input-group>
              <money v-model="hiremonthlyRental" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
      </b-form-row>
      <b-form-row>
        <b-colxx sm="6">
          <b-form-group :label="$t('contract.delivery-charge')" class="has-top-label">
            <b-input-group>
              <money v-model="hireotherIncome" v-bind="money" class="form-control" disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
        <b-colxx sm="6">
          <b-form-group :label="$t('contract.residual-value')" class="has-top-label">
            <b-input-group>
              <money v-model="hireresidualValue" v-bind="money" class="form-control"  disabled></money>
            </b-input-group>
          </b-form-group>
        </b-colxx>
      </b-form-row>
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
      hirevehicleRegistration: null,
      hirecustomerName: "",
      hireagreementNumber: "",
      hirecontractType: null,
      hirecontractPeriod: "",
      hirestartDate: null,
      hireannualMileage: "",
      hiredocFee: "",
      hireinitialRental: "",
      hiremonthlyRental: "",
      hireotherIncome: "",
      hireresidualValue: "",
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
      }
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    fetchData(id) {
      let url = apiUrl + "/salesorder/" + id;
      this.$refs.modalrehire.show()
      axios
        .get(url)
        .then(r => r.data)
        .then(res =>  {
          // console.log(res.data[0])
          this.isProcessing = false
          let items = res.data[0]
          this.hireagreementNumber = items.agreement_number
          this.hirevehicleRegistration = items.vehicle_registration
          this.hirecustomerName = items.cust_name
          this.hirecontractType = items.type
          this.hirecontractPeriod = items.term_months
          this.hirestartDate = items.contract_start_date
          this.hireannualMileage = items.annual_mileage
          this.hiredocFee = items.documentation_fees
          this.hireinitialRental = items.initial_rental
          this.hiremonthlyRental = items.monthly_rental
          this.hireotherIncome = items.other_income
          this.hireresidualValue = items.residual_value
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

