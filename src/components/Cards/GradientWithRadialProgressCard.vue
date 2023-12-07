<template>
<b-card class="progress-banner" no-body>
    <b-card-body class="justify-content-between d-flex flex-row align-items-center">
        <div>
            <i :class="`${icon} mr-2 text-white align-text-bottom d-inline-block`" />
            <div>
                <p v-if="title > 100000" class="lead text-white">{{ prefix }} {{ theNumber | withcoma }}K {{ suffix }}</p>
                <p v-else class="lead text-white">{{ prefix }} {{ title | withcoma }} {{ suffix }}</p>
                <p class="text-small text-white">{{ detail }}</p>
            </div>
        </div>
        <div v-show="percent" class="progress-bar-circle progress-bar-banner position-relative">
            <radial-progress-bar :diameter="diameter" :strokeWidth="strokeWidth" :completed-steps="percent" :total-steps=100>{{progressText}}</radial-progress-bar>
        </div>
    </b-card-body>
</b-card>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress'
export default {
    components: {
        'radial-progress-bar': RadialProgressBar
    },
    props: ['icon', 'title', 'detail', 'percent', 'progressText', 'prefix', 'suffix'],
    data() {
        return {
            diameterDefault: 125,
            strokeWidthDefault: 5,
            diameter: this.diameterDefault,
            strokeWidth: this.strokeWidthDefault
        }
    },
    filters: {
        withcoma: function(num) {
            return Number(num).toLocaleString()
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleWindowResize)
        this.handleWindowResize()
    },
    computed: {
        theNumber() {
            return Math.abs(this.title / 1000).toFixed(1)
        }
    },
    methods: {
        handleWindowResize(event) {
            if (event && !event.isTrusted) {
                return
            }
            const windowWidth = window.innerWidth
            if (windowWidth <= 1200) {
                this.diameter = 84
                this.strokeWidth = 2
            } else {
                this.diameter = this.diameterDefault
                this.strokeWidth = this.strokeWidthDefault
            }
        }
    }
}
</script>
