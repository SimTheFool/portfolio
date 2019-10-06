<template>
    <filter primitiveUnits="objectBoundingBox">
        <feFlood ref="flood--margin"
            class="flood--margin"
            x="25%"
            y="0%"
            width="50%"
            height="0.25%"
            flood-opacity="1"
            result="flood--margin"
        />

        <feFlood ref="flood--box"
            class="flood--box"
            x="0%"
            y="0%"
            width="100%"
            height="0%"
            flood-opacity="1"
            result="flood--box"
        />

        <feFlood ref="flood--noise"
            class="flood--noise"
            x="0%"
            y="0%"
            width="100%"
            height="0%"
            flood-opacity="1"
            result="flood--noise"
        />

        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.8" numOctaves="10" seed="3" stitchTiles="stitch" result="noise"/>
        <feComponentTransfer in="noise" result="noise">
                        <feFuncR type="discrete" tableValues="1"/>
                        <feFuncG type="discrete" tableValues="1"/>
                        <feFuncB type="discrete" tableValues="1"/>
                        <feFuncA type="discrete" tableValues="0 1"/>
        </feComponentTransfer>

        <feComposite in="SourceGraphic" in2="noise" operator="in" result="noise"/>
        <feComposite in="SourceGraphic" in2="noise" operator="out" result="noise2"/>

        <feComponentTransfer in="noise2" result="noise2">
                        <feFuncR type="discrete" tableValues="0"/>
                        <feFuncG type="discrete" tableValues="0"/>
                        <feFuncB type="discrete" tableValues="0"/>
                        <feFuncA type="discrete" tableValues="0 1"/>
        </feComponentTransfer>

        <feComponentTransfer in="noise" result="noise">
                        <feFuncR type="discrete" tableValues="0 1"/>
                        <feFuncG type="discrete" tableValues="0 1"/>
                        <feFuncB type="discrete" tableValues="0 1"/>
                        <feFuncA type="discrete" tableValues="0 1"/>
        </feComponentTransfer>

        <feColorMatrix type="matrix" in="noise" result="noise"
           values="0 0 0 0 1
                   0 0 0 0 1
                   0 0 0 0 1
                   10 10 10 0 0"
        />

        <feComposite in="noise2" in2="flood--noise" operator="in" result="flood--noise2"/>

        <feComposite in="flood--noise" in2="noise" operator="in" result="flood--noise"/>

        <feComposite in="flood--noise" in2="flood--noise2" operator="over" result="flood--noise"/>






        <feComposite in="flood--margin" in2="flood--box" operator="over" result="flood--box"/>

        <feComposite in="flood--box" in2="SourceGraphic" operator="over" result="source--clipped"/>

        <feComposite in="flood--noise" in2="source--clipped" operator="over"/>

        
    </filter>
</template>

<script>
export default {
    inject: ['anime'],
    data: function()
    {
        return {
        }
    },
    methods:
    {
        drop: function()
        {
            this.anime.timeline({
                easing: "linear"
            }).add({
                targets: this.$refs["flood--margin"],
                x: "0%",
                width: "100%",
                height: '*=0.1',
                duration: 300
            }).add({
                targets: this.$refs["flood--margin"],
                y:"98%",
                duration:1000,
            }, 300).add({
                targets: this.$refs["flood--box"],
                height:"98%",
                duration: 1000,
            }, 300).add({
                targets: this.$refs["flood--noise"],
                height: "10%",
                y: "100%",
                duration: 0
            }, 0);
        },
        ascend: function()
        {
            this.anime.timeline({
                easing: "linear"
            }).add({
                targets: this.$refs["flood--noise"],
                y: "0%",
                duration: 1000
            }, 0).add({
                targets: this.$refs["flood--margin"],
                y:"0%",
                duration:1000,
            }, 0).add({
                targets: this.$refs["flood--box"],
                height:"0%",
                duration: 1000,
            }, 0).add({
                targets: this.$refs["flood--noise"],
                height: "0%",
                duration: 100
            }).add({
                targets: this.$refs["flood--margin"],
                x: "25%",
                width: "50%",
                height: '*=10',
                duration: 300
            }, "-=300");
        }
    },
    mounted: function()
    {
        document.addEventListener('keydown', (e) => {
            if(e.keyCode === 80)
            {
                this.drop();
            }
        });

        document.addEventListener('keydown', (e) => {
            if(e.keyCode === 79)
            {
                this.ascend();
            }
        });
    }
}
</script>