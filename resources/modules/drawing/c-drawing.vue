<template>
    <svg class="path" version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                width="100%" height="100%" viewBox="-10 -10 120 120">
        <path ref="path" v-bind:d="d" fill="transparent" stroke="black"/>
        <line v-for="(point, index) in endpoints"
            v-bind:x1="point.x"
            v-bind:y1="point.y"
            v-bind:x2="point.x - 5 * utils.checkParity(index)"
            v-bind:y2="point.y"
            v-bind:data-id="index"
            v-on:click="$emit('clickEndpoint', $event.target.dataset.id)"
            stroke="black"
            stroke-width="2"
        />
        <slot></slot>
    </svg>
</template>

<script>
export default {
    inject: ['utils'],
    props:
    {
        d:
        {
            type: String,
            default: ''
        },
        endpoints:
        {
            type: Array,
            default: []
        },
    },
}
</script>