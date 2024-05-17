<template>
  <div v-if="isLoading">
    <b-row class="app-row">
      <page-header :title="$t('contract.edit-contract')">
        <div class="top-right-button-container">
          <b-button variant="danger" size="lg" class="mr-2 top-right-button" @click.prevent="cancelForm">
            <span class="label">
              <i class="simple-icon-close mr-2" />{{ $t('pages.cancel') }}
            </span>
          </b-button>
          <b-button variant="success" size="lg" class="top-right-button" @click.prevent="submitForm" :class="{
            'btn-multiple-state': true,
            'show-spinner': status === 'processing',
            'show-success': status === 'success',
            'show-fail': status === 'fail'
          }" :disabled="isProcessing != false"
          v-observe-visibility="{
            callback: visibilityChanged,
            intersection: {
              threshold: 0.5,
            },
          }">
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
            <span class="label">
              <i class="simple-icon-check mr-2" />{{ $t('vehicle.save') }}
            </span>
          </b-button>
        </div>
      </page-header>
    </b-row>
    <contract-update-form :items="items" :minDate="vehicle.tgl_available" ref="updateForm" @update-contract="vehicleContract"></contract-update-form>
    <contract-application-menu v-if="isLoading" :vehicle="items" :key="componentKey" />
    <b-card class="float-save-button mx-auto z-index-10" :class="(!isVisible)?'show':''">
      <b-button
        variant="primary default"
        size="lg"
        @click.prevent="submitForm"
        :class="{
            'btn-multiple-state': true,
            'show-spinner': status === 'processing',
            'show-success': status === 'success',
            'show-fail': status === 'fail'
        }"
        :disabled="isProcessing != false">
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
        <span class="label">
            <i class="simple-icon-check mr-2" />{{ $t('vehicle.save') }}
        </span>
      </b-button>
    </b-card>
  </div>
  <div v-else class="loading" key="itemLoading"></div>
</template>

<script>
import axios from 'axios'
import { apiUrl } from "../../../constants/config";
import PageHeader from '../../../components/Common/PageHeader';
import ContractApplicationMenu from "../../../containers/forms/ContractApplicationMenu";
import ContractUpdateForm from "../../../containers/forms/ContractUpdateForm"

export default {
  components: {
    "page-header": PageHeader,
    "contract-application-menu": ContractApplicationMenu,
    "contract-update-form": ContractUpdateForm
  },
  data() {
    return {
      isProcessing: false,
      isLoading: false,
      isVisible: false,
      title: "",
      status: "",
      items: [],
      vehicle: [],
      componentKey: 0
    }
  },
  methods: {
    fetchContract(id) {
      let url = apiUrl + "/salesorder/" + id;
      axios
        .get(url)
        .then(r => r.data)
        .then(res => {
          this.items = res.data[0];
          this.getAvailableDate(this.items.id_purchase_order)
          // this.message = res.message;
        })
        .catch(err => {
          console.log(err.message)
        })
        .finally(() => {
          this.isLoading = true;
        });
    },
    async getAvailableDate(id) {
      let url = apiUrl + "/purchaseorder/" + id;
      axios
        .get(url)
        .then(r => r.data)
        .then(res => {
          this.vehicle = res.data;
          // this.message = res.message;
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible
    },
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 2000, permanent: false });
    },
    submitForm() {
      this.$refs.updateForm.onValitadeFormSubmit();
    },
    cancelForm() {
      this.$router.go();
    },
    vehicleContract(status) {
      this.isProcessing = true
      this.status = status;
      if (status == "fail") {
        let message = "An error occured while saving the data. Please try again later.";
        this.addNotification("error filled", "Oppss!", message);
      } else if (status == "success") {
        this.forceRerender();
        let message = "Your data has been updated successfully.";
        this.addNotification("success filled", "Great!!", message);
      }
      this.isProcessing = false
      setTimeout(() => {
        this.status = "default"
      }, 5000)
    },
    forceRerender() {
      this.componentKey++;
      this.fetchContract(this.$route.params.id);
    }
  },
  mounted() {
    this.fetchContract(this.$route.params.id)
  }
}
</script>
