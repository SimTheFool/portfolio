<template>
    <filter primitiveUnits="objectBoundingBox">
        <feFlood ref="stick"
            class="stick"
            x="50%"
            y="0%"
            width="0%"
            height="0.05%"
            flood-opacity="0"
            result="stick"
        />

        <feFlood ref="box"
            class="box"
            x="0%"
            y="0%"
            width="100%"
            height="0%"
            flood-opacity="1"
            result="box"
        />

        <feComposite in="stick" operator="over" in2="box" result="box"/>

        <feComposite in="box" operator="over" in2="SourceGraphic" result="result"/>


    </filter>
</template>

<script>
export default {
    inject: ['anime', 'eventBus'],
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
                easing: "linear",
                complete: () => {
                    this.ascend();
                    this.eventBus.$emit('viewerHidden');
                }
            }).add({
                targets: this.$refs.stick,
                "flood-opacity": 1,
                duration: 0
            }).add({
                targets: this.$refs.stick,
                x: "0%",
                width: "100%",
                duration: 300
            }).add({
                targets: this.$refs.stick,
                y:"100%",
                duration:600,
            }, 300).add({
                targets: this.$refs.box,
                height:"100%",
                duration: 600,
            }, 300);
        },
        ascend: function()
        {
            this.anime.timeline({
                easing: "linear",
                complete: () => {
                    this.eventBus.$emit('transitionEnd');
                    document.querySelector('.viewer').style.filter = '';
                }
            }).add({
                targets: this.$refs.stick,
                y:"0%",
                duration:600,
            }, 0).add({
                targets: this.$refs.box,
                height:"0%",
                duration: 600,
            }, 0).add({
                targets: this.$refs.stick,
                x: "50%",
                width: "0%",
                duration: 300
            }).add({
                targets: this.$refs.stick,
                "flood-opacity": 0,
                duration: 10
            });
        }
    },
    mounted: function()
    {
        this.eventBus.$on('viewerNewContent', () => {
            this.eventBus.$emit('transitionBegin');
            document.querySelector('.viewer').style.filter = 'url("#trans--viewer")';
            this.drop();
        });
    }
}
</script>