<template>
   <b-row>
      <datatable-heading :title="$t('menu.all-vehicles')"  :changePageSize="changePageSize"
         :searchChange="searchChange" :from="from" :to="to" :total="total" :perPage="perPage" :separator="true">
         <div class="top-right-button-container">
            <b-button
               v-show="isLoad"
               v-b-modal.modallg
               variant="primary"
               size="lg"
               class="top-right-button"
            >{{ $t('pages.add-new') }}</b-button>
         </div>
         <add-new-vehicle @added-data-table="updateTableRow"/>
      </datatable-heading>
      <b-colxx v-show="isLoad" xxs="12">
         <vuetable ref="vuetable" class="table-divided order-with-arrow responsive-table" :api-url="apiBase"
            :query-params="makeQueryParams" :per-page="perPage" :reactive-api-url="true" :fields="fields"
            data-path="data.data"
            pagination-path="data"
            displayEmptyDataRow
            @vuetable:pagination-data="onPaginationData">
            <template slot="status" slot-scope="props">
               <b-badge v-show="props.rowData.status_next_step === 'Available'" pill variant="primary">{{ props.rowData.status_next_step }}</b-badge>
               <b-badge v-show="props.rowData.status_next_step === 'Hired'" pill variant="light">{{ props.rowData.status_next_step }}</b-badge>
               <b-badge v-show="props.rowData.status_next_step === 'Sold'" pill variant="dark">{{ props.rowData.status_next_step }}</b-badge>
            </template>
            <template slot="actions" slot-scope="props">
               <div>
                  <b-button :to="{ path: `${props.rowData.id}` }"
                     variant="light"
                     class="mr-1"
                     size="sm"><i class="simple-icon-pencil" /></b-button>
                  <b-button
                     @click="showDelBox(props.rowData.id)"
                     v-b-modal.modalDeletion
                     variant="danger"
                     size="sm"><i class="simple-icon-trash mr-1" />  Delete</b-button>
               </div>
            </template>
         </vuetable>
         <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
         <delete-item-modal :selectedItem="selectedItem" :endpoint="'/purchaseorder/'" @delete-modal-hide="updateTableRow"></delete-item-modal>
      </b-colxx>
      <b-colxx xxs="12" v-show="fullyLoaded">
         <b-card class="card-placeholder align-items-center" :class="(isLoad)?'':'show'">
            <b-row>
               <b-colxx md="4">
                  <img src="/assets/img/cards/big-1.png" alt="No items" class="img-fluid">
               </b-colxx>
               <b-colxx md="6" class="text-white d-flex flex-column justify-content-center">
                  <div class="px-md-5 mt-3 mt-md-0">
                     <h2 class="font-weight-bold align-text-bottom lead">No vehicles found!</h2>
                     <p class="mb-5">Start adding your first vehicle</p>
                     <b-button v-b-modal.modallg size="xl" variant="light default" class="placeholder-button">{{ $t('vehicle.add-new') }}</b-button>
                  </div>
               </b-colxx>
            </b-row>
         </b-card>
      </b-colxx>
   </b-row>
</template>
<script>
import axios from "axios";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import { apiUrl } from "../../../constants/config";
import DatatableHeading from "../../../containers/datatable/DatatableHeading";
import AddNewVehicle from "../../../containers/pages/AddNewVehicle";
import DeleteItemModal from "../../../containers/pages/DeleteItemModal";

export default {
   props: ["title"],
   components: {
      vuetable: Vuetable,
      "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
      "datatable-heading": DatatableHeading,
      "add-new-vehicle": AddNewVehicle,
      "delete-item-modal": DeleteItemModal
   },
   data() {
      return {
         isLoad: false,
         fullyLoaded: false,
         apiBase: apiUrl + "/purchaseorderall",
         sort: "",
         order: "",
         page: 1,
         perPage: 8,
         search: "",
         from: 0,
         to: 0,
         total: 0,
         lastPage: 0,
         items: [],
         selectedItem: [],
         fields: [
            {
               name: "vehicle_registration",
               sortField: "vehicle_registration",
               title: "Vehicle registration",
               titleClass: "center aligned",
               dataClass: "text-uppercase list-item-heading",
               width: "18%"
            },
            {
               name: "vehicle_manufactur",
               sortField: "vehicle_manufactur",
               title: "Manufacturer",
               titleClass: "center aligned",
               dataClass: "text-muted",
               width: "auto"
            },
            {
               name: "purchase_method",
               sortField: "purchase_method",
               title: "Funding method",
               titleClass: "center aligned",
               dataClass: "text-muted",
               width: "18%"
            },
            {
               name: "hire_purchase_starting_date",
               sortField: "hire_purchase_starting_date",
               title: "Purchase date",
               titleClass: "center aligned",
               dataClass: "text-muted",
               width: "15%"
            },
            {
               name: "__slot:status",
               sortField: "status_next_step",
               title: "Status",
               titleClass: "center aligned text-center",
               dataClass: "text-center",
               width: "10%"
            },
            {
               name: "__slot:actions",
               title: "",
               titleClass: "center aligned text-right",
               dataClass: "center aligned text-right",
               width: "20%"
            }
         ],
         sortOrder: [
            {
               field: 'updated_at',
               sortField: "updated_at",
               direction: 'desc'
            }
         ]
      };
   },
   methods: {
      fetchData() {
         let url = apiUrl + "/purchaseorderall?per_page=1"
         axios
         .get(url)
         .then(r => r.data)
         .then(res => {
            if(res.data.data.length > 0){
               this.isLoad = true
            }
         })
         .catch(err => {
            this.isLoad = false
            setTimeout(() => {
               this.fullyLoaded = true
            }, 300)
         })
      },
      makeQueryParams(sortOrder, currentPage, perPage) {
         this.isLoading = false;
         return sortOrder[0]
            ? {
               order: sortOrder[0]
                  ? sortOrder[0].direction
                  : "",
               sort: sortOrder[0]
                  ? sortOrder[0].sortField
                  : "",
               page: currentPage,
               per_page: this.perPage,
               search: this.search
            }
            : {
               page: currentPage,
               per_page: this.perPage,
               order: this.sortOrder[0].direction,
               sort: this.sortOrder[0].sortField,
               search: this.search
            };
      },
      onPaginationData(paginationData) {
         this.from = paginationData.from;
         this.to = paginationData.to;
         this.total = paginationData.total;
         this.lastPage = paginationData.last_page;
         this.items = paginationData.data;
         this.$refs.pagination.setPaginationData(paginationData);
      },
      onChangePage(page) {
         this.$refs.vuetable.changePage(page);
      },

      changePageSize(perPage) {
         this.perPage = perPage;
         this.$refs.vuetable.refresh();
      },
      searchChange(val) {
         this.search = val;
         this.$refs.vuetable.refresh();
      },
      getIndex(value, arr, prop) {
         for (var i = 0; i < arr.length; i++) {
            if (arr[i][prop] === value) {
               return i;
            }
         }
         return -1;
      },
      showDelBox(id) {
         this.selectedItem = id;
      },
      updateTableRow() {
         this.fetchData()
         this.$refs.vuetable.refresh();
      }
   },
   mounted() {
      this.fetchData()
   }
};
</script>
