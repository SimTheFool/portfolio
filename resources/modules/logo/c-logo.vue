<template>
    <div id=logo>

        <svg version="1.1"
            baseProfile="full"
            xmlns="http://www.w3.org/2000/svg"
            width="100%" height="100%" viewBox="0 0 100 100">

            <defs>
                <filter id="binary_filter">

                    <!-- bump map & clip map generation -->
                    <feTurbulence type="fractalNoise" v-bind:baseFrequency="vertMapFrequency" numOctaves="2" seed="3" stitchTiles="nostitch" result="noise_1"/>
                    <feComponentTransfer in="noise_1" result="noise_alpha_vert">
                        <feFuncR type="discrete" tableValues="0.65"/>
                        <feFuncG type="discrete" tableValues="0.65"/>
                        <feFuncB type="discrete" tableValues="0.65"/>
                        <feFuncA type="discrete" tableValues="0 1"/>
                    </feComponentTransfer>

                    <!-- fragment generation from clip map -->
                    <feComposite in="SourceAlpha" in2="noise_alpha_vert"
                    operator="in"
                    result="fragment"/>
                    <!-- base generation from fragment -->
                    <feComposite in2="SourceAlpha" in="fragment"
                    operator="xor"
                    result="base"/>

                    <!-- displacment from clip/bump map -->
                    <feDisplacementMap in="fragment" in2="noise_alpha_vert" xChannelSelector="G" yChannelSelector="A" scale="5" filterUnits="userSpaceOnUse" result="fragment"/>

                    <!-- secondary bump map generation and application -->
                    <feTurbulence type="fractalNoise" v-bind:baseFrequency="horMapFrequency" numOctaves="1" seed="2" stitchTiles="nostitch" result="noise_2"/>
                    <feComponentTransfer in="noise_2" result="noise_alpha_hor">
                        <feFuncR type="discrete" tableValues="0.5"/>
                        <feFuncG type="discrete" tableValues="0.5"/>
                        <feFuncB type="discrete" tableValues="0.5"/>
                        <feFuncA type="discrete" tableValues="0.5 1"/>
                    </feComponentTransfer>
                    <feDisplacementMap in="fragment" in2="noise_alpha_hor" xChannelSelector="A" yChannelSelector="R" scale="2" filterUnits="userSpaceOnUse" result="fragment"/>

                    <!-- merging base and fragment to get the final result -->
                    <feMerge result="final">
                        <feMergeNode in="fragment"/>
                        <feMergeNode in="base"/>
                    </feMerge>

                    <!-- applying noise to get white noise looking texture // 2.5-->
                    <feTurbulence
                    type="fractalNoise" baseFrequency="4" numOctaves="1" :seed="noiseSeed" stitchTiles="nostitch" result="white_noise"/>
                    <feComponentTransfer in="white_noise" result="white_noise">
                        <feFuncR type="discrete" tableValues="0.5"/>
                        <feFuncG type="discrete" tableValues="0.5"/>
                        <feFuncB type="discrete" tableValues="0.5"/>
                    </feComponentTransfer>
                    <feComposite in="final" in2="white_noise"
                    operator="in"
                    result="final"/>

                    <!-- font color -->
                    <feFlood flood-color="white" result="color_sample"/>
                    <feComposite in="color_sample" in2="final"
                    operator="in"
                    result="final"/>
                </filter>
            </defs>

            <rect width="100" height="100" fill="black"/>
            <g filter="url(#binary_filter)" :style="style">
                <text x="50" y="50" font-size="25" color="white" text-anchor="middle" fill="grey">SVG</text>
            </g>
        </svg>

    </div>
    
</template>

<script>
export default {
    inject: ['anime', 'randomize'],
    data: function()
    {
        return {
            vertMap: 0,
            horMap: 0,
            noiseSeed: 1,
            color: 'white',
            opacity: 0,
        };
    },
    computed:
    {
        vertMapFrequency: function()
        {
            return [this.vertMap, 0] ;
        },
        horMapFrequency: function()
        {
            return [0, this.horMap] ;
        },
        style: function()
        {
            return {
                opacity: this.opacity
            };
        }
    },
    mounted: function()
    {
        this.anime.timeline({
            targets: this,
        }).add({
            opacity: 1,
            easing: 'easeInCirc',
            duration: 1500,
        });

        this.anime({
            targets: this,
            noiseSeed: 30,
            easing: 'linear',
            duration: 100,
            loop: true,
            direction: 'alternate'
        });

        var vertMapAnime = 
        {
            targets: this,
            vertMap: 0.2,
            easing: 'steps(1)',
            duration: () => {
                return this.anime.random(250,800);
            },
            direction: 'alternate',
            delay: () => {
                return this.anime.random(250, 6000);
            },
            complete: () => {
                this.anime(vertMapAnime);
            }
        };
        this.anime(vertMapAnime);

        var horMapAnime = 
        {
            targets: this,
            horMap: 0.2,
            easing: 'steps(1)',
            duration: () => {
                return this.anime.random(100,400);
            },
            direction: 'alternate',
            delay: () => {
                return this.anime.random(150, 1000);
            },
            complete: () => {
                this.anime(horMapAnime);
            }
        };
        this.anime(horMapAnime);
    }
}
</script>