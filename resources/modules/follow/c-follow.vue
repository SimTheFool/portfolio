<template>
    <div id="frame">
        <svg ref="mySvg" width="100%" height="100%" viewBox="-10 -10 120 120">
            <path ref="myPath" d="M 50 50 v 50 h -25 v -25" fill="transparent" stroke="red"/>  
            <circle ref="myCursor" v-bind:cx="point.x" v-bind:cy="point.y" r="5" stroke="red" fill="white"/>              
        </svg>
    </div>
</template>

<script>
export default {
    inject: ['anime'],
    data: function()
    {
        return {
            isMounted: false,
            animProgress: 0,
        }
    },
    methods:
    {
        
    },
    computed:
    {
        point: function()
        {
            if(!this.isMounted)
            {
                return {x: 0, y: 0};
            }

            let length = this.$refs.myPath.getTotalLength();
            let point = this.$refs.myPath.getPointAtLength(length * this.animProgress / 100);
            return point;
        }
    },
    mounted: function()
    {
        this.isMounted = true;

        let path = this.$refs.myPath;

        this.anime({
            targets: this,
            animProgress: 100,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: true,
            duration: 2000,
        });
    }
}
</script>