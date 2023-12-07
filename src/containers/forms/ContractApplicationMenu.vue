<template>
   <application-menu>
      <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }">
         <div class="p-4">
            <p class="text-muted text-small mb-3">{{ $t('pages.last-update') }}</p>
            <p class="mb-5">
               <i class="simple-icon-clock" />
               <span class="d-inline-block ml-2">{{ vehicle.updated_at | datetime }}</span>
            </p>
            <p class="text-muted text-small mb-3">{{ $t('pages.overview') }}</p>
            <ul class="list-unstyled mb-4">
               <li class="nav-item mb-3">
                  <span class="d-inline-block text-muted">Rental income</span>
                  <span class="float-right">£ {{ vehicle.rental_income | withcoma }}</span>
               </li>
               <li class="nav-item mb-3" v-show="vehicle.other_income">
                  <span class="d-inline-block text-muted">Other Income</span>
                  <span class="float-right">£ {{ vehicle.other_income | withcoma }}</span>
               </li>
               <li class="nav-item mb-3">
                  <span class="d-inline-block text-muted">Total cost</span>
                  <span class="float-right">£ {{ vehicle.total_cost | withcoma }}</span>
               </li>
               <li class="nav-item mb-3">
                  <span class="d-inline-block text-muted">Contract margin</span>
                  <span class="float-right">£ {{ vehicle.contract_margin | withcoma }}</span>
               </li>
               <li class="nav-item mt-3 pt-3 border-top border-1 font-weight-bold">
                  <span class="d-inline-block text-muted">Total Income</span>
                  <span class="float-right">£ {{ vehicle.total_income | withcoma }}</span>
               </li>
            </ul>
         </div>
      </vue-perfect-scrollbar>
   </application-menu>
</template>

<script>
import moment from 'moment';
import { apiUrl } from "../../constants/config";
import ApplicationMenu from "../../components/Common/ApplicationMenu";
export default {
   components: {
      "application-menu": ApplicationMenu
   },
   props: ["vehicle"],
   filters: {
      datetime: function (date) {
         return moment(new Date(date)).calendar();
         // return moment(new Date(date)).format('MMM, YYYY')
         // return moment(date).startOf('day').fromNow()
      },
      withcoma: function(num) {
         return Number(num).toLocaleString()
      }
   },
   data() {
      return {
         selectedVehicle: []
      }
   },
   mounted() {
      document.body.classList.add("right-menu");
      // this.getVehicle(this.items.id_purchase_order);
   },
   beforeDestroy() {
      document.body.classList.remove("right-menu");
   }
};
</script>
