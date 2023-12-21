<template>
  <b-modal
    id="performancedetail"
    ref="performancedetail"
    :title="$t('performance.contract-details')"
    hide-footer
    modal-class="modal-right"
  >
  <template slot="modal-header" class="justify-content-start">
    <b-button @click="hideModal" variant="light" size="lg" class="icon-button"><i class="simple-icon-arrow-left" /></b-button>
  </template>
  <ul class="list-unstyled mb-5">
      <li class="nav-item">
        <p class="d-inline-block list-heading text-uppercase mb-0">{{ report.cust_name }}</p>
        <span class="d-flex align-items-center text-muted text-small font-weight-light float-right">{{ $t("pages.status") }}
          <b-badge v-if="report.next_step_status_sales == 'Hired'" pill variant="primary"
            class="font-weight-normal ml-2">{{ report.next_step_status_sales }}</b-badge>
          <b-badge v-else-if="report.next_step_status_sales == 'Innactive'" pill variant="light"
            class="font-weight-normal ml-2">{{ report.next_step_status_sales }}</b-badge>
          <b-badge v-else pill variant="dark"
          class="font-weight-normal ml-2">{{ report.next_step_status_sales }}</b-badge>
        </span>
      </li>
    </ul>
    <!-- <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light mr-1">{{ $t("performance.customer-name") }}
      </span>{{ report.cust_name }}
    </p> -->
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light mr-1">{{ $t("performance.start-date") }}
      </span>{{ report.contract_start_date | datetime }}
    </p>
    <p v-show="report.vehicle_return_date !== null" class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light mr-1">{{ $t("performance.end-date") }}
      </span>{{ report.vehicle_return_date | datetime }}
    </p>
    <p v-show="report.vehicle_sold_date !== null" class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light mr-1">{{ $t("performance.sold-date") }}
      </span>{{ report.vehicle_sold_date | datetime }}
    </p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light mr-1">{{ $t("performance.annual-mileage") }}
      </span>{{ report.annual_mileage | withcoma }} miles
    </p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light mr-1">{{ $t("performance.monthly-rental-income") }}
      </span>£ {{ report.monthly_rental | withcoma }}
    </p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light mr-1">{{ $t("performance.total-income") }}
      </span>£ {{ totalIncome | withcoma }}
    </p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light mr-1">{{ $t("performance.rental-income") }}
      </span>£ {{ report.rental_income | withcoma }}
    </p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light mr-1">{{ $t("performance.term-period") }}
      </span>{{ report.term_months }} months
    </p>
    <template slot="modal-footer"></template>
  </b-modal>
</template>

<script>
import moment from "moment"
export default {
  data() {
    return {
      report: []
    }
  },
  filters: {
    datetime: function(date) {
      return moment(date).format('MMMM Do YYYY')
    },
    withcoma: function(num) {
      return Number(num).toLocaleString()
    }
  },
  computed: {
    totalIncome() {
      return (this.report.next_step_status_sales !== "Sold") ? this.report.total_income : Math.abs(this.report.rental_income + this.report.sold_price) ;
    }
  },
  methods: {
    openModal(obj) {
      this.report = obj
      this.$refs.performancedetail.show()
    },
    hideModal() {
      this.$refs.performancedetail.hide()
    }
  }
};
</script>

