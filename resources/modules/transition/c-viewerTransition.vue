<template>
    <div class="transition" id="transition--viewer">
        <svg version="1.1"
            baseProfile="full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none">

            <rect x="0%" v-bind:y="yBegin" width="100%" height="100%"/>
            <line v-bind:x1="edges.x1" v-bind:y1="yEnd" v-bind:x2="edges.x2" v-bind:y2="yEnd"/>

            
        </svg>
    </div>
</template>
<script>
export default {
    inject: ['anime', 'eventBus'],
    data: function()
    {
        return {
            offset: 1,
            width: 0,
        }
    },
    computed:
    {
        yBegin: function()
        {
            return `${this.offset - 100}%`;
        },
        yEnd: function()
        {
            return `${this.offset}%`;
        },
        edges: function()
        {
            return {
                x1: `${50 - this.width / 2}%`,
                x2: `${50 + this.width / 2}%`
            }
        }
    },
    methods:
    {
        drop: function()
        {
            this.anime.timeline({
                easing: "linear",
                complete: () => {
                    this.ascend();
                    this.eventBus.$emit('viewerHidden');
                }
            }).add({
                targets: this,
                width: 100,
                duration: 200
            }).add({
                targets: this,
                offset: 100,
                duration: 400
            });
        },
        ascend: function()
        {
            this.anime.timeline({
                easing: "linear",
                complete: () => {
                    this.eventBus.$emit('transitionEnd');
                }
            }).add({
                targets: this,
                offset: 1,
                duration: 400
            }).add({
                targets: this,
                width: 0,
                duration: 200
            });
        }
    },
    mounted: function()
    {
        this.eventBus.$on('viewerNewContent', () => {
            console.log('sdf')
            this.eventBus.$emit('transitionBegin');
            this.drop();
        });
    }
}
</script>