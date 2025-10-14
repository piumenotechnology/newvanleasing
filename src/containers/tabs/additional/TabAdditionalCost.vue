<template>
  <b-card>
    <datatable-heading :title="$t('additional.cost')" :changePageSize="changePageSize"
    :searchChange="searchChange" :from="from" :to="to" :total="total" :perPage="perPage" :separator="true" :noBreadcrumbs="true" />
    <vuetable
        ref="vuetable"
        class="responsive-table"
        :api-url="apiBase"
        :fields="fields"
        :query-params="makeQueryParams"
        :per-page="perPage"
        pagination-path="data"
        data-path="data.data"
        @vuetable:pagination-data="onPaginationData"
    >
        <template slot="action" slot-scope="props">
            <div class="d-flex justify-content-end align-items-center">
                <b-button v-if="$can('cost_income.update')" @click="editItem(props.rowData)" variant="light" class="mr-2" size="sm"><i class="simple-icon-pencil" /></b-button>
                <b-button v-if="$can('cost_income.delete')" @click="deleteItem(props.rowData.id)" v-b-modal.modalDeletion variant="danger" size="sm"><i class="simple-icon-trash" /></b-button>
            </div>
        </template>
    </vuetable>
    <vuetable-pagination-bootstrap ref="pagination" @vuetable-pagination:change-page="onChangePage" />
    <edit-other-cost ref="editForm" @added-data-table="onAddedDataTable" :key="costKey" />
    <delete-item-modal :selectedItem="selectedItem" :endpoint="'/othercost/'" @delete-modal-hide="refreshTable" />
  </b-card>
</template>
<script>
import Vuetable from "vuetable-2/src/components/Vuetable";
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import { apiUrl } from "../../../constants/config";
import DeleteItemModal from "../../pages/DeleteItemModal";
import EditOtherCost from "../../pages/EditOtherCost";
import DatatableHeading from "../../../containers/datatable/DatatableHeading";

export default {
  props: ["title"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "delete-item-modal": DeleteItemModal,
    "edit-other-cost": EditOtherCost,
    "datatable-heading": DatatableHeading
  },
  data() {
    return {
        apiBase: apiUrl + "/othercost",
        sort: "",
        order: "",
        page: 1,
        perPage: 8,
        from: 0,
        to: 0,
        total: 0,
        lastPage: 0,
        costKey: 0,
        items: [],
        selectedItem: "",
        fields: [{
            name: "date",
            sortField: "date",
            title: "Date",
            titleClass: "center aligned",
            dataClass: "text-muted",
          },
          {
            name: "vehicle_registration",
            sortField: "vehicle_registration",
            title: "Vehicle Number",
            titleClass: "center aligned",
            dataClass: "text-muted",
          },
          {
            name: "description_expenses",
            sortField: "description_expenses",
            title: "Expenses Description",
            titleClass: "center aligned",
            dataClass: "text-muted",
            width: "20%"
          },
          {
            name: "vendor_name",
            sortField: "vendor_name",
            title: "Vendor Name",
            titleClass: "center aligned",
            dataClass: "text-muted",
          },
          {
            name: "amount_oc",
            sortField: "amount_oc",
            title: "Amount (GBP)",
            titleClass: "center aligned",
            dataClass: "text-muted",
          },
          {
            name: "__slot:action",
            title: "",
            titleClass: "",
            dataClass: "pt-3",
            width: "15%"
          }
        ],
        sortOrder: [
          {
            field: 'created_at',
            direction: 'desc'
          }
        ]
    }
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
        this.items = paginationData.data;
        // this.$emit("mounted-cost-length", this.items.length);
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
      this.refreshTable();
    },
    onAddedDataTable() {
        this.costKey++;
        this.refreshTable();
    },
    editItem(items) {
        this.$refs.editForm.getEditData(items);
    },
    deleteItem(id) {
        this.selectedItem = id;
    },
    refreshTable() {
        this.$refs.vuetable.refresh();
    }
  }
}

</script>
