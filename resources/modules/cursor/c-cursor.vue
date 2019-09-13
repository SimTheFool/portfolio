<template>
    <svg
        v-bind:x="point.x"
        v-bind:y="point.y"
        v-on:mousedown="$emit('mousedown')"
        v-on:click="$emit('click', $event.currentTarget.dataset.id)"
        width="20px"
        height="20px"
        viewBox="0 0 100 100"
        class="cursor"
    >

        <circle cx="50" 
                cy="50"
                r="50"
                fill="white"
                stroke="black"
        />

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
            easings: [
                'easeOutQuad',
                'easeOutCubic',
                'easeOutQuart',
                'easeOutQuint',
                'easeOutSine',
                'easeOutExpo',
                'easeOutCirc',
                'easeOutBack',
                'easeOutBounce',
                'easeInOutQuad',
                'easeInOutCubic',
                'easeInOutQuart',
                'easeInOutQuint',
                'easeInOutSine',
                'easeInOutExpo',
                'easeInOutCirc',
                'easeInOutBack',
                'easeInOutBounce'
            ]
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
        transitToLength: function(l, randomEasing = false, i = null)
        {
            if(this.animation !== null)
            {
                this.animation.pause();
            }

            let easing = randomEasing ? this.easings[this.anime.random(0, this.easings.length - 1)] : "easeOutSine";
            let onComplete = () => {};
            let totalLength = this.path.getTotalLength();

            if(l < 0)
            {
                let nextLength = totalLength + (l % totalLength);  
                l = 0;
                onComplete = () => {
                    this.moveToLength(totalLength);
                    this.transitToLength(nextLength);
                };
                //easing = "linear";
            }

            if(l > totalLength)
            {
                let nextLength = l % totalLength;  
                l = totalLength;
                onComplete = () => {
                    this.moveToLength(0);
                    this.transitToLength(nextLength);
                };
                //easing = "linear";
            }

            this.animation = this.anime({
                targets: this,
                lengthOnPath: l,
                easing: easing,
                autoplay: false,
                duration: Math.abs(this.lengthOnPath - l) * 10,
                complete: () => {
                    if(i !== null)
                    {
                        this.$emit('reachEndpoint', i);
                    }       
                    onComplete();             
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