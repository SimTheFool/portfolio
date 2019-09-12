<template>
    <svg v-bind:x="point.x" v-bind:y="point.y" width="20px" height="20px" viewBox="0 0 100 100" class="cursor">

        <circle cx="50" 
                cy="50"
                v-on:mousedown="$emit('mousedown')"
                r="50"
                fill="white"
                stroke="black"/>

            <text
                    v-if="contentType === 'text'"
                    x="50"
                    y="50"
                    text-anchor="middle"
                    font-size="20"
                    fill="red"
                    pointer-events="none"
            >
                {{content}}
            </text>

            <path
                v-if="contentType === 'svg'"
                v-bind:d="content"
                fill="transparent"
                stroke="black"
                width="100px"
            />

    </svg>
</template>

<script>
export default {
    inject: ['anime'],
    props:
    {
        path: null,
        content: '',
        contentType: ''
    },
    data: function()
    {
        return {
            isMounted: false,
            animation: null,
            lengthOnPath: 0,
        }
    },
    computed:
    {
        point: function()
        {
            if(this.path === null || !this.isMounted)
            {
                return {x: 0, y: 0};
            }

            let point = this.path.getPointAtLength(this.lengthOnPath);
            point.x = point.x - this.$el.width.baseVal.value * 0.5;
            point.y = point.y - this.$el.height.baseVal.value * 0.5;
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
    mounted: function()
    {
        this.isMounted = true;
    }
}
</script>