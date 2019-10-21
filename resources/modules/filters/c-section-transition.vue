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
        }
    },
    methods:
    {
        transitIn: function()
        {
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
                    width: "0%",
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