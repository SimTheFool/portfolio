<template>
    <svg class="cursor" version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                width="100%" height="100%" viewBox="-10 -10 120 120">

        <circle v-bind:cx="point.x" v-bind:cy="point.y" r="3" fill="transparent" stroke="black"/>

    </svg>
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
        moveToEndpoint: function(y)
        {
            this.animation = this.anime({
                targets: this,
                progress: y,
                easing: 'easeInOutSine',
                direction: 'alternate',
                loop: true,
                autoplay: false,
                duration: 2000,
            });
        }
    },
}
</script>