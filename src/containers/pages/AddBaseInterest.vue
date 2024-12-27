<template>
  <b-modal
    id="addinterest"
    ref="addinterest"
    :title="$t('interest.add-interest')"
    modal-class="modal-right"
  >
    <div v-if="isProcessing" class="bg-transparent pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-75 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>
    <b-form
      id="addInterestForm"
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
      <b-button variant="outline-secondary" @click="hideModal('addinterest')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :class="{
          'btn-multiple-state': true,
          'show-spinner': status === 'processing',
          'show-success': status === 'success',
          'show-fail': status === 'fail'
        }"
        variant="primary" type="submit" form="addInterestForm"
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
      start_date: null,
      percentage: 0,
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
    disableLast: async(id) => {
      const form = {
        status: "unactive"
      }
      return axios.put(apiUrl + `/updatebaseinterest/${id}`, form)
    },
    async onSubmit() {
      this.$v.$touch();
      console.log(this.interest.length)
      if(this.interest.length > 0 && this.interest !== undefined) {
        await this.disableLast(this.interest.id)
        this.saveNew()
      } else {
        this.saveNew()
      }
      // let lastId = await this.getLast()
      // console.log(lastId)
      // if(lastId == undefined) {
      //   this.saveNew()
      // } else {
      //   await this.disableLast(lastId)
      //   this.saveNew()
      // }
    },
    saveNew() {
      let url = apiUrl + "/baseinterest";
      const form = {
        start_date: this.formatDate(this.start_date),
        percentage: this.percentage,
        status: "active"
      }
      axios
        .post(url, form)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "Your data was saved succesfully!";
          setTimeout(() => {
            this.hideModal('addinterest');
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
        this.$emit('added-data-table')
      }, 1000)
    }
  },
  computed: {
    availableDate() {
      return (this.interest !== undefined) ? {
        to: new Date(this.interest.start_date)
      } : {}
    }
  },
  mounted() {
    console.log(this.interest)
  }
}
</script>