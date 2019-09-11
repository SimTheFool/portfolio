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
        endpoints:
        {
            type: Array,
            default: () => []
        }
    },
    data: function()
    {
        return {
            lengthOnPath: 0,
            animation: null,
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
    watch:
    {
        animation: function(anim, oldAnim)
        {
            if(oldAnim !== null)
            {
                oldAnim.pause();
            }

            anim.play();
        }
    },
    methods:
    {
        moveToEndpoint: function(i, d)
        {
            this.animation = this.anime({
                targets: this,
                lengthOnPath: this.endpoints[i].length,
                easing: 'easeInOutSine',
                autoplay: false,
                duration: d,
                complete: () => {
                    this.$emit('reachEndpoint', i);
                }
            });
        },
        move: function(l)
        {
            this.lengthOnPath = l;
        },
        testb: function()
        {
            console.log('bbbbb');
        }
    },
}
</script>