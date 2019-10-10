<template>
    <filter primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB">

         <feImage ref="logo" x="37.5%" y="37.5%" width="25%" height="25%"  xlink:href="/media/oz.svg" result="logo"></feImage>

         <feFlood ref="stick1"
            class="stick"
            x="40%"
            y="0%"
            width="0.3%"
            height="100%"
            flood-opacity="1"
            result="stick1"
        />

        <feFlood ref="stick2"
            class="stick"
            x="0%"
            y="25%"
            width="100%"
            height="0.3%"
            flood-opacity="1"
            result="stick2"
        />

        <feFlood ref="stick3"
            class="stick"
            x="60%"
            y="0%"
            width="0.3%"
            height="100%"
            flood-opacity="1"
            result="stick3"
        />

        <feFlood ref="stick4"
            class="stick"
            x="0%"
            y="75%"
            width="100%"
            height="0.3%"
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

        <feComposite in="logo" operator="over" in2="box" result="box" />

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
                easing: 'linear',
                complete: () => {
                    this.stickAscend(this.$refs.stick1);
                    this.stickAscend(this.$refs.stick2);
                    this.stickAscend(this.$refs.stick3);
                    this.stickAscend(this.$refs.stick4);
                }
            }).add({
                targets: this.$refs.stick1,
                width: "0.3%",
                height: "0.3%",
                y: "20%",
                duration: 600
            }, 0).add({
                targets: this.$refs.stick2,
                width: "0.3%",
                height: "0.3%",
                x: "80%",
                duration: 600
            }, 0).add({
                targets: this.$refs.stick3,
                width: "0.3%",
                height: "0.3%",
                y: "73%",
                duration: 600
            }, 0).add({
                targets: this.$refs.stick4,
                width: "0.3%",
                height: "0.3%",
                x: "20%",
                duration: 600
            }, 0);
        },
        stickAscend: function(target)
        {
            this.anime({
                targets: target,
                easing: "easeInExpo",
                y: "0%",
                duration: parseInt(target.y.baseVal.valueAsString) / 100 * 1000,
                complete: () => {
                    this.stickAscended += 1;
                }
            });
        },
        drop: function()
        {
            this.anime.timeline({
                easing: "easeInExpo",
                complete: () => {
                    document.querySelector('body').style.filter = "";
                    this.eventBus.$emit('transitionEnd');
                }
            }).add({
                targets: this.$refs.stick1,
                width: "25%",
                height: "1%",
                x: "25%",
                duration: 500,
            }, 0).add({
                targets: this.$refs.stick2,
                width: "25%",
                height: "1%",
                x: "75%",
                duration: 500,
            }, 0).add({
                targets: this.$refs.stick3,
                width: "25%",
                height: "1%",
                x: "50%",
                duration: 500,
            }, 0).add({
                targets: this.$refs.stick4,
                width: "25%",
                height: "1%",
                x: "0%",
                duration: 500,
            }, 0).add({
                targets: Object.values(this.$refs),
                y: "+=100%",
                duration: 600,
            });
        }
    },
    mounted: function()
    {
        this.eventBus.$on('datasInitialized', () => {
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
        this.currentAnim = this.tictac("tic");
    }
}
</script>