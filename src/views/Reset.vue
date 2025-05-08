<template>
  <div id="root">
    <div class="fixed-background">
      <main>
        <div class="container">
          <b-row class="h-100">
            <b-colxx xxs="12" md="10" class="mx-auto my-auto">
              <b-card class="auth-card" no-body>
                <div class="position-relative image-side bg-light">
                  <!-- <p class="text-white h2">MAGIC IS IN THE DETAILS</p>
                  <p class="white mb-0">Yes, it is indeed!</p> -->
                </div>
                <div class="form-side">
                  <router-link to="/">
                    <span class="logo-single" />
                  </router-link>
                  <div v-show="isSent === false">
                    <h2>Reset your password</h2>
                    <p class="text-muted mb-5">Please enter your new password below</p>
                    <b-form @submit.prevent="formSubmit" id="sendResetForm" class="av-tooltip tooltip-label-bottom" label="Bottom Right">
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
                      <div class="d-flex justify-content-between align-items-center">
                        <b-button
                          :class="{
                            'btn-multiple-state': true,
                            'show-spinner': status === 'processing',
                            'show-success': status === 'success',
                            'show-fail': status === 'fail'
                          }"
                          variant="primary" type="submit" form="sendResetForm"
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
                          <span v-else class="label">Reset Password</span>
                        </b-button>
                      </div>
                    </b-form>
                  </div>
                  <div v-show="isSent === true">
                    <i class="d-block display-3 simple-icon-check text-success mb-2"></i>
                    <h2>Success!</h2>
                    <p class="text-muted mb-5">Your password has been reset succesfully!</p>
                  </div>

                  <span class="d-block text-muted cursor-pointer mt-5" role="button" @click="goBack"><i class="simple-icon-arrow-left"></i> Back to Login</span>
                </div>
              </b-card>
            </b-colxx>
          </b-row>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { adminRoot } from '../constants/config';
import { apiUrl } from "../constants/config";
import {
  validationMixin
} from "vuelidate";
const {
  required,
  minLength,
  sameAs
} = require("vuelidate/lib/validators");

export default {
  data() {
    return {
      buttonTitle: "",
      isProcessing: false,
      isSent: false,
      status: "default",
      message: "",
      token: '',
      email: '',
      showPassword: false,
      showConfirmPassword: false,
      userForm: {
        password: null,
        passwordConfirm: null
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    userForm: {
      password: {
        required,
        minLength: minLength(8)
      },
      passwordConfirm: {
        required,
        minLength: minLength(8),
        sameAs: sameAs( function(){return this.userForm.password} )
      },
    }
  },
  methods: {
    goBack() {
      this.$router.push(adminRoot);
    },
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 4000, permanent: false });
    },
    formSubmit() {
      let url = apiUrl + "/reset-password";
      this.$v.userForm.$touch();
      const payload = {
        email: this.email,
        token: this.token,
        password: this.userForm.password,
        password_confirmation: this.userForm.passwordConfirm
      }
      if (!this.$v.userForm.$anyError) {
        this.isProcessing = true;
        this.status = "processing";
        axios
        .post(url, payload)
        .then(r => r.data)
        .then(res => {
          this.isProcessing = false;
          this.status = "success";
          this.message = res.message;
          this.isSent = true;
          setTimeout(() => {
            this.addNotification("success filled", "Great!", this.message);
          }, 1000)
        }).catch(error => {
          this.status = "fail";
          if (error.response) {
            this.message = error.response.data.message;
            this.addNotification("error filled", "Oppss!", this.message);
            console.log(error.response.data);
          }

          setTimeout(() => {
            this.isProcessing = false;
            this.status = "default";
            this.buttonTitle = "Try again"
          }, 1000)
        })
      }
    }
  },
  mounted() {
    this.token = this.$route.query.token;
    this.email = this.$route.query.email;
    document.body.classList.add("background");
  },
  beforeDestroy() {
    document.body.classList.remove("background");
  },
};
</script>
