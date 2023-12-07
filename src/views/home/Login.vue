<template>
    <b-row class="h-100">
        <b-colxx xxs="12" md="4" class="login-form d-flex justify-content-center align-items-center min-vh-100 ml-auto my-auto">
            <div class="form-side w-100 px-5">
                    <router-link to="/">
                        <span class="logo-single" />
                    </router-link>
                    <!-- <h6 class="mb-4">{{ $t('user.login-title')}}</h6> -->
                    <h6 class="mb-4">{{ $t('user.login-desc')}}</h6>
    
                    <b-form @submit.prevent="formSubmit" class="av-tooltip tooltip-label-bottom">
                        <!-- <b-form-group :label="$t('user.email')" class="has-float-label mb-4">
                            <b-form-input type="text" v-model="$v.form.email.$model" :state="!$v.form.email.$error" />
                            <b-form-invalid-feedback v-if="!$v.form.email.required">Please enter your email address</b-form-invalid-feedback>
                            <b-form-invalid-feedback v-else-if="!$v.form.email.email">Please enter a valid email address</b-form-invalid-feedback>
                            <b-form-invalid-feedback v-else-if="!$v.form.email.minLength">Your email must be minimum 4 characters</b-form-invalid-feedback>
                        </b-form-group> -->

                        <b-form-group :label="$t('user.username')" class="has-top-label mb-4">
                            <b-form-input type="text" v-model="$v.form.username.$model" :state="!$v.form.username.$error" />
                            <b-form-invalid-feedback v-if="!$v.form.username.required">Please enter your username</b-form-invalid-feedback>
                        </b-form-group>
    
                        <b-form-group :label="$t('user.password')" class="has-top-label mb-4">
                            <b-form-input type="password" v-model="$v.form.password.$model" :state="!$v.form.password.$error" />
                            <b-form-invalid-feedback v-if="!$v.form.password.required">Please enter your password</b-form-invalid-feedback>
                            <b-form-invalid-feedback v-else-if="!$v.form.password.minLength || !$v.form.password.maxLength">Your password must be between 4 and 16 characters</b-form-invalid-feedback>
                        </b-form-group>
                        <div class="d-flex justify-content-between align-items-center">
                            <router-link to="/user/forgot-password">{{ $t('user.forgot-password-question')}}</router-link>
                            <b-button type="submit" variant="primary" size="lg" :disabled="processing" :class="{'btn-multiple-state btn-shadow': true,
                        'show-spinner': processing,
                        'show-success': !processing && loginError===false,
                        'show-fail': !processing && loginError }">
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
                                <span class="label">{{ $t('user.login-button') }}</span>
                            </b-button>
                        </div>
                    </b-form>
                </div>
        </b-colxx>
    </b-row>
</template>
    
<script>
    import {
        mapGetters,
        mapActions
    } from "vuex";
    import {
        validationMixin
    } from "vuelidate";
    import { adminRoot } from '../../constants/config';
    const {
        required,
        maxLength,
        minLength,
        email
    } = require("vuelidate/lib/validators");
    
    export default {
        data() {
            return {
                form: {
                    // email: "test@coloredstrategies.com",
                    username: "",
                    password: ""
                },
            };
        },
        mixins: [validationMixin],
        validations: {
            form: {
                username:{
                    required
                },
                password: {
                    required,
                    maxLength: maxLength(16),
                    minLength: minLength(4)
                },
                // email: {
                //     required,
                //     email,
                //     minLength: minLength(4)
                // }
            }
        },
        computed: {
            ...mapGetters(["currentUser", "processing", "loginError"])
        },
        methods: {
            ...mapActions(["login"]),
            formSubmit() {
                this.$v.$touch();
                this.$v.form.$touch();
                // this.form.email = "piaf-vue@coloredstrategies.com";
                // this.form.password = "piaf123";
               if (!this.$v.form.$anyError) {
                    this.login({
                        username: this.form.username,
                        password: this.form.password
                    });
                }
            }
        },
        watch: {
            currentUser(val) {
                // if (val && val.id && val.id.length > 0) {
                if (val && val.id) {
                    setTimeout(() => {
                        this.$router.push(adminRoot);
                    }, 200);
                }
            },
            loginError(val) {
                if (val != null) {
                    this.$notify("error", "Login Error", val, {
                        duration: 3000,
                        permanent: false
                    });
    
                }
            }
        }
    };
</script>
    