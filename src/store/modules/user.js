import axios from 'axios'
import { apiUrl } from '../../constants/config';
import firebase from 'firebase/app'
// import 'firebase/auth'
import { currentUser, currentCapability, isAuthGuardActive } from '../../constants/config'
import { setCurrentUser, getCurrentUser, setCurrentCapability, getCurrentCapability } from '../../utils'
export default {
  state: {
    currentUser: isAuthGuardActive ? getCurrentUser() : currentUser,
    currentCapability: isAuthGuardActive ? getCurrentCapability() : currentCapability,
    loginError: null,
    processing: false,
    forgotMailSuccess: null,
    resetPasswordSuccess: null
  },
  getters: {
    currentUser: state => state.currentUser,
    currentCapability: state => state.currentCapability,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setCapability(state, payload) {
      state.currentCapability = payload
      state.processing = false
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.currentCapability = null
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.currentCapability = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.currentCapability = null
      state.processing = false
      state.forgotMailSuccess = true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.currentCapability = null
      state.processing = false
      state.resetPasswordSuccess = true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      axios
        .post(apiUrl + "/login", {
          username: payload.username,
          password: payload.password
        })
        .then(res => res.data)
        .then(
          user => {
            // console.log(user.capability)
            const item = {
              id: user.user.id,
              first_name: user.user.first_name,
              last_name: user.user.last_name,
              username: user.user.username,
              email: user.user.email,
              isAdmin: (user.user.position == 'Administrator') ? 1 : 0,
              ...currentUser
            }
            setCurrentUser(item)
            setCurrentCapability(user.capability)
            commit('setUser', item)
            commit('setCapability', user.capability)
          },
          err => {
            setCurrentUser(null)
            setCurrentCapability(null)
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )

      // firebase
      //   .auth()
      //   .signInWithEmailAndPassword(payload.email, payload.password)
      //   .then(
      //     user => {
      //       const item = { uid: user.user.uid, ...currentUser }
      //       setCurrentUser(item)
      //       commit('setUser', item)
      //     },
      //     err => {
      //       setCurrentUser(null);
      //       commit('setError', err.message)
      //       setTimeout(() => {
      //         commit('clearError')
      //       }, 3000)
      //     }
      //   )
    },
    forgotPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      firebase
        .auth()
        .sendPasswordResetEmail(payload.email)
        .then(
          user => {
            commit('clearError')
            commit('setForgotMailSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    resetPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      firebase
        .auth()
        .confirmPasswordReset(payload.resetPasswordCode, payload.newPassword)
        .then(
          user => {
            commit('clearError')
            commit('setResetPasswordSuccess')
          },
          err => {
            commit('setError', err.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
    },
    signOut({ commit }) {
      setCurrentUser(null);
      setCurrentCapability(null);
      commit('setLogout')

      // firebase
      //   .auth()
      //   .signOut()
      //   .then(() => {
      //     setCurrentUser(null);
      //     commit('setLogout')
      //   }, _error => { })
    }
  }
}
