<template>
    <svg class="cursor"
        v-bind:x="point.x + 3"
        v-bind:y="point.y"
        v-on:mousedown="$emit('mousedown')"
        v-on:click="$emit('click', $event.currentTarget.dataset.id)"
        viewBox="-15 0 130 110"
    >

        <text
                v-if="contentType === 'text'"
                x="50"
                y="50"
                dominant-baseline="middle"
                pointer-events="none"
        >
            {{content}}
        </text>

        <path
            ref="path"
            v-if="contentType === 'svg'"
            d=""
        />

    </svg>
</template>

<script>
export default {
    inject: ['anime', 'snap'],
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
            animations: {
                transit: null,
                scaleUp: null,
                scaleDown: null
            },
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
    watch:
    {
        content:
        {
            handler : function(newContent, oldContent)
            {
                if(this.contentType !== 'svg')
                {
                    return;
                }

                if(!newContent)
                {
                    return;
                }

                this.$nextTick(() => {

                    let logo = this.snap(this.$refs.path);

                    if(!oldContent)
                    {
                        logo.attr({
                            d: newContent
                        });

                        return;
                    }

                    logo.animate({d: newContent}, 1000, mina['linear']);
                })
            },
            immediate: true 
        }
    },
    methods:
    {
        transitToLength: function(l, i = null, callbacks = {})
        {
            if(this.isAnimating())
            {
                this.pauseAnimations();
            }

            let easing = "easeOutSine";
            let onComplete = () => {};
            let totalLength = this.path.getTotalLength();

            if(l < 0)
            {
                let nextLength = totalLength + (l % totalLength);  
                l = 0;
                onComplete = () => {
                    this.moveToLength(totalLength);
                    this.transitToLength(nextLength, true);
                };
            }

            if(l > totalLength)
            {
                let nextLength = l % totalLength;  
                l = totalLength;
                onComplete = () => {
                    this.moveToLength(0);
                    this.transitToLength(nextLength, true);
                };
            }

            this.animations.transit = this.anime({
                targets: this,
                lengthOnPath: l,
                easing: easing,
                autoplay: false,
                duration: Math.abs(this.lengthOnPath - l) * 10,
                begin: () => {
                    if(callbacks.begin !== undefined)
                    {
                        callbacks.begin();
                    }
                },
                complete: () => {
                    if(i !== null)
                    {
                        this.$emit('reachEndpoint', i);
                    }  
                    
                    if(callbacks.end !== undefined)
                    {
                        callbacks.end();
                    }
                    
                    onComplete();         
                }
            });

            this.animations.transit.play();
        },
        moveToLength: function(l)
        {
            this.lengthOnPath = l;
        },
        isAnimating: function()
        {
            let values = Object.values(this.animations);
            let isAnimating = values.find((elem) => {return elem === null});

            return (isAnimating === undefined) ? false : true;
        },
        pauseAnimations: function()
        {
            let values = Object.values(this.animations);
            values.forEach((elem) => {
                if(elem !== null)
                {
                    elem.pause();
                }
            });
        },
    },
    mounted: function()
    {
        this.isMounted = true;
    }
}
</script>