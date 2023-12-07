<template>
   <div>
      <datatable-heading :title="$t('menu.available-stock')" :changePageSize="changePageSize"
      :searchChange="searchChange" :from="from" :to="to" :total="total" :perPage="perPage" :separator="true" />

      <b-row>
         <b-colxx xxs="12">
            <b-card>
               <vuetable ref="vuetable" class="order-with-arrow" :api-url="apiBase"
                  :query-params="makeQueryParams" :per-page="perPage" :reactive-api-url="true" :fields="fields"
                  data-path="data.data"
                  pagination-path="data"
                  @vuetable:pagination-data="onPaginationData">
                  <template slot="date" slot-scope="props">
                     <span>
                        {{ props.rowData.tgl_available | datetime }}
                     </span>
                     <!-- <b-button
                        v-b-modal.modalright
                        variant="outline-secondary"
                        size="sm"
                     >
                        <i class="simple-icon-magnifier mr-1" />
                        <span>{{ $t('pages.details') }}</span>
                     </b-button> -->
                  </template>
                  <template slot="action" slot-scope="props">
                     <b-button :to="{ path: `${props.rowData.id}` }"
                     variant="light"
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
import moment from "moment";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import { apiUrl } from "../../../constants/config";
import DatatableHeading from "../../../containers/datatable/DatatableHeading";

export default {
   props: ["title"],
   components: {
      vuetable: Vuetable,
      "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
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
         fields: [
            {
               name: "vehicle_registration",
               sortField: "vehicle_registration",
               title: "Vehicle Registration",
               titleClass: "center aligned",
               dataClass: "list-item-heading text-uppercase"
            },
            {
               name: "vehicle_manufactur",
               sortField: "vehicle_manufactur",
               title: "Manufacture",
               titleClass: "center aligned",
               dataClass: "text-muted"
            },
            {
               name: "vehicle_model",
               sortField: "vehicle_model",
               title: "Model",
               titleClass: "center aligned",
               dataClass: "text-muted"
            },
            {
               name: "vehicle_variant",
               sortField: "vehicle_variant",
               title: "Variant",
               titleClass: "center aligned",
               dataClass: "text-muted"
            },
            {
               name: "__slot:date",
               sortField: "tgl_available",
               title: "Available Date",
               titleClass: "center aligned",
               dataClass: ""
            },
            {
               name: "__slot:action",
               title: "",
               titleClass: "",
               dataClass: "center aligned align-text-top text-right"
            }
         ],
         sortOrder: [
            {
               field: 'updated_at',
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
                  ? sortOrder[0].field
                  : "",
               page: currentPage,
               per_page: this.perPage,
               search: this.search
            }
            : {
               page: currentPage,
               per_page: this.perPage,
               order: this.sortOrder[0].direction,
               sort: this.sortOrder[0].field,
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

      selectAll(isToggle) {
         if (this.selectedItems.length >= this.items.length) {
            if (isToggle) this.selectedItems = [];
         } else {
            this.selectedItems = this.items.map(x => x.id);
         }
      }
   }
};
</script>