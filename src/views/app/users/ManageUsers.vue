<template>
  <b-row>
    <datatable-heading :title="$t('menu.manage-users')" :changePageSize="changePageSize" :searchChange="searchChange"
      :from="from" :to="to" :total="total" :perPage="perPage" :separator="true">
      <div v-if="$can('create', 'user')" class="top-right-button-container">
        <b-button v-show="isLoad" v-b-modal.modaluser variant="primary" size="lg" class="top-right-button text-uppercase">{{ $t('pages.add-new')}}</b-button>
      </div>
      <add-new-user @added-data-table="onAddedDataTable" :key="componentKey"/>
    </datatable-heading>
    <b-colxx v-show="isLoad" xxs="12">
      <vuetable ref="vuetable" class="table-divided order-with-arrow responsive-table" :api-url="apiBase"
        :query-params="makeQueryParams" :per-page="perPage" :reactive-api-url="true" :fields="fields"
        data-path="data.data" pagination-path="data" @vuetable:pagination-data="onPaginationData">
        <template slot="actions" slot-scope="props">
          <div>
            <b-button v-if="$can('update', 'user')" @click="editItem(props.rowData)" variant="light" class="mr-1" size="sm"><i class="simple-icon-pencil mr-2" />Edit</b-button>
            <b-button v-if="$can('delete', 'user')" @click="showDelModal(props.rowData.id)" v-b-modal.modalDeletion variant="danger" size="sm">Delete <i class="simple-icon-trash" /></b-button>
          </div>
        </template>
      </vuetable>
      <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
      <edit-user ref="editUserForm" @added-data-table="onAddedDataTable"/>
      <delete-item-modal :selectedItem="selectedItem" :endpoint="'/user/'" @delete-modal-hide="updateTableRow"></delete-item-modal>
    </b-colxx>
    <b-colxx v-if="fullyLoaded" xxs="12">
      <b-card class="card-placeholder align-items-center" :class="(isLoad)?'':'show'">
        <b-row>
            <b-colxx md="4">
              <img src="/assets/img/cards/big-2.png" alt="No items" class="img-fluid">
            </b-colxx>
            <b-colxx md="6" class="text-white d-flex flex-column justify-content-center">
              <div class="px-md-5 mt-3 mt-md-0">
                  <h2 class="font-weight-bold align-text-bottom lead">No users found!</h2>
                  <p class="mb-5">Start adding user</p>
                  <b-button v-b-modal.modaluser size="xl" variant="light default" class="placeholder-button">{{ $t('user.add-new') }}</b-button>
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
import AddNewUser from "../../../containers/pages/AddNewUser";
import EditUser from "../../../containers/pages/EditUser";
import DeleteItemModal from "../../../containers/pages/DeleteItemModal";

export default {
  props: ["title"],
  components: {
    vuetable: Vuetable,
    "vuetable-pagination-bootstrap": VuetablePaginationBootstrap,
    "datatable-heading": DatatableHeading,
    "add-new-user": AddNewUser,
    "edit-user": EditUser,
    "delete-item-modal": DeleteItemModal
  },
  data() {
    return {
      isLoad: false,
      fullyLoaded: false,
      apiBase: apiUrl + "/getallusers",
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
          name: "username",
          sortField: "username",
          title: "Username",
          titleClass: "center aligned",
          dataClass: "text-uppercase list-item-heading",
        },
        {
          name: "position",
          sortField: "position",
          title: "Role",
          titleClass: "center aligned",
          dataClass: "text-muted",
          width: "15%"
        },
        {
          name: "__slot:actions",
          title: "Actions",
          titleClass: "text-right",
          dataClass: "center aligned text-right",
          width: "25%"
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
      let url = apiUrl + "/getallusers?per_page=1"
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
    showDelModal(id) {
      this.selectedItem = id;
    },
    updateTableRow() {
      this.fetchData()
      this.$refs.vuetable.refresh();
    },
    editItem(items) {
      this.$refs.editUserForm.getEditData(items);
    },
  },
  mounted() {
    this.fetchData()
  }
};
</script>
