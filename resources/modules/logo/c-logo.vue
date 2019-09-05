<template>
    <div id=logo>

        <svg version="1.1"
            baseProfile="full"
            xmlns="http://www.w3.org/2000/svg"
            width="100%" height="100%" viewBox="0 0 100 100">

            <defs>
                <filter id="binary_filter">

                    <!-- bump map & clip map generation -->
                    <feTurbulence type="fractalNoise" baseFrequency="0.2 0" numOctaves="2" seed="3" stitchTiles="nostitch" result="noise_1"/>
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
                    <feDisplacementMap in="fragment" in2="noise_alpha_vert" xChannelSelector="G" yChannelSelector="A" v-bind:scale="vertOffset" filterUnits="userSpaceOnUse" result="fragment"/>

                    <!-- secondary bump map generation and application -->
                    <feTurbulence type="fractalNoise" baseFrequency="0 0.2" numOctaves="1" seed="2" stitchTiles="nostitch" result="noise_2"/>
                    <feComponentTransfer in="noise_2" result="noise_alpha_hor">
                        <feFuncR type="discrete" tableValues="0.5"/>
                        <feFuncG type="discrete" tableValues="0.5"/>
                        <feFuncB type="discrete" tableValues="0.5"/>
                        <feFuncA type="discrete" tableValues="0.5 1"/>
                    </feComponentTransfer>
                    <feDisplacementMap in="fragment" in2="noise_alpha_hor" xChannelSelector="A" yChannelSelector="R" v-bind:scale="horOffset" filterUnits="userSpaceOnUse" result="fragment"/>

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
                <filter id="polychrome_filter">

                    <feTurbulence type="turbulence" baseFrequency="0.5" numOctaves="5" seed="3" stitchTiles="nostitch" result="displacement_map"/>

                    <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="5" seed="3" stitchTiles="nostitch" result="noise_chroma_1"/>
                    <feDisplacementMap in="noise_chroma_1" in2="displacement_map" xChannelSelector="R" yChannelSelector="G" v-bind:scale="chromaDisplacement1" filterUnits="userSpaceOnUse" result="noise_chroma_1"/>


                    <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="5" seed="1" stitchTiles="nostitch" result="noise_chroma_2"/>
                    <feDisplacementMap in="noise_chroma_2" in2="displacement_map" xChannelSelector="B" yChannelSelector="A" v-bind:scale="chromaDisplacement2" filterUnits="userSpaceOnUse" result="noise_chroma_2"/>


                    <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="5" seed="5" stitchTiles="nostitch" result="noise_chroma_3"/>
                    <feDisplacementMap in="noise_chroma_3" in2="displacement_map" xChannelSelector="A" yChannelSelector="R" v-bind:scale="chromaDisplacement3" filterUnits="userSpaceOnUse" result="noise_chroma_3"/>


                    <feMerge result="noise_chroma">
                        <feMergeNode in="noise_chroma_1"/>
                        <feMergeNode in="noise_chroma_2"/>
                        <feMergeNode in="noise_chroma_3"/>
                    </feMerge>
                    <feComponentTransfer in="noise_chroma" result="noise_chroma">
                        <feFuncA type="discrete" tableValues="1"/>
                    </feComponentTransfer>

                    <feComposite in="noise_chroma" in2="SourceAlpha" operator="in" result="final"/>




                </filter>
            </defs>

            <rect width="100" height="100" fill="black"/>
            <g filter="url(#binary_filter)" :style="style">
                <text class="binaire" x="50" y="25" font-size="15" text-anchor="middle">BINAIRE</text>
            </g>
            <g filter="url(#polychrome_filter)">
                <text class="polychrome" x="50" y="75" font-size="10" text-anchor="middle" fill="grey" font-weight="light">Polychrome</text>
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
            opacity: 0,
            vertOffset: 0,
            horOffset: 0,
            noiseSeed: 1,
            chromaDisplacement1: -15,
            chromaDisplacement2: 0,
            chromaDisplacement3: 5,
        };
    },
    computed:
    {
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
            vertOffset: 5,
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
            horOffset: 2,
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

        this.anime({
            chromaDisplacement1: 100,
            duration: 300,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            loop: true
        });

        this.anime({
            targets: this,
            chromaDisplacement2: 100,
            duration: 1500,
            delay: 1000,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            loop: true
        });

        this.anime({
            targets: this,
            chromaDisplacement3: 100,
            duration: 500,
            delay: 500,
            easing: 'easeInOutQuad',
            direction: 'alternate',
            loop: true
        });
    }
}
</script>