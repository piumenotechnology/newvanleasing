<template>
  <b-modal
    id="edituser"
    ref="edituser"
    :title="$t('user.edit')"
    modal-class="modal-center"
  >
    <div v-if="isProcessing" class="bg-transparent pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-75 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>

    <b-form
      id="editUserForm"
      class="av-tooltip tooltip-right-bottom"
      label="Bottom Right"
      @submit.prevent="onEditRoleSubmit"
      >
      <b-form-group :label="$t('user.first-name')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.userForm.first_name.$model"
          :state="!$v.userForm.first_name.$error"
        />
        <b-form-invalid-feedback v-if="!$v.userForm.first_name.required">Please enter first name</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('user.last-name')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.userForm.last_name.$model"
          :state="!$v.userForm.last_name.$error"
        />
        <b-form-invalid-feedback v-if="!$v.userForm.last_name.required">Please enter last name</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('user.username')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.userForm.username.$model"
          :state="!$v.userForm.username.$error"
        />
        <b-form-invalid-feedback v-if="!$v.userForm.username.required">Please enter username</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.userForm.username.noSpace">Can not contains space</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('user.email')" class="has-top-label">
        <b-form-input
          type="email"
          v-model.trim="$v.userForm.email.$model"
          :state="!$v.userForm.email.$error"
        />
        <b-form-invalid-feedback v-if="!$v.userForm.email.required">Please enter email address</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.userForm.email.email">Should be valid email format</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('user.position')" class="has-top-label">
        <v-select v-model="$v.userForm.position.$model" :options="roles"
        :dir="direction" />
        <div :class="{ 'invalid-feedback': true, 'd-block': $v.userForm.position.$error && !$v.userForm.position.required }"
        >Please select user role</div>
      </b-form-group>
    </b-form>

    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('edituser')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :class="{
          'btn-multiple-state': true,
          'show-spinner': status === 'processing',
          'show-success': status === 'success',
          'show-fail': status === 'fail'
        }"
        variant="primary" type="submit" form="editUserForm"
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
import {
  validationMixin
} from "vuelidate";
const {
  required,
  email,
  helpers
} = require("vuelidate/lib/validators");

const noSpace = (value) => new RegExp(/^\S*$/).test(value)

export default {
  components: {
    "v-select": vSelect
  },
  data() {
    return {
      buttonTitle: "",
      isProcessing: false,
      status: "default",
      message: "",
      roles: [],
      userForm: {
        id: 0,
        first_name: null,
        last_name: null,
        username: null,
        email: null,
        position: null
      },
      direction: getDirection().direction,
      selectData: []
    };
  },
  mixins: [validationMixin],
  validations: {
    userForm: {
      first_name: { required },
      last_name: { required },
      username: { required, noSpace },
      email: { required, email },
      position: { required },
    }
  },
  methods: {
    getRoles() {
      let url = apiUrl + "/getroles?per_page=30"
      axios
        .get(url)
        .then(r => r.data)
        .then(res => {
          let userRoles = res.data.data.map(({ name, id }) => ({ label: name, id: id }));
          if(userRoles.length > 0){
            this.roles = userRoles
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 2000, permanent: false });
    },
    getEditData(items) {
      this.$refs.edituser.show();
      this.userForm.id = items.id
      this.userForm.first_name = items.first_name
      this.userForm.last_name = items.last_name
      this.userForm.username = items.username
      this.userForm.email = items.email
      this.userForm.position = items.position
    },
    onEditRoleSubmit() {
      let url = apiUrl + "/user/" + this.userForm.id;
      this.$v.$touch();
      const editedUser = {
        first_name: this.userForm.first_name,
        last_name: this.userForm.last_name,
        username: this.userForm.username,
        email: this.userForm.email,
        position: (this.userForm.position.id === undefined) ? 2 : this.userForm.position.id
      }
      // console.log("adding item : ", editedUser);
      this.isProcessing = true;
      this.status = "processing";
      axios
        .put(url, editedUser)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "User was successfully edited!";
          setTimeout(() => {
            this.hideModal('edituser');
          }, 1000)
        }).catch(_error => {
          this.status = "fail";
          this.message = "Sorry user can not be edited";
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
  mounted() {
    this.getRoles()
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
