<template>
    <filter primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB">

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
        

    </filter>
</template>
<script>
export default {
    inject: ['anime'],
    data: function()
    {
        return {
            canDisplace: false,
            edgeHeight: 0,
            edgeY: 37.5,
            rightShift: 128,
            leftShift: 128,
            rightOffset: 128,
            leftOffset: 128
        }
    },
    computed:
    {
        hexRightPanel: function()
        {
            let alpha = Math.floor(this.rightShift).toString(16);
            let red = Math.floor(this.rightOffset).toString(16);
            alpha = (alpha.length < 2) ? '0' + alpha : alpha;
            red = (red.length < 2) ? '0' + red : red;
            return `#${red}8080${alpha}`;
        },
        hexLeftPanel: function()
        {
            let alpha = Math.floor(this.leftShift).toString(16);
            let red = Math.floor(this.leftOffset).toString(16);
            alpha = (alpha.length < 2) ? '0' + alpha : alpha;
            red = (red.length < 2) ? '0' + red : red;
            return `#${red}8080${alpha}`;
        }
    },
    methods:
    {
        split: function()
        {
            this.anime({
                targets: this,
                edgeY: 0,
                edgeHeight: 100,
                duration: 1500,
                easing: 'linear',
                complete: () => {
                    this.canDisplace = true;
                    this.shift();
                }
            });
        },
        shift: function()
        {
            this.anime({
                targets: this,
                rightShift: 135,
                leftShift: 118,
                duration: 10,
                delay: 2000,
                complete: () => {
                    this.open();
                }
            })
        },
        open: function()
        {
            this.anime({
                targets: this,
                rightOffset: 0,
                leftOffset: 255,
                duration: 2000,
                easing:'linear'
            })
        }
    },
    mounted: function()
    {
        this.split();
    }
}
</script>