<template>
    <svg class="icon" version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                v-on:click="$emit('click', $event.currentTarget.dataset.id)">

        <path v-bind:d="iconData"/>

    </svg>
</template>

<script>
    export default  {
        props:
        {
            iconData: ""
        }
    }
</script>