<template>
   <div>
      <datatable-heading :title="$t('menu.available-stock')" :changePageSize="changePageSize"
      :searchChange="searchChange" :from="from" :to="to" :total="total" :perPage="perPage" :separator="true" />
      <div v-if="isSaving" class="loading-overlay card-img-overlay">
        <div class="loading"></div>
      </div>
      <b-row :class="isSaving ? 'disabled' : ''">
         <b-colxx xxs="12">
            <b-card>
               <vuetable ref="vuetable" class="order-with-arrow colored" :api-url="apiBase"
                  :query-params="makeQueryParams" :per-page="perPage" :reactive-api-url="true" :fields="fields"
                  data-path="data.data"
                  pagination-path="data"
                  :row-class="onRowClass"
                  @vuetable:pagination-data="onPaginationData">
                  <!-- <template slot="date" slot-scope="props">
                     <span>
                        {{ props.rowData.tgl_available | datetime }}
                     </span>
                     <b-button
                        v-b-modal.modalright
                        variant="outline-secondary"
                        size="sm"
                     >
                        <i class="simple-icon-magnifier mr-1" />
                        <span>{{ $t('pages.details') }}</span>
                     </b-button>
                  </template> -->
                  <template slot="stock_status" slot-scope="props">
                    <b-input-group>
                      <v-select @input="changeStatus(props.rowData)" :options="statusOptions" v-model="props.rowData.stock_status" :value="props.rowData.stock_status"  :searchable="false"/>
                    </b-input-group>
                  </template>
                  <!-- <template slot="status" slot-scope="props">
                     <b-badge v-show="props.rowData.status_next_step === 'Available'" pill variant="primary">{{ props.rowData.status_next_step }}</b-badge>
                     <b-badge v-show="props.rowData.status_next_step === 'Hired'" pill variant="light">{{ props.rowData.status_next_step }}</b-badge>
                     <b-badge v-show="props.rowData.status_next_step === 'Sold'" pill variant="dark">{{ props.rowData.status_next_step }}</b-badge>
                  </template> -->
                  <template slot="action" slot-scope="props">
                     <b-button :to="{ path: `${props.rowData.id}` }"
                     variant="dark"
                     size="sm"
                     >
                     <i class="simple-icon-magnifier mr-1" />  {{ $t('contract.detail') }}
                     </b-button>
                  </template>
               </vuetable>
            </b-card>
            <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
         </b-colxx>
      </b-row>
   </div>
</template>
<script>
import axios from 'axios';
import moment from "moment";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import { apiUrl } from "../../../constants/config";
import DatatableHeading from "../../../containers/datatable/DatatableHeading";

export default {
   props: ["title"],
   components: {
      vuetable: Vuetable,
      "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
      "v-select": vSelect,
      "datatable-heading": DatatableHeading
   },
   filters: {
      datetime: function (date) {
         return moment(date).format("LL")
         // return moment(date).startOf('day').fromNow()
      }
   },
   data() {
      return {
         isLoad: false,
         apiBase: apiUrl + "/availablestock",
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
         isSaving: false,
         statusOptions: [
           "Potential",
           "Available",
           "Booked"
         ],
         fields: [
            {
               name: "vehicle_registration",
               sortField: "vehicle_registration",
               title: "Registration",
               titleClass: "center aligned",
               dataClass: "list-item-heading text-uppercase center-aligned"
            },
            {
               name: "vehicle_manufactur",
               sortField: "vehicle_manufactur",
               title: "Manufacturer",
               titleClass: "center aligned",
               dataClass: "center-aligned"
            },
            {
               name: "vehicle_model",
               sortField: "vehicle_model",
               title: "Model",
               titleClass: "center aligned",
               dataClass: "center-aligned"
            },
            {
               name: "vehicle_variant",
               sortField: "vehicle_variant",
               title: "Variant",
               titleClass: "center aligned",
               dataClass: "center-aligned"
            },
            {
               name: "colour",
               sortField: "colour",
               title: "Colour",
               titleClass: "center aligned",
               dataClass: "center-aligned"
            },
            {
               name: "min_contract_price_satu",
               sortField: "min_contract_price_satu",
               title: "10K MPA",
               titleClass: "center aligned",
               dataClass: "center-aligned"
            },
            {
               name: "min_contract_price_dua",
               sortField: "min_contract_price_dua",
               title: "18K MPA",
               titleClass: "center aligned",
               dataClass: "center-aligned"
            },
            {
               name: "__slot:stock_status",
               sortField: "stock_status",
               title: "Status",
               titleClass: "center aligned",
               dataClass: "center-aligned",
               width: "18%"
            },
            // {
            //    name: "__slot:date",
            //    sortField: "tgl_available",
            //    title: "Available Date",
            //    titleClass: "center aligned",
            //    dataClass: "center-aligned"
            // },
            // {
            //    name: "__slot:status",
            //    sortField: "status_next_step",
            //    title: "Status",
            //    titleClass: "center aligned text-center",
            //    dataClass: "text-center",
            //    width: "10%"
            // },
            {
               name: "__slot:action",
               title: "",
               titleClass: "",
               dataClass: "text-right center-aligned"
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
      onRowClass(dataItem, index) {
        // const itemId = dataItem.id;
        // let itemsForToggle = this.items;
        // var rowClass = this.getIndex(itemId, itemsForToggle, "id");
        if(dataItem.stock_status == "Available") {
          return "light-success";
        } else if (dataItem.stock_status == "Booked") {
          return "light-danger";
        }
        return "light-warning";
        // console.log(rowClass);
        // if (this.selectedItems.includes(dataItem.id)) {
        //   return "selected";
        // }
        // return "";
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
      selectAll(isToggle) {
         if (this.selectedItems.length >= this.items.length) {
            if (isToggle) this.selectedItems = [];
         } else {
            this.selectedItems = this.items.map(x => x.id);
         }
      },
      addNotification(type, title, message) {
        this.$notify(type, title, message, { duration: 2000, permanent: false });
      },
      getIndex(value, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i][prop] === value) {
            return i;
          }
        }
        return -1;
      },
      changeStatus(obj) {
        const newData = {
          stock_status: obj.stock_status,
        }
        let url = apiUrl + "/changestockstatus/" + obj.id;
        // console.log(`edit${obj.id} with ${newData}`);
        axios
          .put(url, newData)
          .then(r => r.data)
          .then(res => {
            this.isSaving = true;
            this.status = "success filled";
            this.message = "Your data was saved!";
            setTimeout(() => {
              this.isSaving = false;
              this.$refs.vuetable.refresh();
            }, 1000)
          }).catch(_error => {
            this.status = "error filled";
            this.message = "An error occured while saving the data. Please try again later.";
            this.addNotification(this.status, "Oppss!", this.message);
          })
      }
   }
};
</script>
