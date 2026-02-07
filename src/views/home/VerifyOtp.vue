<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="4" class="login-form d-flex justify-content-center align-items-center min-vh-100 ml-auto my-auto">
      <div class="otp-card w-100 px-5">
        <div class="text-center mb-4">
          <h3 class="mb-2">OTP Verification</h3>
          <p class="text-muted">
            Enter the 6-digit verification code sent to your email.
          </p>
        </div>

        <form @submit.prevent="verifyOtp">
          <div class="otp-input--wrapper d-flex justify-content-center gx-4 mb-4">
            <input
              v-for="(digit, index) in otp"
              :key="index"
              ref="otpInputs"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="form-control otp-input"
              v-model="otp[index]"
              @input="onInput(index)"
              @keydown.backspace="onBackspace(index)"
              @paste="onPaste"
            />

          </div>

          <b-button type="submit" variant="primary" size="lg" :disabled="!isComplete" :class="{'btn-multiple-state btn-primary btn-lg w-100 mb-3': true,
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
            <span class="label">Verify Account</span>
          </b-button>
        </form>

        <div class="text-center text-muted">
          Didn’t receive code?
          <a
            href="#"
            class="text-primary fw-semibold"
            @click.prevent="resendOtp"
          >
            Resend
          </a>
        </div>

        <div v-if="message && message.length > 0" class="text-center mt-2">
          {{ message }}
        </div>
      </div>
    </b-colxx>
  </b-row>
</template>

<script>
import axios from "axios";
import { apiUrl } from "../../constants/config";
import {
  mapGetters,
  mapActions
} from "vuex";

export default {
  name: 'VerifyOtp',

  data() {
    return {
      otp: ['', '', '', '', '', ''],
      message: ''
    }
  },

  computed: {
    ...mapGetters(['currentUser', 'processing', 'loginError']),
    isComplete() {
      return this.otp.every(digit => digit !== '')
    }
  },

  mounted() {
    if (!this.currentUser) {
      this.$router.replace({ path: 'login' })
    }
    this.$refs.otpInputs[0].focus()
  },

  methods: {
    ...mapActions(["verifyAccount"]),
    onInput(index) {
      if (this.otp[index] && index < this.otp.length - 1) {
        this.$refs.otpInputs[index + 1].focus()
      }
    },

    onBackspace(index) {
      if (!this.otp[index] && index > 0) {
        this.$refs.otpInputs[index - 1].focus()
      }
    },

    onPaste(event) {
      event.preventDefault()

      const pasted = (event.clipboardData || window.clipboardData)
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, this.otp.length)

      if (!pasted) return

      pasted.split('').forEach((char, index) => {
        this.$set(this.otp, index, char)
      })

      this.$nextTick(() => {
        const lastIndex = pasted.length - 1
        if (this.$refs.otpInputs[lastIndex]) {
          this.$refs.otpInputs[lastIndex].focus()
        }
      })
    },
    verifyOtp() {
      let url = apiUrl + "/verify-otp"
      const code = this.otp.join('')
      this.$store.commit('setProcessing', true)

      axios.post(url, {
        user_id: this.currentUser.id,
        otp_code: code
      })
        .then(response => {
          setTimeout(() => {
            this.verifyAccount(response.data)
          }, 50)

        })
        .catch(error => {
          this.$store.commit('setProcessing', false)
          this.otp = ['', '', '', '', '', '']
          this.message = 'Invalid OTP code.'
          this.$nextTick(() => {
            this.$refs.otpInputs[0].focus()
          })
        })
    },


    resendOtp() {
      this.otp = ['', '', '', '', '', '']
      let url = apiUrl + "/resend-otp"
      const userData = {
        user_id: this.currentUser.id,
      }
      axios
      .post(url, userData)
      .then(r => r.data)
      .then(res => {
        this.message = 'Your OTP has been resent to your email.'
      })
      .catch(err => {
        this.message = 'OTP sending failed. Please try again in a moment.'
      })
      this.$nextTick(() => {
        this.$refs.otpInputs[0].focus()
      })
    }
  },
  watch: {
    currentUser(val) {
      if (val && val.username) {
       setTimeout(() => {
          this.$router.push({ path: 'app' }, () => {
            this.$router.go(0)
          })
        }, 50)
      }
    },

    loginError: {
      handler(val) {
        if (!val) {
          this.message = null
          return
        }

        if (val.status === 422) {
          // reset OTP
          this.otp = ['', '', '', '', '', '']

          this.$nextTick(() => {
            this.$refs.otpInputs?.[0]?.focus()
          })
        }

        this.message = val.message
      },
      deep: true
    }
  }

}
</script>

<style scoped>
.auth-card {
  max-width: 420px;
  margin: auto;
}

.otp-input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 24px;
  border-radius: 10px;
}
</style>
