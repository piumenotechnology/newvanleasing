<template>
   <b-modal id="modallg" ref="modallg" size="lg" centered scrollable :title="$t('vehicle.add-new')" hide-footer>
      <div class="wizard wizard-default">
         <tab-vehicle-info @add-modal-hide="hideModal('modallg')"/>
      </div>
      <template slot="modal-footer">
         <b-button variant="outline-secondary" @click="hideModal('modalright')">{{ $t('pages.cancel') }}</b-button>
         <b-button type="submit" form="addVehicleForm" variant="primary" class="mr-1">{{ $t('pages.submit') }}</b-button>
      </template>
   </b-modal>
</template>
<script>
import TabVehicleInfo from "../tabs/TabVehicleInfo";
export default {
   components: {
      "tab-vehicle-info": TabVehicleInfo
   },
   data() {
      return {
         
      };
   },
   methods: {
      hideModal(refname) {
         this.$refs[refname].hide();
         this.$emit('added-data-table');
      }
   }
};
</script>