<template>
  <b-tabs
    nav-class="separator-tabs ml-0 mb-5"
    content-class="tab-content"
    v-model="tabIndex"
    :no-fade="false"
    key="itemList"
  >
    <b-tab>
      <template #title>
        <p class="mb-2">{{ $t('contract.return') }} <b-badge :variant="(tabIndex == 0)?'secondary':'light'" class="ml-2">{{ returnCount }}</b-badge></p>
      </template>
      <tab-contract-return @mounted-return-tab="getReturnCount"/>
    </b-tab>
    <b-tab>
      <template #title>
        <p class="mb-2">{{ $t('contract.sold') }} <b-badge :variant="(tabIndex == 1)?'secondary':'light'" class="ml-2">{{ soldCount }}</b-badge></p>
      </template>
      <tab-contract-sold @mounted-sold-tab="getSoldCount"/>
    </b-tab>
  </b-tabs>
</template>
<script>
import TabContractReturn from "../../../containers/tabs/contract/TabContractReturn";
import TabContractSold from "../../../containers/tabs/contract/TabContractSold";

export default {
  props: ["title"],
  components: {
    "tab-contract-return": TabContractReturn,
    "tab-contract-sold": TabContractSold
  },
  data() {
    return {
      tabIndex: 0,
      returnCount: 0,
      soldCount: 0
    };
  },
  methods: {
    getReturnCount(val) {
      this.returnCount = val
    },
    getSoldCount(val) {
      this.soldCount = val
    }
  },
  watch: {
    returnCount(newId, oldId) {
      if (newId) {
        return newId;
      }
    },
    soldCount(newId, oldId) {
      if (newId) {
        return newId;
      }
    }
  }
};
</script>