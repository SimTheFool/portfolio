<template>
    <div class="transition">
        <svg version="1.1"
            baseProfile="full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none">

            <rect v-bind:x="xBegin" y="0%" width="100%" height="100%"/>
            <line v-bind:x1="xBegin" y1="0%" v-bind:x2="xBegin" y2="100%"/>
            <line v-bind:x1="xEnd" y1="0%" v-bind:x2="xEnd" y2="100%"/>
            
        </svg>
    </div>
</template>
<script>
export default {
    inject: ['anime', 'eventBus'],
    data: function()
    {
        return {
            animDir: "right",
            offset: -101,
        }
    },
    computed:
    {
        xBegin: function()
        {
            return `${this.offset}%`;
        },
        xEnd: function()
        {
            return `${100 + this.offset}%`;
        }
    },
    methods:
    {
        transitIn: function()
        {

            if(this.animDir === "right")
            {
                this.offset = 101;
            }
            else
            {
                this.offset = -101;
            }

            this.anime({
                targets: this,
                offset: 0,
                easing: "linear",
                duration: 800,
                complete: () => {
                    this.eventBus.$emit('transiting', this.animDir);
                    this.transitOut();
                }
            });
 
        },
        transitOut: function()
        {
            let finalOffset;
            
            if(this.animDir === "right")
            {
                finalOffset = -101;
            }
            else
            {
                finalOffset = 101;
            }

            this.anime({
                targets: this,
                offset: finalOffset,
                easing: "linear",
                duration: 800,
                complete: () => {
                    this.eventBus.$emit('transitionEnd');
                }
            });
        }
    },
    mounted: function()
    {
        this.eventBus.$on('navigate', (e) => {
            this.eventBus.$emit('transitionBegin');
            this.animDir = e;
            this.transitIn();
        });
    }
}
</script>