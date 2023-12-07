<template>
  <b-row>
    <datatable-heading :title="$t('menu.all-contracts')" :changePageSize="changePageSize" :searchChange="searchChange"
      :from="from" :to="to" :total="total" :perPage="perPage" :separator="true">
      <div class="top-right-button-container">
        <b-button v-show="isLoad" v-b-modal.modalright variant="primary" size="lg" class="top-right-button text-uppercase">{{ $t('contract.add-new')
        }}</b-button>
      </div>
      <add-new-contract @added-data-table="onAddedDataTable" :key="componentKey"/>
    </datatable-heading>
    <b-colxx v-show="isLoad" xxs="12">
      <vuetable ref="vuetable" class="table-divided order-with-arrow responsive-table" :api-url="apiBase"
        :query-params="makeQueryParams" :per-page="perPage" :reactive-api-url="true" :fields="fields"
        data-path="data.data" pagination-path="data" @vuetable:pagination-data="onPaginationData">
        <template slot="status" slot-scope="props">
          <b-badge v-show="props.rowData.next_step_status_sales === 'Hired'" pill variant="primary">{{ props.rowData.next_step_status_sales }}</b-badge>
          <b-badge v-show="props.rowData.next_step_status_sales === 'Innactive'" pill variant="light">{{ props.rowData.next_step_status_sales }}</b-badge>
          <b-badge v-show="props.rowData.next_step_status_sales === 'Sold'" pill variant="dark">{{ props.rowData.next_step_status_sales }}</b-badge>
        </template>
        <template slot="actions" slot-scope="props">
          <div v-if="props.rowData.next_step_status_sales !== 'Hired'" >
            <b-button @click.prevent="showRehireModal(props.rowData.id)" variant="light" size="sm" class="mr-1"><i class="simple-icon-magnifier" /></b-button>
            <b-button @click="showDelModal(props.rowData.id)" v-b-modal.modalDeletion variant="danger" size="sm"><i class="simple-icon-trash mr-1" />  Delete</b-button>
          </div>
          <div v-else>
            <b-button :to="{ path: `${props.rowData.id}` }" variant="light" size="sm" class="mr-1"><i class="simple-icon-pencil" /></b-button>
            <b-button @click="showDelModal(props.rowData.id)" v-b-modal.modalDeletion variant="danger" size="sm"><i class="simple-icon-trash mr-1" />  Delete</b-button>
          </div>
        </template>
      </vuetable>
      <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
      <delete-item-modal :selectedItem="selectedItem" :endpoint="'/salesorder/'" @delete-modal-hide="updateTableRow"></delete-item-modal>
      <view-rehire-contract ref="rehireModal" @added-data-table="onAddedDataTable" :key="componentKey"/>
    </b-colxx>
    <b-colxx v-if="fullyLoaded" xxs="12">
      <b-card class="card-placeholder align-items-center" :class="(isLoad)?'':'show'">
        <b-row>
            <b-colxx md="4">
              <img src="/assets/img/cards/big-2.png" alt="No items" class="img-fluid">
            </b-colxx>
            <b-colxx md="6" class="text-white d-flex flex-column justify-content-center">
              <div class="px-md-5 mt-3 mt-md-0">
                  <h2 class="font-weight-bold align-text-bottom lead">No contracts found!</h2>
                  <p class="mb-5">Start adding your first contract</p>
                  <b-button v-b-modal.modalright size="xl" variant="light default" class="placeholder-button">{{ $t('contract.add-new') }}</b-button>
              </div>
            </b-colxx>
        </b-row>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import axios  from "axios";
import { apiUrl } from "../../../constants/config";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import DatatableHeading from "../../../containers/datatable/DatatableHeading";
import AddNewContract from "../../../containers/pages/AddNewContract";
import ViewRehireContract from "../../../containers/pages/ViewRehireContract";
import DeleteItemModal from "../../../containers/pages/DeleteItemModal";

export default {
  props: ["title"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading,
    "add-new-contract": AddNewContract,
    "view-rehire-contract": ViewRehireContract,
    "delete-item-modal": DeleteItemModal
  },
  data() {
    return {
      isLoad: false,
      fullyLoaded: false,
      apiBase: apiUrl + "/salesorder",
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
      selectedItem: null,
      componentKey: 0,
      fields: [
        {
          name: "agreement_number",
          sortField: "agreement_number",
          title: "Aggrement Number",
          titleClass: "center aligned",
          dataClass: "text-uppercase list-item-heading",
          width: "10%"
        },
        {
          name: "vehicle_registration",
          sortField: "vehicle_registration",
          title: "Assigned Vehicle",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "cust_name",
          sortField: "cust_name",
          title: "Customer Name",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "term_months",
          sortField: "term_months",
          title: "Contract Period (Months)",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "12%"
        },
        {
          name: "contract_start_date",
          sortField: "contract_start_date",
          title: "Start Date",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "12%"
        },
        {
          name: "__slot:status",
          sortField: "next_step_status_sales",
          title: "Status",
          titleClass: "center aligned text-center",
          dataClass: "center aligned text-center",
          width: "12%"
        },
        {
          name: "__slot:actions",
          title: "",
          titleClass: "",
          dataClass: "center aligned text-right",
          width: "18%"
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
      let url = apiUrl + "/salesorder?per_page=1"
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
      this.selectedItems = [];
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
    onAddedDataTable() {
      this.componentKey++;
      this.updateTableRow()
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
    showRehireModal(id) {
      this.$refs.rehireModal.fetchData(id);
    },
    showDelModal(id) {
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