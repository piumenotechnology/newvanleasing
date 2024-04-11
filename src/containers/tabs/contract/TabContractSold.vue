<template>
    <b-row>
      <datatable-heading :title="$t('contract.all-sold')" :changePageSize="changePageSize" :searchChange="searchChange"
        :from="from" :to="to" :total="total" :perPage="perPage" :separator="false" :noBreadcrumbs="true">
        <div class="top-right-button-container">
          <b-button :disabled="noDefleet" v-b-modal.modalsold variant="primary" size="lg" class="top-right-button text-uppercase">{{ $t('contract.add-sold') }}</b-button>
        </div>
        <add-sold-contract @added-data-table="onAddedDataTable" :key="componentKey"/>
      </datatable-heading>
      <b-colxx xxs="12">
        <b-card>
          <vuetable ref="vuetable" class="order-with-arrow responsive-table" :api-url="apiBase" :query-params="makeQueryParams"
            :per-page="perPage" :reactive-api-url="true" :fields="fields" data-path="data.data" pagination-path="data"
            @vuetable:pagination-data="onPaginationData">
            <template slot="price" slot-scope="props">
              <span>
                £ {{ props.rowData.sold_price | withcoma }}
              </span>
            </template>
            <template slot="date" slot-scope="props">
              <span>
                {{ props.rowData.vehicle_sold_date | datetime }}
              </span>
            </template> 
            <template slot="action" slot-scope="props">
              <div>
                <b-button @click="openEditModal(props.rowData)" variant="light" class="mr-1" size="sm"><i class="simple-icon-pencil" /></b-button>
                <b-button @click="getSelectedItem(props.rowData.id)" v-b-modal.deleteSold variant="danger" size="sm">Delete <i class="simple-icon-trash" /></b-button>
              </div>
            </template>
          </vuetable>
        </b-card>
        <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
      </b-colxx>
      <edit-sold-contract ref="editForm" @added-data-table="onAddedDataTable" :key="componentKey"/>
      <delete-sold-modal :selectedItem="selectedItem" :endpoint="'/vehiclesold/'" @delete-modal-hide="updateTableRow" />
    </b-row>
  </template>
  <script>
  import axios from "axios";
  import { apiUrl } from "../../../constants/config";
  import moment from "moment";
  import Vuetable from "vuetable-2/src/components/Vuetable";
  import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
  import DatatableHeading from "../../datatable/DatatableHeading";
  import AddSoldContract from "../../pages/AddSoldContract";
  import EditSoldContract from "../../pages/EditSoldContract";
  import DeleteSoldModal from "../../pages/DeleteSoldModal";
  
  export default {
    props: ["title"],
    components: {
      vuetable: Vuetable,
      "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
      "datatable-heading": DatatableHeading,
      "add-sold-contract": AddSoldContract,
      "edit-sold-contract": EditSoldContract,
      "delete-sold-modal": DeleteSoldModal
    },
    data() {
      return {
        isLoad: false,
        noDefleet: false,
        apiBase: apiUrl + "/vehiclesold",
        sort: "",
        order: "",
        page: 1,
        perPage: 8,
        search: "",
        from: 0,
        to: 0,
        total: 0,
        lastPage: 0,
        returnCount: 0,
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
            name: "__slot:price",
            sortField: "sold_price",
            title: "Sold Price",
            titleClass: "center aligned",
            dataClass: "align-middle text-muted",
            width: "15%"
          },
          {
            name: "__slot:date",
            sortField: "vehicle_sold_date",
            title: "Vehicle Sold Date",
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
      },
      withcoma: function(num) {
        return Number(num).toLocaleString()
      }
    },
    methods: {
      fetchDefleet() {
        let url = apiUrl + "/showagreementnumberinvehiclesold?per_page=8";
        axios
          .get(url)
          .then(r => r.data)
          .then(res =>  {
            this.noDefleet = false
            // let defleet = res.data.filter(x => (x.status_next_step !== 'Hired'))
            // if(defleet.length > 1) {
            //   this.noDefleet = false
            // } else {
            //   this.noDefleet = true
            // }
          }).catch(_error => {
            this.noDefleet = true
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
        this.$emit("mounted-sold-tab", this.total);
        this.$refs.pagination.setPaginationData(paginationData);
      },
      onChangePage(page) {
        this.$refs.vuetable.changePage(page);
      },
      onAddedDataTable() {
        this.componentKey++;
        this.fetchDefleet();
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
        this.fetchDefleet()
        this.$refs.vuetable.refresh();
      }
    },
    mounted() {
      this.fetchDefleet()
    }
  };
  </script>
