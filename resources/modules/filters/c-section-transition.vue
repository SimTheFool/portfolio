<template>
    <filter primitiveUnits="objectBoundingBox">
        <feFlood
            class="flood--margin"
            v-bind:x="marginX"
            v-bind:y="marginY"
            v-bind:width="marginWidth"
            v-bind:height="marginHeight"
            flood-opacity="1"
            result="flood--margin"
        />

        <feFlood
            class="flood--box"
            x="0%"
            y="0%"
            width="100%"
            v-bind:height="boxHeight"
            flood-opacity="1"
            result="flood--box"
        />

        <feComposite in="flood--margin" in2="flood--box" operator="over" result="flood--box"/>

        <feComposite in="flood--box" in2="SourceGraphic" operator="over" result="source--clipped"/>
        
    </filter>
</template>

<script>
export default {
    inject: ['anime'],
    data: function()
    {
        return {
            marginX: "30%",
            marginY: "0%",
            marginWidth: "40%",
            marginHeight: "0.25%",
            boxHeight: "0%"
        }
    },
    methods:
    {
        drop: function()
        {
            return this.anime.timeline({
                autoplay: false,
                easing: "linear"
            }).add({
                targets: this,
                marginX: "0%",
                marginWidth: "100%",
                duration: 300
            }).add({
                targets: this,
                marginY:"98%",
                duration:1000,
            }, 300).add({
                targets: this,
                boxHeight:"98%",
                duration: 1000,
            }, 300);
        },
        ascend: function()
        {
            return this.anime.timeline({
                autoplay: false,
                easing: "linear"
            }).add({
                targets: this,
                marginY:"0%",
                duration:1000,
            }, 0).add({
                targets: this,
                boxHeight:"0%",
                duration: 1000,
            }, 0).add({
                targets: this,
                marginX: "25%",
                marginWidth: "50%",
                duration: 300
            }, "-=300");
        }
    },
    mounted: function()
    {
        document.addEventListener('keydown', (e) => {
            if(e.keyCode === 80)
            {
                this.drop().play();
            }
        });

        document.addEventListener('keydown', (e) => {
            if(e.keyCode === 79)
            {
                this.ascend().play();
            }
        });
    }
}
</script>