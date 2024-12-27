<template>
  <b-modal
    id="modaluser"
    ref="modaluser"
    :title="$t('user.add-new')"
    modal-class="modal-center"
  >
    <div v-if="isProcessing" class="bg-transparent pr-5 w-100 h-100 d-flex justify-content-center align-items-center position-absolute opacity-75 z-index-10">
      <b-spinner variant="black" label="Spinning" class="text-center"></b-spinner>
    </div>

    <b-form
      id="addUserForm"
      class="av-tooltip tooltip-right-bottom"
      label="Bottom Right"
      @submit.prevent="onAddUserSubmit"
      >
      <b-form-group :label="$t('user.first-name')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.userForm.first_name.$model"
          :state="!$v.userForm.first_name.$error"
        />
        <b-form-invalid-feedback v-if="!$v.userForm.first_name.required">Please enter a first name</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('user.last-name')" class="has-top-label">
        <b-form-input
          type="text"
          v-model.trim="$v.userForm.last_name.$model"
          :state="!$v.userForm.last_name.$error"
        />
        <b-form-invalid-feedback v-if="!$v.userForm.last_name.required">Please enter last name</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('user.email')" class="has-top-label">
        <b-form-input
          type="email"
          v-model.trim="$v.userForm.email.$model"
          :state="!$v.userForm.email.$error"
        />
        <b-form-invalid-feedback v-if="!$v.userForm.email.required">Please enter last name</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.userForm.email.email">Should be valid email format</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('user.password')" class="has-top-label">
        <b-form-input
          :type="showPassword ? 'text' : 'password'"
          v-model.trim="$v.userForm.password.$model"
          :state="!$v.userForm.password.$error"
        />
        <b-button @click="showPassword = !showPassword" variant="outline" class="btn-absolute"><i class="simple-icon-eye" /></b-button>
        <b-form-invalid-feedback v-if="!$v.userForm.password.required">This field can't be blank!</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.userForm.password.minLength">This should contains at least 8 characters</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('forms.password-confirm')" class="has-top-label">
        <b-form-input
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model.trim="$v.userForm.passwordConfirm.$model"
          :state="!$v.userForm.passwordConfirm.$error"
        />
        <b-button @click="showConfirmPassword = !showConfirmPassword" variant="outline" class="btn-absolute"><i class="simple-icon-eye" /></b-button>
        <b-form-invalid-feedback v-if="!$v.userForm.passwordConfirm.required">This field can't be blank!</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.userForm.passwordConfirm.minLength">This should contains at least 8 characters</b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.userForm.passwordConfirm.sameAs">The password is not match!</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group :label="$t('user.position')" class="has-top-label">
        <v-select v-model="$v.userForm.position.$model" :options="roles"
        :dir="direction" />
        <div :class="{ 'invalid-feedback': true, 'd-block': $v.userForm.position.$error && !$v.userForm.position.required }"
        >Please select user role</div>
      </b-form-group>
    </b-form>

    <template slot="modal-footer">
      <b-button variant="outline-secondary" @click="hideModal('modaluser')">{{ $t('pages.cancel') }}</b-button>
      <b-button
        :class="{
          'btn-multiple-state': true,
          'show-spinner': status === 'processing',
          'show-success': status === 'success',
          'show-fail': status === 'fail'
        }"
        variant="primary" type="submit" form="addUserForm"
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
  minLength,
  sameAs,
  helpers
} = require("vuelidate/lib/validators");

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
      users: [],
      roles: [],
      showPassword: false,
      showConfirmPassword: false,
      userForm: {
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        passwordConfirm: null,
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
      email: { required, email },
      password: {
        required,
        minLength: minLength(8)
      },
      passwordConfirm: {
        required,
        minLength: minLength(8),
        sameAs: sameAs( function(){return this.userForm.password} )
      },
      position: { required }
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
    objectToFormData(obj) {
      const formData = new FormData();

      Object.entries(obj).forEach(([key, value]) => {
        formData.append(key, value);
      });

      return formData;
    },
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 2000, permanent: false });
    },
    onAddUserSubmit() {
      let url = apiUrl + "/register";
      this.$v.$touch();
      const newUser = {
        first_name: this.userForm.first_name,
        last_name: this.userForm.last_name,
        email: this.userForm.email,
        password: this.userForm.password,
        position: this.userForm.position.id
      }
      // console.log("adding item : ", newUser);
      this.users = this.objectToFormData(newUser);
      this.isProcessing = true;
      this.status = "processing";
      axios
        .post(url, this.users)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = "User was created!";
          setTimeout(() => {
            this.hideModal('modaluser');
          }, 1000)
        }).catch(_error => {
          this.status = "fail";
          this.message = "Sorry user can not be created";
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
