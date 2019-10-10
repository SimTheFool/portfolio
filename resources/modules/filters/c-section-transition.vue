<template>
    <filter primitiveUnits="objectBoundingBox">

        <feFlood ref="box"
            class="box"
            x="0%"
            y="0%"
            width="0%"
            height="100%"
            flood-opacity="1"
            result="box"
        />

        <feFlood v-for="i in stickNb"
            ref="sticks"
            class="stick"
            x="0%"
            y="0%"
            width="0%"
            height="0.05%"
            flood-opacity="1"
            v-bind:result="'stick' + i"
        />

        <feComposite v-for="i in stickNb" v-bind:in="'stick' + i" operator="over" in2="box" result="box"/>
        <feComposite in="box" operator="over" in2="SourceGraphic"  result="source"/>


        
    </filter>
</template>

<script>
export default {
    inject: ['anime', 'eventBus'],
    data: function()
    {
        return {
            animDir: "right",
            stickTransited: 0,
            stickNb: 6
        }
    },
    watch:
    {
        stickTransited: function(val)
        {
            if(val >= this.stickNb)
            {
                this.transitOut();
            }
        }
    },
    methods:
    {
        transitIn: function()
        {
            this.stickTransited = 0;

            this.$refs.sticks.forEach((el, i, arr) => {
                let min = i*100/arr.length;
                let max = min + 100/arr.length;
                let y = this.anime.random(min, max);
                el.setAttribute("y", `${y}%`);
            });

            if(this.animDir === "right")
            {
                this.$refs.box.setAttribute("x", "100%");
                this.$refs.sticks.forEach((el, i, arr) => {
                    el.setAttribute("x", "100%");
                });

                this.anime.timeline({
                    easing: "linear"
                }).add({
                    targets: this.$refs.box,
                    duration: 600,
                    x: "0%",
                    width: "100%",
                    complete: () => {
                        this.eventBus.$emit('transiting', this.animDir);
                    }
                }).add({
                    duration: 300,
                    complete: () => {
                        this.$refs.sticks.forEach((el) => {
                            this.transitStick(el);
                        })
                    }
                }, 0);
            }
            else
            {
                this.$refs.box.setAttribute("x", "0%");
                this.$refs.sticks.forEach((el, i, arr) => {
                    el.setAttribute("x", "0%");
                });

                this.anime.timeline({
                    easing: "linear"
                }).add({
                    targets: this.$refs.box,
                    duration: 600,
                    width: "100%",
                    complete: () => {
                        this.eventBus.$emit('transiting', this.animDir);
                    }
                }).add({
                    duration: 300,
                    complete: () => {
                        this.$refs.sticks.forEach((el) => {
                            this.transitStick(el);
                        })
                    }
                }, 0);
            }
 
        },
        transitOut: function()
        {
            if(this.animDir === "right")
            {
                this.anime({
                    easing: "linear",
                    targets: this.$refs.box,
                    duration: 600,
                    width: "0%",
                    complete: () => {
                        document.querySelector('main').style.filter = "";
                        this.eventBus.$emit('transitionEnd');
                    }
                });
            }
            else
            {
                this.anime({
                    easing: "linear",
                    targets: this.$refs.box,
                    duration: 600,
                    width: "0%",
                    x: "100%",
                    complete: () =>  {
                        document.querySelector('main').style.filter = "";
                        this.eventBus.$emit('transitionEnd');
                    }
                });
            }
        },
        transitStick(target)
        {
            let w = this.anime.random(50, 100);

            if(this.animDir === "right")
            {
                this.anime.timeline({
                    targets: target,
                    easing: "linear"
                }).add({
                    width: `${w}%`,
                    x: `${100-w}%`,
                    delay: this.anime.random(0, 300),
                    duration: w * 600 / 100,
                    complete: () => {
                        this.stickTransited += 1;
                    }
                }).add({
                    x: "0%",
                    duration: (100 - w) * 600 / 100
                }).add({
                    width: "0%",
                    duration: w * 600 / 100
                });
            }
            else
            {
                this.anime.timeline({
                    targets: target,
                    easing: "linear"
                }).add({
                    width: `${w}%`,
                    delay: this.anime.random(0, 300),
                    duration: w * 600 / 100,
                    complete: () => {
                        this.stickTransited += 1;
                    }
                }).add({
                    x: `${100-w}%`,
                    duration: (100 - w) * 600 / 100
                }).add({
                    x: "100%",
                    width: "0%",
                    duration: w * 600 / 100
                });
            }
        }
    },
    mounted: function()
    {
        this.eventBus.$on('navigate', (e) => {
            this.eventBus.$emit('transitionBegin');
            document.querySelector('main').style.filter = 'url("#trans--section")';
            this.animDir = e;
            this.transitIn();
        });
    }
}
</script>