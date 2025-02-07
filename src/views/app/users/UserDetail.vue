<template>
  <div v-if="isLoading">
    <b-row v-if="roles.name != undefined">
      <b-colxx xxs="12" class="mb-4">
        <i class="simple-icon-user-following mr-2 text-large" />
        <piaf-breadcrumb v-if="isLoading" :heading="`Manage Permission | ${roles.name}`" />
        <div v-if="$can('create', 'vehicle')" class="top-right-button-container">
          <b-button v-if="$can('view', 'permissions')" :to="{ path: 'manage-roles' }" variant="light" class="mr-1" size="lg"><i class="simple-icon-arrow-left-circle mr-2" />BACK</b-button>
          <div class="top-right-button-container">
            <b-button
              variant="primary"
              size="lg"
              class="top-right-button"
              @click.prevent="updatePermissionsSubmit"
              :class="{
                'btn-multiple-state': true,
                'show-spinner': status === 'processing',
                'show-success': status === 'success',
                'show-fail': status === 'fail'
              }"
              :disabled="isProcessing != false"
              v-observe-visibility="visibilityChanged">
              <span class="spinner d-inline-block">
                <span class="bounce1"></span>
                <span class="bounce2"></span>
                <span class="bounce3"></span>
              </span>
              <span class="icon success">
                <i class="simple-icon-check"></i>
              </span>
              <span class="icon fail">
                <i class="simple-icon-exclamation"></i>
              </span>
              <span v-if="buttonTitle" class="label text-uppercase">
                {{ buttonTitle }}
              </span>
              <span v-else class="label text-uppercase">
                {{ $t('user.update') }}
              </span>
            </b-button>
          </div>
        </div>
      </b-colxx>
      <b-colxx xxs="12">
        <b-card>
          <b-row class="font-weight-medium list-item-heading border-bottom pb-3">
            <b-col>Subject</b-col>
            <b-col>View</b-col>
            <b-col>Create</b-col>
            <b-col>Edit</b-col>
            <b-col>Delete</b-col>
          </b-row>
          <b-row
            id="updatePermissions"
            class="av-tooltip tooltip-right-bottom mt-3"
            label="Bottom Right"
            v-for="(item, index) in subjects" :key="index"
            >
            <b-col>
              {{ item.name }}
            </b-col>
            <b-col>
              <b-form-checkbox ref="checkbox" :checked="checkRoleExist(`${item.slug}.read`)"  data-action="read" :data-subject="`${item.slug}`" class="itemCheck mb-0"/>
            </b-col>
            <b-col>
              <b-form-checkbox ref="checkbox" :checked="checkRoleExist(`${item.slug}.create`)" :disabled="item.slug === 'performance' || item.slug === 'calculator'" data-action="create" :data-subject="`${item.slug}`" class="itemCheck mb-0"/>
            </b-col>
            <b-col>
              <b-form-checkbox :checked="checkRoleExist(`${item.slug}.update`)" :disabled="item.slug === 'performance' || item.slug === 'calculator'" data-action="update" :data-subject="`${item.slug}`" class="itemCheck mb-0"/>
            </b-col>
            <b-col>
              <b-form-checkbox :checked="checkRoleExist(`${item.slug}.delete`)" :disabled="item.slug === 'performance' || item.slug === 'calculator'" data-action="delete" :data-subject="`${item.slug}`" class="itemCheck mb-0"/>
            </b-col>
          </b-row>
        </b-card>
      </b-colxx>
    </b-row>
    <b-row v-else>
      <b-col xxs="12">
        <h3>Ouch!! Role name is not found!</h3>
      </b-col>
      <b-button v-if="$can('view', 'permissions')" :to="{ path: 'manage-roles' }" variant="light" class="top-right-button-container" size="lg"><i class="simple-icon-arrow-left-circle mr-2" />BACK</b-button>
    </b-row>
  </div>
  <div v-else class="loading" key="itemLoading"></div>
</template>

<script>
import axios from 'axios'
import { apiUrl } from "../../../constants/config";
import Vuetable from "vuetable-2/src/components/Vuetable";

export default {
  components: {
    vuetable: Vuetable
  },
  data() {
    return {
      isProcessing: false,
      isLoading: false,
      isVisible: false,
      status: "",
      buttonTitle: "",
      roles: [],
      subjects: [],
      permissions: [],
      filteredPermission: {
        permissions: []
      }
    }
  },
  methods: {
    fetchSubjects() {
      var url = apiUrl + "/getsubject";
      axios
        .get(url)
        .then(r => r.data)
        .then(res => {
          if(res.data != null) {
            this.subjects = res.data;
            this.permissions = res.data.map(({ slug, actions }) => ({ subject: slug, actions: actions }));
            // console.log(userRoles);
          }
          this.fetchRole(this.$route.params.slug)
        })
        .catch(err => {
          console.log(err.message)
        });

    },
    fetchRole(slug) {
      if(slug == 'administrator' || slug == 'user') {
        this.$router.push({ path: '/unauthorized' });
      }
      var url = apiUrl + "/getrolepermission/" + slug;
      axios
        .get(url)
        .then(r => r.data)
        .then(res => {
          if(res.data != null) {
            this.roles = res.data;
          }
          // this.message = res.message;
        })
        .catch(err => {
          console.log(err.message)
        })
        .finally(() => {
          this.isLoading = true;
        });
    },
    findCheckedPermissions() {
      let checkBoxes = document.querySelectorAll('.itemCheck')
      for (var i = 0; i < checkBoxes.length; i++) {
        var el = checkBoxes[i].querySelector('.custom-control-input');
        var dataSubject = el.getAttribute('data-subject');
        var dataAction = el.getAttribute('data-action');
        var index = this.permissions.map(function(o) { return o.subject; }).indexOf(dataSubject);
        // console.log(index);
        if (el.checked == true){
          if(index == -1) {
            this.permissions.push({
              'subject': dataSubject,
              'actions': dataAction
            });
          } else {
            if(this.permissions[index] == index) return
            this.permissions[index].actions.push(dataAction)
          }
        }
      }
    },
    checkBoxValue(event, i, val) {
      if(event === true) {
        this.permissions[i].actions.push(val)
      } else {
        this.permissions[i].actions.splice(this.permissions[i].actions.indexOf(val), 1);
      }
    },
    checkRoleExist(action) {
      if(this.roles.permissions == null) return
      return this.roles.permissions.includes(action)
      // this.permissions[i].actions.push(val)
    },
    addNotification(type, title, message) {
      this.$notify(type, title, message, { duration: 2000, permanent: false });
    },
    updatePermissionsSubmit(){
      this.findCheckedPermissions()
      let url = apiUrl + "/createrolepermission/" + this.$route.params.slug;

      for (var i = 0; i < this.permissions.length; i++) {
        if (this.permissions[i].actions.length > 0) {
          this.filteredPermission.permissions.push({
            'subject': this.permissions[i].subject,
            'actions': this.permissions[i].actions
          });
        }
      }

      // console.log(this.filteredPermission.permissions);

      this.isProcessing = true;
      this.status = "processing";
      if( this.filteredPermission.permissions.length > 0 ) {
        axios
          .post(url, this.filteredPermission)
          .then(r => r.data)
          .then(res => {
            this.isProcessing = false;
            this.status = "success";
            this.message = "Role was created!";
            this.filteredPermission.permissions = [];
            setTimeout(() => {
              this.$router.push({ path: 'manage-roles' });
            }, 1500)
          }).catch(_error => {
            this.status = "fail";
            this.message = "Sorry can not update permissions";
            this.addNotification("error filled", "Oppss!", this.message);
            setTimeout(() => {
              this.isProcessing = false;
              this.status = "default";
              this.buttonTitle = "Try again"
            }, 1000)
          })
      } else {
        this.status = "fail";
        this.message = "Please check at least one permission";
        this.addNotification("error filled", "Oppss!", this.message);
        setTimeout(() => {
          this.isProcessing = false;
          this.status = "default";
          this.buttonTitle = "Try again"
        }, 1200)
      }
    },
    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible
    }
  },
  mounted() {
    this.fetchSubjects();
  }
}
</script>
