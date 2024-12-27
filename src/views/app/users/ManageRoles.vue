<template>
  <b-row>
    <b-colxx xxs="12" class="mb-4">
      <piaf-breadcrumb :heading="$t('menu.manage-roles')" />
      <div v-if="$can('create', 'vehicle')" class="top-right-button-container">
        <b-button v-show="isLoad" v-b-modal.modalrole variant="primary" size="lg" class="top-right-button text-uppercase">{{ $t('pages.add-new')}}</b-button>
      </div>
      <add-new-role @added-data-table="onAddedDataTable" :key="componentKey"/>
    </b-colxx>
    <b-colxx v-show="isLoad" xxs="12">
      <vuetable ref="vuetable" class="table-divided order-with-arrow responsive-table" :api-url="apiBase"
        :query-params="makeQueryParams" :per-page="perPage" :reactive-api-url="true" :fields="fields"
        data-path="data.data" pagination-path="data" @vuetable:pagination-data="onPaginationData">
        <template slot="actions" slot-scope="props">
          <div>
            <b-button v-if="$can('update', 'permissions')" :to="{ path: `${props.rowData.name.toLowerCase()}` }" variant="dark" class="mr-1" size="sm"><i class="simple-icon-user-following mr-2" />Assign permissions</b-button>
            <b-button v-if="$can('update', 'roles')" @click="editItem(props.rowData)" variant="light" class="mr-1" size="sm"><i class="simple-icon-pencil mr-2" />Edit</b-button>
            <b-button v-if="$can('delete', 'roles')" @click="showDelModal(props.rowData.id)" v-b-modal.modalDeletion variant="danger" size="sm">Delete <i class="simple-icon-trash" /></b-button>
          </div>
        </template>
      </vuetable>
      <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
      <edit-role ref="editRoleForm" @added-data-table="onAddedDataTable"/>
      <delete-item-modal :selectedItem="selectedItem" :endpoint="'/deleterole/'" @delete-modal-hide="updateTableRow"></delete-item-modal>
    </b-colxx>
    <b-colxx v-if="fullyLoaded" xxs="12">
      <b-card class="card-placeholder align-items-center" :class="(isLoad)?'':'show'">
        <b-row>
            <b-colxx md="4">
              <img src="/assets/img/cards/big-2.png" alt="No items" class="img-fluid">
            </b-colxx>
            <b-colxx md="6" class="text-white d-flex flex-column justify-content-center">
              <div class="px-md-5 mt-3 mt-md-0">
                  <h2 class="font-weight-bold align-text-bottom lead">No role found!</h2>
                  <p class="mb-5">Start adding role</p>
                  <b-button v-b-modal.modalrole size="xl" variant="light default" class="placeholder-button">{{ $t('user.add-role') }}</b-button>
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
import AddNewRole from "../../../containers/pages/AddNewRole";
import EditRole from "../../../containers/pages/EditRole";
import DeleteItemModal from "../../../containers/pages/DeleteItemModal";

export default {
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading,
    "add-new-role": AddNewRole,
    "edit-role": EditRole,
    "delete-item-modal": DeleteItemModal
  },
  data() {
    return {
      isLoad: false,
      fullyLoaded: false,
      apiBase: apiUrl + "/getroles",
      sort: "",
      order: "",
      page: 1,
      perPage: 8,
      search: "",
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      selectedItem: null,
      componentKey: 0,
      fields: [
        {
          name: "name",
          sortField: "name",
          title: "Name",
          titleClass: "center aligned",
          dataClass: "list-item-heading",
          width: "20%"
        },
        {
          name: "__slot:actions",
          title: "Actions",
          titleClass: "text-right",
          dataClass: "center aligned text-right",
        }
      ],
      sortOrder: [
        {
          field: 'name',
          sortField: "name",
          direction: 'desc'
        }
      ]
    };
  },

  methods: {
    fetchData() {
      let url = apiUrl + "/getroles?per_page=1"
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
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },
    onAddedDataTable() {
      this.componentKey++;
      this.updateTableRow()
    },
    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    },
    showDelModal(id) {
      this.selectedItem = id;
    },
    updateTableRow() {
      this.fetchData()
      this.$refs.vuetable.refresh();
    },
    editItem(items) {
      this.$refs.editRoleForm.getEditData(items);
    },
  },
  mounted() {
    this.fetchData()
  }
};
</script>
