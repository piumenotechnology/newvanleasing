<template>
   <b-modal id="deleteSold" ref="deleteSold" centered header-class="py-4" footer-class="py-4">
      <template #modal-title>
         Confirm delete
      </template>

      <template #default>
         <p class="m-0">{{ message }}</p>
         <!-- <p :show="messageShow">{{ message }}</p> -->
      </template>

      <template #modal-footer="{ cancel }">
         <b-button size="sm" variant="outline-secondary" @click="cancel()">
            {{ $t('pages.cancel') }}
         </b-button>
         <b-button
            :class="{
               'btn-multiple-state': true,
               'show-spinner': status === 'processing',
               'show-success': status === 'success',
               'show-fail': status === 'fail'
            }"
            variant="danger"
            @click="handleClick(selectedItem)"
            :disabled="status != 'default'">
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
               {{ $t('pages.delete') }}
            </span>
         </b-button>
      </template>
   </b-modal>
</template>
<script>
import axios from 'axios'
import { apiUrl } from "../../constants/config";
export default {
   props: ["selectedItem", "endpoint"],
   data() {
      return {
         status: "default",
         message: "Are you sure want to delete this data?",
         messageShow: false
      };
   },
   methods: {
      handleClick(deleteId) {
         let url = apiUrl + this.endpoint + deleteId;
         this.status = "processing";
         axios
            .delete(url)
            .then(r => r.data)
            .then(res => {
               this.status = "success";
               this.message = res.message;
            })
            .catch(err => {
               this.status = "fail";
               this.message = err.message;
            })
            .finally(() => {
               this.messageShow = true;
               setTimeout(() => {
                  this.messageShow = false;
                  this.$emit('delete-modal-hide');
                  this.$refs.deleteSold.hide();
                  this.status = "default";
               }, 1000);
            });
      }
   }
}
</script>