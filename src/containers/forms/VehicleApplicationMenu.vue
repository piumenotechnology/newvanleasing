<template>
   <application-menu>
      <vue-perfect-scrollbar :settings="{ suppressScrollX: true, wheelPropagation: false }">
         <div class="p-4">
            <!-- <p class="text-muted text-small mb-3">{{ $t('pages.status') }}</p> -->
            <ul class="list-unstyled my-4">
               <li class="nav-item">
                  <i :class="items.status_next_step == 'Available' ? 'simple-icon-check text-success center aligned' : 'iconsminds-remove text-muted center aligned'" />
                  <span class="d-inline-block">{{ $t('pages.availability') }}</span>
                  <span class="float-right">{{ items.status_next_step }}</span>
               </li>
            </ul>
            <b-button :to="{ path: `/app/performance/${items.id}` }" block
               variant="success"
               size="sm"><i class="iconsminds-bar-chart-4 mr-2" />View Full Report</b-button>
         </div>
      </vue-perfect-scrollbar>
   </application-menu>
</template>


<script>
import ApplicationMenu from "../../components/Common/ApplicationMenu";
export default {
   components: {
      "application-menu": ApplicationMenu
   },
   props: ["items"],
   mounted() {
      document.body.classList.add("right-menu");
   },
   beforeDestroy() {
      document.body.classList.remove("right-menu");
   }
};
</script>
