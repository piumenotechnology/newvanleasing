<template>
<b-card class="progress-banner" no-body>
    <b-card-body class="justify-content-between d-flex flex-row align-items-center">
        <div>
            <i :class="`${icon} mr-2 text-white align-text-bottom d-inline-block`" />
            <div>
                <p v-if="status && status !== null" class="lead text-white">{{ prefix }} {{ count | withcoma }} {{ suffix }}
                    <i :class="(status == 'up')? 'iconsminds-arrow-up-2': 'iconsminds-arrow-down-2'" class="icon-no-change ml-3" /></p>
                <p v-else class="lead text-white">{{ prefix }} {{ count | withcoma }} {{ suffix }}</p>
                <p class="text-small text-white">{{ detail }}</p>
            </div>
        </div>
        <!-- <div v-show="percent" :class="`text-${intent}`" class="progress-bar-circle progress-bar-banner position-relative">
            {{progressText}}
        </div> -->
    </b-card-body>
</b-card>
</template>
<script>
export default {
    props: ['icon', 'title', 'detail', 'percent', 'status', 'progressText', 'prefix', 'suffix'],
    data() {
        return {
            count: 0,
            diameterDefault: 125,
            strokeWidthDefault: 5,
            diameter: this.diameterDefault,
            strokeWidth: this.strokeWidthDefault
        }
    },
    mounted() {
        this.setCount(this.title)
        window.addEventListener('resize', this.handleWindowResize)
        this.handleWindowResize()
    },
    watch: {
        title(val) {
            this.setCount(val)
        }
    },
    filters: {
        withcoma: function(num) {
            return Number(num).toLocaleString()
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
        },
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
