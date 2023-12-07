<template>
  <div>
    <b-form-group :label="`Rent`" class="has-float-label">
      <b-form-input type="text" v-model.trim="$v.rent.child.$model" :state="!$v.rent.child.$error" />
      <b-form-invalid-feedback v-if="!$v.rent.child.required">Funder is required!</b-form-invalid-feedback>
      <b-form-invalid-feedback v-else-if="!$v.rent.child.numeric">Must be a number</b-form-invalid-feedback>
    </b-form-group>
  </div>
</template>

<script>
export default {
  inject: ['$v'],
  props: ['rent']
}
</script>