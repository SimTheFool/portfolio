<template>
    <filter primitiveUnits="objectBoundingBox">

<!--         <feFlood ref="box"
            class="box"
            x="0%"
            y="0%"
            width="0%"
            height="100%"
            flood-opacity="1"
            result="box"
        />

        <feGaussianBlur in="box" result="box" stdDeviation="0.025" />

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

 -->

        <feFlood ref="box"
            class="box"
            x="0%"
            y="0%"
            width="0%"
            height="100%"
            flood-opacity="1"
            result="box"
        />

        <feFlood ref="stick1"
            class="stick"
            x="0%"
            y="50%"
            width="0.05%"
            height="0%"
            flood-opacity="0"
            result="stick1"
        />

        <feFlood ref="stick2"
            class="stick"
            x="0%"
            y="50%"
            width="0.05%"
            height="0%"
            flood-opacity="0"
            result="stick2"
        />

        <feComposite in="stick1" operator="over" in2="box" result="box"/>
        <feComposite in="stick2" operator="over" in2="box" result="box"/>
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
            /* 
            stickTransited: 0,
            stickNb: 6 */
        }
    },
    watch:
    {
        /* stickTransited: function(val)
        {
            if(val >= this.stickNb)
            {
                this.transitOut();
            }
        } */
    },
    methods:
    {
        transitIn: function()
        {
            /* this.stickTransited = 0;

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
                    duration: 0,
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
                    duration: 0,
                    complete: () => {
                        this.$refs.sticks.forEach((el) => {
                            this.transitStick(el);
                        })
                    }
                }, 0);
            } */




            if(this.animDir === "right")
            {
                this.anime.timeline({
                    easing: 'linear',
                    complete: () => {
                        this.eventBus.$emit('transiting', this.animDir);
                        this.transitOut();
                    }
                }).add({
                    targets: [this.$refs.stick1, this.$refs.stick2],
                    "flood-opacity" : 1,
                    x: "99.9%",
                    duration: 10,
                }).add({
                    targets: this.$refs.box,
                    x: "100%",
                    duration: 10,
                }, 0).add({
                    targets: [this.$refs.stick1, this.$refs.stick2],
                    height: "100%",
                    y: "0%",
                    duration: 300,
                }).add({
                    targets: this.$refs.stick1,
                    x: "0%",
                    duration: 800,
                }).add({
                    targets: this.$refs.box,
                    width: "100%",
                    x: "0%",
                    duration: 800,
                }, "-=800")
            }
            else
            {
                this.anime.timeline({
                    easing: 'linear',
                    complete: () => {
                        this.eventBus.$emit('transiting', this.animDir);
                        this.transitOut();
                    }
                }).add({
                    targets: [this.$refs.stick1, this.$refs.stick2],
                    "flood-opacity" : 1,
                    x: "0%",
                    duration: 10,
                }).add({
                    targets: this.$refs.box,
                    x: "0%",
                    duration: 10,
                }, 0).add({
                    targets: [this.$refs.stick1, this.$refs.stick2],
                    height: "100%",
                    y: "0%",
                    duration: 300,
                }).add({
                    targets: this.$refs.stick1,
                    x: "99.9%",
                    duration: 800,
                }).add({
                    targets: this.$refs.box,
                    width: "100%",
                    duration: 800,
                }, "-=800");
            }
 
        },
        transitOut: function()
        {
            /* if(this.animDir === "right")
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
            } */




            if(this.animDir === "right")
            {
                this.anime.timeline({
                    easing: 'linear',
                    complete: () => {
                        document.querySelector('main').style.filter = "";
                        this.eventBus.$emit('transitionEnd');
                    }
                }).add({
                    targets: this.$refs.stick1,
                    height: "0%",
                    y: "50%",
                    duration: 300
                }).add({
                    targets: this.$refs.stick1,
                    "flood-opacity": 0,
                    duration: 10
                }).add({
                    targets: this.$refs.stick2,
                    x: "0%",
                    duration: 800
                }, 0).add({
                    targets: this.$refs.box,
                    width: "0%",
                    duration: 800
                }, 0).add({
                    targets: this.$refs.stick2,
                    y: "50%",
                    height: "0%",
                    duration: 300
                }).add({
                    targets: this.$refs.stick2,
                    "flood-opacity": 0,
                    duration: 10
                });
            }
            else
            {
                this.anime.timeline({
                    easing: 'linear',
                    complete: () => {
                        document.querySelector('main').style.filter = "";
                        this.eventBus.$emit('transitionEnd');
                    }
                }).add({
                    targets: this.$refs.stick1,
                    height: "0%",
                    y: "50%",
                    duration: 300
                }).add({
                    targets: this.$refs.stick1,
                    "flood-opacity": 0,
                    duration: 10
                }).add({
                    targets: this.$refs.stick2,
                    x: "99.9%",
                    duration: 800
                }, 0).add({
                    targets: this.$refs.box,
                    x: "99.9%",
                    duration: 800
                }, 0).add({
                    targets: this.$refs.stick2,
                    y: "50%",
                    height: "0%",
                    duration: 300
                }).add({
                    targets: this.$refs.stick2,
                    "flood-opacity": 0,
                    duration: 10
                });
            }
        },
        transitStick(target)
        {
            /* let w = this.anime.random(50, 100);

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
            } */
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