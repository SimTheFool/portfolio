<template>
    <circle v-bind:cx="point.x" 
            v-bind:cy="point.y"
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
        endpoints: null,
    },
    data: function()
    {
        return {
            progress: 0,
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

            let length = this.path.getTotalLength();
            let point = this.path.getPointAtLength(length * this.progress / 100);
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
        moveToEndpoint: function(i)
        {
            this.animation = this.anime({
                targets: this,
                progress: this.endpoints[i].y,
                easing: 'easeInOutSine',
                autoplay: false,
                duration: 1000,
                complete: () => {
                    this.$emit('reachEndpoint', i);
                }
            });
        }
    },
}
</script>