<template>
  <b-colxx xxs="12" class="mb-5">
    <h1>{{ title }}</h1>
    <slot></slot>
    <piaf-breadcrumb v-show="!noBreadcrumbs"  />
    <div class="mb-2 mt-2">
      <b-button
        variant="empty"
        class="pt-0 pl-0 d-inline-block d-md-none"
        v-b-toggle.displayOptions
      >
        {{ $t('pages.display-options') }}
        <i class="simple-icon-arrow-down align-middle" />
      </b-button>
      <b-collapse id="displayOptions" class="d-md-flex justify-content-between">
        <div class="d-inline-block pt-1">
          <div class="search-sm d-inline-block float-md-left mr-1 align-top">
            <b-input :placeholder="$t('menu.search')"  @input="(val) => searchChange(val)" />
          </div>
        </div>
        <div class="float-right pt-1">
          <span class="text-muted text-small mr-1 mb-2">{{from}}-{{to}} of {{ total }}</span>
          <b-dropdown
            id="ddown2"
            right
            :text="`${perPage}`"
            variant="outline-dark"
            class="d-inline-block"
            size="xs"
          >
            <b-dropdown-item
              v-for="(size,index) in pageSizes"
              :key="index"
              @click="changePageSize(size)"
            >{{ size }}</b-dropdown-item>
          </b-dropdown>
        </div>
      </b-collapse>
    </div>
    <!-- <div v-show="separator" class="separator mb-5" /> -->
  </b-colxx>
</template>
<script>

export default {
  props: [
    "title",
    "changePageSize",
    "searchChange",
    "from",
    "to",
    "total",
    "perPage",
    "separator",
    "noBreadcrumbs"
  ],
  data() {
    return {
      pageSizes: [4, 8, 12]
    };
  }
};
</script>
