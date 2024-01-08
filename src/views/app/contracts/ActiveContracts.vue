<template>
  <b-row>
    <datatable-heading :title="$t('contract.active')" :changePageSize="changePageSize" :searchChange="searchChange"
      :from="from" :to="to" :total="total" :perPage="perPage" :separator="true">
      <div class="top-right-button-container">
        <b-button v-b-modal.modalright variant="primary" size="lg" class="top-right-button text-uppercase">{{ $t('contract.add-new') }}</b-button>
      </div>
      <add-new-contract @added-data-table="onAddedDataTable" :key="componentKey"/>
    </datatable-heading>
    <b-colxx xxs="12">
      <b-card>
        <vuetable ref="vuetable" class="order-with-arrow responsive-table" :api-url="apiBase" :query-params="makeQueryParams"
          :per-page="perPage" :reactive-api-url="true" :fields="fields" data-path="data.data" pagination-path="data"
          @vuetable:pagination-data="onPaginationData">
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
</template>
<script>
import axios  from "axios";
import { apiUrl } from "../../../constants/config";
import moment from "moment";
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import AddNewContract from "../../../containers/pages/AddNewContract";
import DatatableHeading from "../../../containers/datatable/DatatableHeading";

export default {
  props: ["title"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading,
    "add-new-contract": AddNewContract,
  },
  data() {
    return {
      apiBase: apiUrl + "/showactivesales",
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
      componentKey: 0,
      fields: [
        {
          name: "agreement_number",
          sortField: "agreement_number",
          title: "Agreement Number",
          titleClass: "center aligned",
          dataClass: "align-middle list-item-heading text-uppercase",
          width: "8%",
          
        },
        {
          name: "cust_name",
          sortField: "cust_name",
          title: "Customer Name",
          titleClass: "center aligned",
          dataClass: "align-middle text-muted",
          width: "15%"
        },
        {
          name: "vehicle_registration",
          sortField: "vehicle_registration",
          title: "Assigned Vehicle",
          titleClass: "center aligned",
          dataClass: "align-middle text-muted",
          width: "15%"
        },
        {
          name: "contract_start_date",
          sortField: "contract_start_date",
          title: "Contract Start Date",
          titleClass: "center aligned",
          dataClass: "align-middle",
          width: "15%",
        },
        {
          name: "__slot:action",
          title: "",
          titleClass: "",
          dataClass: "center aligned align-text-top text-right",
          width: "8%"
        }
      ],
      sortOrder: [
        {
          field: 'contract_start_date',
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
    onAddedDataTable() {
      this.componentKey++;
      this.$refs.vuetable.refresh();
    },
    searchChange(val) {
      this.search = val;
      this.$refs.vuetable.refresh();
    }
  }
};
</script>
