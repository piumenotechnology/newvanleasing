<template>
  <b-modal
    id="editinterest"
    ref="editinterest"
    :title="$t('interest.add-interest')"
    modal-class="modal-right"
  >
    <div v-if="isProcessing" class="bg-transparent pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-75 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>
    <b-form
      id="editInterestForm"
      class="av-tooltip tooltip-right-bottom"
      label="Bottom Right"
      @submit.prevent="onSubmit"
      >
      <div class="form-group has-top-label">
        <datepicker
          :bootstrap-styling="true"
          v-model="$v.start_date.$model"
          :disabled-dates="availableDate"
        ></datepicker>
        <span>{{ $t('interest.start-date') }}</span>
        <div
          :class="{ 'invalid-feedback': true, 'd-block': $v.start_date.$error && !$v.start_date.required }"
        >Please select a date</div>
      </div>
      <b-form-group :label="$t('interest.value')" class="has-top-label">
        <money
          type="text"
          v-model.trim="$v.percentage.$model"
          v-bind="locale"
          class="form-control"
          :state="!$v.percentage.$error"
        />
        <div v-if="!$v.percentage.required"
          :class="{ 'invalid-feedback': true, 'd-block': $v.percentage.$error && !$v.percentage.required }"
        >Please enter base interest value.</div>
        <div v-else-if="!$v.percentage.maxValue"
          :class="{ 'invalid-feedback': true, 'd-block': $v.percentage.$error && !$v.percentage.maxValue }"
        >Value must be greater than zero.</div>
      </b-form-group>
    </b-form>
    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('editinterest')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :class="{
          'btn-multiple-state': true,
          'show-spinner': status === 'processing',
          'show-success': status === 'success',
          'show-fail': status === 'fail'
        }"
        variant="primary" type="submit" form="editInterestForm"
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
import Datepicker from "vuejs-datepicker";
import { Money } from 'v-money';
import {
  validationMixin
} from "vuelidate";
const {
  required,
  maxValue,
} = require("vuelidate/lib/validators");
const greaterThanZero = (value) => value > 0;

export default {
  props: ['interest'],
  components: {
    "datepicker": Datepicker,
    "money": Money
  },
  data() {
    return {
      isProcessing: false,
      status: "default",
      buttonTitle: "",
      message: "",
      start_date: this.interest.start_date,
      percentage: this.interest.percentage,
      locale: {
        decimal: '.',
        thousands: ',',
        suffix: ' %',
        precision: 1,
        masked: false
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    start_date: { required },
    percentage: {
      required,
      maxValue: greaterThanZero
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().substr(0, 10)
    },
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 2000, permanent: false });
    },
    // fetchData(id) {
    //   axios
    //     .get(apiUrl + `/baseinterest/${id}`)
    //     .then(r => r.data)
    //     .then(res => {
    //       this.vehicle = res.data
    //     })
    //     .catch(_error => {
    //       console.log(_error)
    //     })
    // },
    async onSubmit() {
      this.$v.$touch();
      let url = apiUrl + `/baseinterest/${this.interest.id}`
      const form = {
        start_date: this.formatDate(this.start_date),
        percentage: this.percentage,
        status: "active"
      }
      axios
        .put(url, form)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "Your data was updated succesfully!";
          setTimeout(() => {
            this.hideModal('editinterest');
          }, 1000)
        })
        .catch(_error => {
          this.status = "fail";
          this.message = _error;
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
        this.$emit('updated-data-table')
      }, 1000)
    }
  },
  computed: {
    availableDate() {
      return (this.interest.length > 0 && this.interest.length != 1) ? {
        to: new Date(this.interest.start_date)
      } : {}
    }
  }
}
</script>