<template>
  <b-card-body>
    <p class="list-heading text-uppercase mb-4">{{ $t("vehicle.step-name-1") }}</p>
    <!-- <ul class="list-unstyled mb-4">
      <li class="nav-item">
        <p class="d-inline-block list-heading text-uppercase mb-0">{{ $t("vehicle.step-name-1") }}</p>
        <span class="d-flex align-items-center text-muted text-small font-weight-light float-right">{{ $t("pages.status") }}
          <b-badge v-if="vehicle.status_next_step == 'Available'" pill variant="success"
            class="font-weight-normal ml-2">{{ vehicle.status_next_step }}</b-badge>
          <b-badge v-else-if="vehicle.status_next_step == 'Hired'" pill variant="primary"
            class="font-weight-normal ml-2">{{ vehicle.status_next_step }}</b-badge>
          <b-badge v-else pill variant="light"
            class="font-weight-normal ml-2">{{ vehicle.status_next_step }}</b-badge>
        </span>
      </li>
    </ul> -->
    <h2 class="font-weight-medium mb-5">{{ vehicle.vehicle_manufactur }} {{ vehicle.vehicle_model }}</h2>
    <p class="text-muted text-small font-weight-light mb-2">{{ $t("vehicle.variant") }}</p>
    <p class="mb-3">{{ vehicle.vehicle_variant }}</p>
    <p class="text-muted text-small font-weight-light mb-2">{{ $t("vehicle.colour") }}</p>
    <p class="mb-3">{{ vehicle.colour }}</p>
    <div class="separator mb-4" />
    <p class="list-heading text-uppercase mb-4">{{ $t("vehicle.service-maintenance") }}</p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.service-intervals") }}
      </span>{{ vehicle.service_maintenance | withcoma }} miles
    </p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.service-last") }}
      </span>{{ vehicle.last_service_mileage | withcoma }} miles
    </p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.service-due") }}
      </span>{{ vehicle.service_schedule_miles | withcoma }} miles
    </p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.mot-date") }}
      </span>{{ vehicle.mot_due_date | datetime }}
    </p>
    <p class="font-weight-semibold mb-3">
      <span class="text-muted text-small font-weight-light d-block">{{ $t("vehicle.rfl-date") }}
      </span>{{ vehicle.rfl_due_date | datetime }}
    </p>
  </b-card-body>
</template>
<script>
import moment from 'moment';
export default {
  props: ["vehicle"],
  filters: {
    datetime: function(date) {
      return moment(date).format('ll')
    },
    withcoma: function(num) {
      return Number(num).toLocaleString()
    }
  },
};
</script>
