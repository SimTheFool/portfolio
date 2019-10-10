<template>
    <nav>
        <span class="navBtn--left navBtn" v-on:click="clickLeft">
            <svg class="navBtn--symbol"
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-10 -10 120 120">
                <path d="M25.6,48.7c13.3-8.9,26.6-17.9,39.9-26.8c1.4-1,2.8,1.3,1.3,2.3C53.5,33.1,40.2,42,26.9,50.9 C25.4,51.9,24.1,49.7,25.6,48.7L25.6,48.7z M26.9,48.7c13.3,9,26.6,18.1,39.9,27.1c1.4,1,0.1,3.4-1.3,2.3 C52.2,69.1,38.9,60,25.6,51C24.1,50.1,25.4,47.7,26.9,48.7L26.9,48.7z"/>

                <circle cx="50" 
                        cy="50"
                        r="50"
                />
            </svg>  
        </span>
        <span class="navBtn--right navBtn" v-on:click="clickRight">
            <svg class="navBtn--symbol"
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-10 -10 120 120">
                <path d="M75.3,50.1C62,41.2,48.7,32.2,35.4,23.3c-1.4-1-2.8,1.3-1.3,2.3C47.4,34.5,60.7,43.4,74,52.3 C75.4,53.3,76.7,51.1,75.3,50.1L75.3,50.1z M74,50.1c-13.3,9-26.6,18.1-39.9,27.1c-1.4,1-0.1,3.4,1.3,2.3 c13.3-9,26.6-18.1,39.9-27.1C76.7,51.5,75.4,49.1,74,50.1L74,50.1z"/>
                <circle cx="50" 
                        cy="50"
                        r="50"
                />
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