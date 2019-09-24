<template>
    <svg class="drawing" version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                v-bind:viewBox="vbox">
        <path class="line" ref="path" v-bind:d="d"/>
        <line v-for="(point, index) in endpoints"
            class="endpoint"
            v-bind:x1="point.x - 2 * utils.checkParity(index)"
            v-bind:y1="point.y"
            v-bind:x2="point.x - 6 * utils.checkParity(index)"
            v-bind:y2="point.y"
            v-bind:data-id="index"
            v-on:click="$emit('clickEndpoint', $event.target.dataset.id)"
        />
        <slot></slot>
    </svg>
</template>

<script>
export default {
    inject: ['utils'],
    props:
    {
        vbox: "",
        d:
        {
            type: String,
            default: ''
        },
        endpoints:
        {
            type: Array,
            default: () => []
        },
    },
}
</script>