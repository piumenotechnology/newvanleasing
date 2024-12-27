<template>
  <b-modal
    id="editrole"
    ref="editrole"
    :title="$t('user.edit-role')"
    modal-class="modal-center"
  >
    <div v-if="isProcessing" class="bg-transparent pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-75 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>

    <b-form
      id="editRoleForm"
      class="av-tooltip tooltip-right-bottom"
      label="Bottom Right"
      @submit.prevent="onEditRoleSubmit"
      >
      <b-form-group :label="$t('user.role-name')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.roleForm.name.$model"
          :state="!$v.roleForm.name.$error"
        />
        <b-form-invalid-feedback v-if="!$v.roleForm.name.required">Please enter a role name</b-form-invalid-feedback>
      </b-form-group>
    </b-form>

    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('editrole')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :class="{
          'btn-multiple-state': true,
          'show-spinner': status === 'processing',
          'show-success': status === 'success',
          'show-fail': status === 'fail'
        }"
        variant="primary" type="submit" form="editRoleForm"
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
import {
  validationMixin
} from "vuelidate";
const {
  required,
  helpers
} = require("vuelidate/lib/validators");

export default {
  data() {
    return {
      buttonTitle: "",
      isProcessing: false,
      status: "default",
      message: "",
      roleForm: {
        id: 0,
        name: null,
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    roleForm: {
      name: { required }
    }
  },
  methods: {
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 2000, permanent: false });
    },
    getEditData(items) {
      this.$refs.editrole.show();
      this.roleForm.id = items.id
      this.roleForm.name = items.name
    },
    onEditRoleSubmit() {
      let url = apiUrl + "/editrole/" + this.roleForm.id;
      this.$v.$touch();
      const newRole = {
        name: this.roleForm.name
      }
      // console.log("adding item : ", newRole);
      this.isProcessing = true;
      this.status = "processing";
      axios
        .put(url, newRole)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "User was successfully edited!";
          setTimeout(() => {
            this.hideModal('editrole');
          }, 1000)
        }).catch(_error => {
          this.status = "fail";
          this.message = "Sorry role can not be edited";
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
  }
};
</script>

<style scoped>
.btn-absolute  {
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
