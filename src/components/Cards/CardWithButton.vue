<template>
    <b-card class="progress-banner" no-body>
        <b-card-body class="justify-content-between d-flex flex-row align-items-center">
            <a @click.prevent="$emit('changeTab', tab)" href="#">
                <i :class="`${icon} display-4 ml-sm-n3 ml-0 mb-3 text-white align-text-bottom d-inline-block`" />
                <div>
                    <p class="lead text-white">{{ count }}</p>
                    <p class="text-small text-white">{{ detail }}</p>
                </div>
            </a>
            <slot />
        </b-card-body>
    </b-card>
</template>
<script>
export default {
    props: ['icon', 'detail', 'count', 'tab']
}
</script>