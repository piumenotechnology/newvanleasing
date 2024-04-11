<template>
    <b-row>
      <datatable-heading :title="$t('contract.all-return')" :changePageSize="changePageSize" :searchChange="searchChange"
        :from="from" :to="to" :total="total" :perPage="perPage" :separator="false" :noBreadcrumbs="true">
        <div class="top-right-button-container">
          <b-button :disabled="noReturn" v-b-modal.modalright variant="primary" size="lg" class="top-right-button text-uppercase">{{ $t('contract.add-return') }}</b-button>
        </div>
        <add-return-contract @added-data-table="onAddedDataTable" :key="componentKey"/>
      </datatable-heading>
      <b-colxx xxs="12">
        <b-card>
          <vuetable ref="vuetable" class="order-with-arrow responsive-table" :api-url="apiBase" :query-params="makeQueryParams"
            :per-page="perPage" :reactive-api-url="true" :fields="fields" data-path="data.data" pagination-path="data"
            @vuetable:pagination-data="onPaginationData">
            <template slot="date" slot-scope="props">
              <span>
                {{ props.rowData.vehicle_return_date | datetime }}
              </span>
            </template> 
            <template slot="action" slot-scope="props">
              <div>
                <b-button @click="openEditModal(props.rowData)" variant="light" class="mr-1" size="sm"><i class="simple-icon-pencil" /></b-button>
                <b-button @click="getSelectedItem(props.rowData.id)" v-b-modal.modalDeletion variant="danger" size="sm">Delete <i class="simple-icon-trash" /></b-button>
              </div>
            </template>
          </vuetable>
        </b-card>
        <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
      </b-colxx>
      <edit-return-contract ref="editForm" @added-data-table="onAddedDataTable" :key="componentKey"/>
      <delete-item-modal :selectedItem="selectedItem" :endpoint="'/rehiringorder/'" @delete-modal-hide="updateTableRow" />
    </b-row>
  </template>
  <script>
  import axios from "axios";
  import { apiUrl } from "../../../constants/config";
  import moment from "moment";
  import Vuetable from "vuetable-2/src/components/Vuetable";
  import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
  import DatatableHeading from "../../datatable/DatatableHeading";
  import AddReturnContract from "../../pages/AddReturnContract";
  import EditReturnContract from "../../pages/EditReturnContract";
  import DeleteItemModal from "../../pages/DeleteItemModal";
  
  export default {
    props: ["title"],
    components: {
      vuetable: Vuetable,
      "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
      "datatable-heading": DatatableHeading,
      "add-return-contract": AddReturnContract,
      "edit-return-contract": EditReturnContract,
      "delete-item-modal": DeleteItemModal
    },
    data() {
      return {
        isLoad: false,
        noReturn: false,
        apiBase: apiUrl + "/rehiringorder",
        sort: "",
        order: "",
        page: 1,
        perPage: 8,
        search: "",
        from: 0,
        to: 0,
        total: 0,
        lastPage: 0,
        returnCount: "",
        selectedItem: "",
        componentKey: 0,
        fields: [
          {
            name: "vehicle_registration",
            sortField: "vehicle_registration",
            title: "Vehicle Registration",
            titleClass: "center aligned",
            dataClass: "align-middle list-item-heading",
            width: "15%"
          },
          {
            name: "new_sales_order_no",
            sortField: "new_sales_order_no",
            title: "Sales Order Number",
            titleClass: "center aligned",
            dataClass: "align-middle text-muted",
            width: "15%"
          },
          {
            name: "agreement_number",
            sortField: "agreement_number",
            title: "Agreement Number",
            titleClass: "center aligned",
            dataClass: "align-middle text-muted text-uppercase",
            width: "15%"
          },
          {
            name: "__slot:date",
            sortField: "vehicle_return_date",
            title: "Vehicle Return Date",
            titleClass: "center aligned",
            dataClass: "align-middle text-muted",
            width: "15%"
          },
          {
            name: "__slot:action",
            title: "",
            titleClass: "",
            dataClass: "center aligned align-text-top text-right",
            width: "15%"
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
    filters: {
      datetime: function(date) {
        return moment(date).format('LL')
      }
    },
    methods: {
      fetchRehiring() {
        let url = apiUrl + "/showagreementnumberinrehiring";
        axios
          .get(url)
          .then(r => r.data)
          .then(res =>  {
            this.noReturn = false
          }).catch(_error => {
            this.noReturn = true
            console.log("Can't add data!")
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
        // this.items = paginationData.data;
        // this.itemsCount = this.items.length;
        this.$emit("mounted-return-tab", this.total);
        this.$refs.pagination.setPaginationData(paginationData);
      },
      onChangePage(page) {
        this.$refs.vuetable.changePage(page);
      },
      onAddedDataTable() {
        this.componentKey++;
        this.$refs.vuetable.refresh();
      },
      changePageSize(perPage) {
        this.perPage = perPage;
        this.$refs.vuetable.refresh();
      },
      openEditModal(obj) {
        this.$refs.editForm.getReturnData(obj);
      },
      getSelectedItem(id) {
        this.selectedItem = id;
      },
      searchChange(val) {
        this.search = val;
        this.$refs.vuetable.refresh();
      },
      updateTableRow() {
        this.$refs.vuetable.refresh();
      }
    },
    mounted() {
      this.fetchRehiring()
    }
  };
  </script>
