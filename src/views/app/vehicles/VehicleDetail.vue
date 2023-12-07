<template>
   <div v-if="isLoading">
      <b-row class="app-row">
         <page-header :title="$t('vehicle.edit')">
            <div class="top-right-button-container">
               <b-button
                  variant="primary"
                  size="lg"
                  class="top-right-button"
                  @click.prevent="submitForm"
                  :class="{
                     'btn-multiple-state': true,
                     'show-spinner': status === 'processing',
                     'show-success': status === 'success',
                     'show-fail': status === 'fail'
                  }"
                  :disabled="isProcessing != false"
                  v-observe-visibility="visibilityChanged">
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
      <vehicle-update-form :items="items" ref="updateForm" @update-vehicle="vehicleUpdate"></vehicle-update-form>
      <vehicle-application-menu
         v-if="isLoading"
         :items="items"
      ></vehicle-application-menu>
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
import VehicleApplicationMenu from "../../../containers/forms/VehicleApplicationMenu";
import VehicleUpdateForm from "../../../containers/forms/VehicleUpdateForm"

export default {
   components: {
      "page-header": PageHeader,
      "vehicle-application-menu": VehicleApplicationMenu,
      "vehicle-update-form": VehicleUpdateForm
   },
   data() {
      return {
         isProcessing: false,
         isLoading: false,
         isVisible: false,
         title: "",
         status: "",
         items: []
      }
   },
   methods: {
      fetchVehicle(id) {
         var url = apiUrl + "/purchaseorder/" + id;
         axios
            .get(url)
            .then(r => r.data)
            .then(res => {
               this.items = res.data;
               // this.message = res.message;
            })
            .catch(err => {
               console.log(err.message)
            })
            .finally(() => {
               this.isLoading = true;
            });
      },
      submitForm() {
         this.$refs.updateForm.onValitadeFormSubmit();
      },
      visibilityChanged(isVisible, entry) {
         this.isVisible = isVisible
      },
      vehicleUpdate(status) {
         this.isProcessing = true
         this.status = status;
         // this.status = "fail";
         setTimeout(() => {
            this.isProcessing = false
            this.status = "default";
         }, 3000)
      }
   },
   mounted() {
      this.fetchVehicle(this.$route.params.id);
   }
}
</script>