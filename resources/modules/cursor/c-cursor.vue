<template>
    <circle v-bind:cx="point.x" 
            v-bind:cy="point.y"
            v-on:mousedown="$emit('mousedown')"
            r="3"
            fill="black"
            stroke="black"/>
</template>

<script>
export default {
    inject: ['anime'],
    props:
    {
        path: null,
    },
    data: function()
    {
        return {
            animation: null,
            lengthOnPath: 0,
        }
    },
    computed:
    {
        point: function()
        {
            if(this.path === null)
            {
                return {x: 0, y: 0};
            }

            let point = this.path.getPointAtLength(this.lengthOnPath);
            return point;
        }
    },
    methods:
    {
        transitToLength: function(l, i = null)
        {
            if(this.animation !== null)
            {
                this.animation.pause();
            }

            let d = Math.abs(this.lengthOnPath - l) / 0.06;

            this.animation = this.anime({
                targets: this,
                lengthOnPath: l,
                easing: 'easeOutSine',
                autoplay: false,
                duration: d,
                complete: () => {
                    if(i !== null)
                    {
                        this.$emit('reachEndpoint', i);
                    }                    
                }
            });

            this.animation.play();
        },
        moveToLength: function(l)
        {
            this.lengthOnPath = l;
        }
    },
}
</script>