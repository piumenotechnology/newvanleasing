<template>
  <b-card class="mb-4 text-center">
    <slot/>
    <i :class="icon" class="mb-2"/>
    <p v-show="isComa" class="lead text-center">£ {{ count | addComa }}</p>
    <p v-show="!isComa" class="lead text-center">£ {{ count }}</p>
    <p class="card-text mt-2 text-extra-small text-uppercase">{{ title }}</p>
  </b-card>
</template>
<script>
export default {
  props: {
    title: { type: String, default: 'icon-card-title' },
    icon: { type: String, default: 'iconsminds-clock' },
    value: { type: Number, default: 0 },
    isComa: { type: Boolean, default: false }
  },
  data() {
    return {
      count: 0
    }
  },
  watch: {
    value(val) {
      this.setCount(val)
    }
  },
  methods: {
    setCount(val) {
      const obj = { n: this.count }
      this
        .$anime
        .timeline()
        .add({
          targets: obj,
          n: val,
          round: 1,
          duration: 1000,
          easing: "easeOutExpo",
          update: () => {
            this.count = obj.n
          }
        });
    }
  },
  filters: {
    addComa(val) {
      return val.toLocaleString()
    }
  },
  mounted() {
    this.setCount(this.value)
  }
}
</script>
