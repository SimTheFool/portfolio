<template>
    <nav>
        <span class="navBtn--left navBtn" v-on:click="clickLeft">
            <svg class="navBtn--symbol"
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-10 -10 120 120">
                <polyline class="st0" points="75.4,98 4.1,50 75.4,2"/>
            </svg>  
        </span>
        <span class="navBtn--right navBtn" v-on:click="clickRight">
            <svg class="navBtn--symbol"
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-10 -10 120 120">
                <polyline class="st0" points="24.5,2 95.8,50 24.5,98 "/>

            </svg>
        </span>
    </nav>
</template>
<script>
export default {
    inject: ['eventBus'],
    props:
    {
        left:
        {
            type: Object,
            default: () => {}
        },
        right:
        {
            type: Object,
            default: () => {}
        }
    },
    methods:
    {
        clickLeft: function()
        {
            this.eventBus.$emit('navigate', 'left');
        },
        clickRight: function()
        {
            this.eventBus.$emit('navigate', 'right');
        }
    },
    mounted: function()
    {
        this.eventBus.$on('transiting', (e) => {
            let route = (e === 'right') ? this.right : this.left;
            this.$router.push(route);
        })
    }
}
</script>