<template>
    <svg id="pointer" version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                v-bind:style="style">

        <line v-for="(angle, index) in angles"
            class="pointer--outlines"
            stroke-linecap="round"
            v-bind:x1="outerPoints[index].x"
            v-bind:y1="outerPoints[index].y"
            v-bind:x2="innerPoints[index].x"
            v-bind:y2="innerPoints[index].y"/>

        <line v-for="(angle, index) in angles"
            class="pointer--lines"
            stroke-linecap="round"
            v-bind:x1="outerPoints[index].x"
            v-bind:y1="outerPoints[index].y"
            v-bind:x2="innerPoints[index].x"
            v-bind:y2="innerPoints[index].y"/>

    </svg>
</template>
<script>
export default {
    inject: ['anime', 'eventBus'],
    data: function()
    {
        return {
            pointerX: 0,
            pointerY: 0,
            outerRadius: 50,
            innerRadius: 20,
            angles: [Math.PI / 2, 7 * Math.PI / 6, 11 * Math.PI / 6],
            angleOffset: 0,
            currentAnim: null,
            canFocus: true,
            mustFocus: false
        }
    },
    computed:
    {
        style: function()
        {
            return {
                top: this.pointerY.toString() + 'px',
                left: this.pointerX.toString() + 'px'
            }
        },
        outerPoints: function()
        {   
            let points = [];
            this.angles.forEach((angle) => {
                points.push({
                    x: Math.cos(angle + this.angleOffset) * this.outerRadius + 50,
                    y: Math.sin(angle + this.angleOffset) * this.outerRadius + 50
                })
            });

            return points;
        },
        innerPoints: function()
        {
            let points = [];
            this.angles.forEach((angle) => {
                points.push({
                    x: Math.cos(angle + this.angleOffset) * this.innerRadius + 50,
                    y: Math.sin(angle + this.angleOffset) * this.innerRadius + 50
                });
            });

            return points;
        }
    },
    watch:
    {
        currentAnim: function(anim, oldAnim)
        {
            if(oldAnim !== null)
            {
                oldAnim.pause();
            }
        },
        canFocus: function(val, oldVal)
        {
            if(val === false)
            {
                this.unfocus();
            }
            else
            {
                if(this.mustFocus === true)
                {
                    this.focus();
                }
            }
        }
    },
    methods:
    {
        focus: function()
        {
            this.mustFocus = true;
            if(!this.canFocus){return;}

            this.currentAnim = this.anime({
                targets: this,
                outerRadius: 35,
                innerRadius: 5,
                angleOffset: 2 * Math.PI / 3,
                duration: 200,
                easing: 'linear'
            });
        },
        unfocus: function()
        {
            this.mustFocus = false;
            this.currentAnim = this.anime({
                targets: this,
                outerRadius: 50,
                innerRadius: 20,
                angleOffset: 0,
                duration: 200,
                easing: 'linear'
            });
        }
    },
    mounted: function()
    {
        document.addEventListener('mousemove', (e) => {
            this.pointerX = e.clientX;
            this.pointerY = e.clientY;
        });

        this.eventBus.$on('focus', (e) => {
            this.focus();
        });

        this.eventBus.$on('unfocus', (e) => {
            this.unfocus();
        });

        this.eventBus.$on('transitionBegin', () => {
            this.canFocus = false;
        });

        this.eventBus.$on('transitionEnd', () => {
            this.canFocus = true;
        });
    }
}
</script>