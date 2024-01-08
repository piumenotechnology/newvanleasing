<template>
  <div>
    <b-form-group :label="$t('vehicle.final-payment')"  class="has-float-label">
      <b-form-input
          type="text"
          v-model.trim="$v.cash.terms.$model"
          :state="!$v.cash.terms.$error"
      />
      <b-form-invalid-feedback v-if="!$v.cash.terms.numeric">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group :label="$t('vehicle.documentation-fee')"  class="has-float-label">
      <b-form-input
          type="text"
          v-model.trim="$v.cash.deposit.$model"
          :state="!$v.cash.deposit.$error"
      />
      <b-form-invalid-feedback v-if="!$v.cash.deposit.numeric">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group :label="$t('vehicle.final-fee')"  class="has-float-label">
      <b-form-input
          type="text"
          v-model.trim="$v.cash.monthlyRepay.$model"
          :state="!$v.cash.monthlyRepay.$error"
      />
      <b-form-invalid-feedback v-if="!$v.cash.monthlyRepay.numeric">Must be a number</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group :label="$t('vehicle.other-fee')"  class="has-float-label">
      <b-form-input
          type="text"
          v-model.trim="$v.cash.finalPay.$model"
          :state="!$v.cash.finalPay.$error"
      />
      <b-form-invalid-feedback v-if="!$v.cash.finalPay.numeric">Must be a number</b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
export default {
  inject: ['$v'],
  props: ['cash']
}
</script>
