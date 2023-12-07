<template>
   <div>
      <b-row>
         <b-colxx xxs="12" class="mb-4">
            <piaf-breadcrumb :heading="$t('additional.header')" />
            <!-- <div class="separator mb-5"></div> -->
         </b-colxx>
      </b-row>
      <b-row>
         <b-colxx md="12" xl="4">
            <b-row>
               <b-colxx lg="6" xl="12" class="mb-3">
                  <card-with-button
                     v-model="activeComponent"
                     @changeTab="getTab"
                     icon="iconsminds-billing"
                     :detail="$t('additional.has-found')"
                     :count="`${ costCount } ${$t('additional.cost')}`"
                     :tab="'tab-additional-cost'"
                  >
                     <div class="position-absolute card-top-buttons">
                        <b-button @click.prevent="getTab('tab-additional-cost')"
                        v-b-modal.modalothercost variant="secondary" size="xl" class="icon-button">
                        <svg data-v-63191ed2="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" class="mt-n1 text-primary">
                           <g data-v-63191ed2="" id="SVGRepo_bgCarrier" stroke-width="0"></g>
                           <g data-v-63191ed2="" id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                           <g data-v-63191ed2="" id="SVGRepo_iconCarrier">
                              <title data-v-63191ed2=""></title>
                              <g data-v-63191ed2="" id="Complete">
                                 <g data-v-63191ed2="" data-name="add" id="add-2">
                                 <g data-v-63191ed2="">
                                    <line data-v-63191ed2="" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="19" y2="5"></line>
                                    <line data-v-63191ed2="" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" x2="19" y1="12" y2="12"></line>
                                 </g>
                                 </g>
                              </g>
                           </g>
                        </svg>
                        </b-button>
                     </div>
                  </card-with-button>
               </b-colxx>
               <b-colxx lg="6" xl="12" class="mb-3">
                  <card-with-button
                     v-model="activeComponent"
                     @changeTab="getTab"
                     icon="iconsminds-financial"
                     :detail="$t('additional.has-found')"
                     :count="`${ incomeCount } ${$t('additional.income')}`"
                     :tab="'tab-additional-income'"
                  >
                     <div class="position-absolute card-top-buttons">
                        <b-button @click.prevent="getTab('tab-additional-income')"
                        v-b-modal.modalotherincome variant="secondary" size="xl" class="icon-button">
                           <svg class="mt-n1 text-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                              <g id="SVGRepo_iconCarrier">
                                 <title></title>
                                 <g id="Complete">
                                    <g data-name="add" id="add-2">
                                    <g>
                                       <line fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="12" x2="12" y1="19" y2="5"></line>
                                       <line fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" x1="5" x2="19" y1="12" y2="12"></line>
                                    </g>
                                    </g>
                                 </g>
                              </g>
                           </svg>
                        </b-button>
                     </div>
                  </card-with-button>
               </b-colxx>
            </b-row>
         </b-colxx>
         <b-colxx md="12" xl="8">
            <Transition name="fade" mode="out-in">
               <component :is="activeComponent" ref="tableData" @mounted-income-length="getIncomeCount" @mounted-cost-length="getCostCount"></component>
            </Transition>
         </b-colxx>
      </b-row>
      <add-other-cost @added-data-table="onAddedCostTable" :key="compCostKey"></add-other-cost>
      <add-other-income @added-data-table="onAddedIncomeTable" :key="compIncomeKey"></add-other-income>
   </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script>
import axios from 'axios'
import { apiUrl } from "../../../constants/config";
import CardWithButton from "../../../components/Cards/CardWithButton";
import TabAdditionalCost from "../../../containers/tabs/additional/TabAdditionalCost";
import TabAdditionalIncome from "../../../containers/tabs/additional/TabAdditionalIncome";
import AddOtherCost from "../../../containers/pages/AddOtherCost"
import AddOtherIncome from "../../../containers/pages/AddOtherIncome"

export default {
   components: {
      "card-with-button": CardWithButton,
      "tab-additional-cost": TabAdditionalCost,
      "tab-additional-income": TabAdditionalIncome,
      "add-other-cost": AddOtherCost,
      "add-other-income": AddOtherIncome
   },
   data() {
      return {
         activeComponent: 'tab-additional-cost',
         costCount: 0,
         incomeCount: 0,
         compCostKey: 0,
         compIncomeKey: 1
         
      }
   },
   methods: {
      getTab(n) {
         this.activeComponent = n
      },
      onAddedCostTable() {
        this.compCostKey++;
        this.$refs.tableData.refreshTable();
      },
      onAddedIncomeTable() {
        this.compIncomeKey++;
        this.$refs.tableData.refreshTable();
      },
      fetchIncomeData() {
         let url = apiUrl + "/otherincome?per_page=99"
         axios
            .get(url)
            .then(r => r.data)
            .then(res =>  {
               this.incomeCount = res.data.data.length
            }).catch(_error => {
               console.log(_error)
            })
      },
      getCostCount(val) {
         this.costCount = val
      },
      getIncomeCount(val) {
         this.incomeCount = val
      }
      
   },
   watch: {
      costCount(newId, oldId) {
         if (newId) {
            return newId;
         }
      },
      incomeCount(newId, oldId) {
         if (newId) {
            return newId;
         }
      }
  },
  mounted() {
   this.fetchIncomeData()
  }
}
</script>