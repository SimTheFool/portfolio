<template>
    <filter primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB">
<!-- 
        <feFlood
            x="0%"
            y="0%"
            width="50%"
            height="100%"
            flood-color="#888"
            flood-opacity="1"
            result="clipper"
        />

        <feFlood
            v-bind:flood-color="hexLeftPanel"
            flood-opacity="1"
            result="left--panel"
        />

        <feFlood
            v-bind:flood-color="hexRightPanel"
            flood-opacity="1"
            result="right--panel"
        />

        <feFlood
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            flood-color="black"
            flood-opacity="1"
            result="background"
        />

        <feFlood
            class="flood--edge"
            x="49.75%"
            v-bind:y="edgeY + '%'"
            width="0.5%"
            v-bind:height="edgeHeight + '%'"
            flood-opacity="1"
            result="edge"
        />

        <feImage x="25%" y="25%" width="50%" height="50%"  xlink:href="/media/oz.svg" result="logo"></feImage>
        <feComposite in="edge" in2="logo" operator="over" result="logo"/>
        <feComposite in="logo" in2="background" operator="over" result="logo"/>
        
        <feComposite in="logo" in2="clipper" operator="in" result="left--logo"/>
        <feDisplacementMap v-if="canDisplace" in="left--logo" in2="left--panel" xChannelSelector="R" yChannelSelector="A" scale="1.25" result="left--logo"/>

        
        <feComposite in="logo" in2="clipper" operator="out" result="right--logo"/>
        <feDisplacementMap v-if="canDisplace" in="right--logo" in2="right--panel" xChannelSelector="R" yChannelSelector="A" scale="1.25" result="right--logo"/>

        <feComposite in="right--logo" in2="left--logo" operator="over" result="loading"/>
        <feComposite in="loading" in2="SourceGraphic" operator="over" result="loading"/>
         -->

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
                console.log('hey!');
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
            console.log('drop');
            this.anime.timeline({
                easing: "easeInExpo",
                complete: () => {
                    document.querySelector('body').style.filter = "";
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

        document.querySelector('body').style.filter = 'url("#trans--loading")';
        this.currentAnim = this.tictac("tic");
    }
}
</script>