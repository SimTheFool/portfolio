<template>
    <filter primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB">

         <feFlood ref="stick1"
            class="stick"
            x="40%"
            y="0%"
            width="0.05%"
            height="100%"
            flood-opacity="1"
            result="stick1"
        />

        <feFlood ref="stick2"
            class="stick"
            x="0%"
            y="25%"
            width="100%"
            height="0.05%"
            flood-opacity="1"
            result="stick2"
        />

        <feFlood ref="stick3"
            class="stick"
            x="60%"
            y="0%"
            width="0.05%"
            height="100%"
            flood-opacity="1"
            result="stick3"
        />

        <feFlood ref="stick4"
            class="stick"
            x="0%"
            y="75%"
            width="100%"
            height="0.05%"
            flood-opacity="1"
            result="stick4"
        />

        <feFlood ref="box"
            class="box"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            flood-opacity="1"
            result="box"
        />

        <feComposite in="stick1" operator="over" in2="box" result="box" />
        <feComposite in="stick2" operator="over" in2="box" result="box" />
        <feComposite in="stick3" operator="over" in2="box" result="box" />
        <feComposite in="stick4" operator="over" in2="box" result="box" />

        <feComposite in="logo" operator="atop" in2="box" result="box" />

        <feComposite in="box" operator="over" in2="SourceGraphic"/>

    </filter>
</template>
<script>
export default {
    inject: ['anime', 'eventBus'],
    data: function()
    {
        return {
            currentAnim: null,
            datasInitialized: false,
            timeSinceInitialized: 0,
            shouldStop: false,
            stickAscended: 0
        }
    },
    watch:
    {
        timeSinceInitialized: function(val)
        {
            if(val >= 4800)
            {
                this.shouldStop = true;
            }
        },
        currentAnim: function(val)
        {
            if(val === null)
            {
                this.reduceSticks();
            }
        },
        stickAscended: function(val)
        {
            if(val >= 4)
            {
                this.drop();
            }
        }
    },
    methods:
    {
        tictac: function(type)
        {
            if(type === "tic")
            {
                var op1 = "+";
                var op2 = "-";
                var nextType = "tac";
            }
            else
            {
                var op1 = "-";
                var op2 = "+";
                var nextType = "tic";
            }

            return this.anime.timeline({
                easing: 'easeOutExpo',
                duration: 300,
                complete: () => {
                    this.timeSinceInitialized += (this.datasInitialized) ? 1200 : 0;
                    if(!this.shouldStop)
                    {
                        this.currentAnim = this.tictac(nextType);
                    }
                    else
                    {
                        this.currentAnim = null;
                    }
                }
            }).add({
                targets: this.$refs.stick1,
                x: `${op1}=5%`,
            }).add({
                targets: this.$refs.stick2,
                y: `${op1}=5%`
            }).add({
                targets: this.$refs.stick3,
                x: `${op2}=5%`
            }).add({
                targets: this.$refs.stick4,
                y: `${op2}=5%`
            });
        },
        reduceSticks: function()
        {
            this.anime.timeline({
                easing: 'easeInQuad',
                complete: () => {
                    this.drop();
                }
            }).add({
                targets: this.$refs.stick1,
                height: "60%",
                x: "0%",
                y: "20%",
                "flood-opacity": 0,
                duration: 700
            }, 0).add({
                targets: this.$refs.stick2,
                width: "100%",
                y: "0%",
                x: "0%",
                duration: 700
            }, 0).add({
                targets: this.$refs.stick3,
                height: "60%",
                y: "20%",
                x: "100%",
                "flood-opacity": 0,
                duration: 700
            }, 0).add({
                targets: this.$refs.stick4,
                width: "60%",
                y: "100%",
                x: "20%",
                "flood-opacity": 0,
                duration: 700
            }, 0);
        },
        drop: function()
        {
            this.anime.timeline({
                easing: "easeInQuad",
                complete: () => {
                    document.querySelector('body').style.filter = "";
                    this.eventBus.$emit('transitionEnd');
                }
            }).add({
                targets: [this.$refs.stick2, this.$refs.box],
                y: "+=100%",
                duration: 900,
            });
        }
    },
    mounted: function()
    {
        /* this.eventBus.$on('datasInitialized', () => {
            this.datasInitialized = true;
        });

        document.addEventListener('click', () => {
            if(this.datasInitialized)
            {
                this.shouldStop = true;
            }
        });

        this.eventBus.$emit('transitionBegin');
        document.querySelector('body').style.filter = 'url("#trans--loading")';
        this.currentAnim = this.tictac("tic"); */
    }
}
</script>