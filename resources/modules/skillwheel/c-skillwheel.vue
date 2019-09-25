<template>
    <div id="skillwheel" class="section">
        <c-drawing
            ref="drawing"
            vbox="0 -30 250 40"
            v-bind:d="d">
            
            <c-cursor 
                v-for="(data, index) in content"
                v-bind:ref="'cursors'"
                v-bind:path="ePath"
                v-bind:content="data.logo"
                contentType="svg"
                v-bind:data-id="index"
                v-on:click="click"
                v-on:reachEndpoint="reachEndpoint"
            ></c-cursor>
            
        </c-drawing>

        <c-viewer v-bind:content="currentDatas"></c-viewer>
        
    </div>
</template>
<script>

import cDrawing from 'Modules/drawing/c-drawing.vue';
import cCursor from 'Modules/cursor/c-cursor.vue';
import cViewer from 'Modules/viewer/c-viewer.vue';

export default {
    components:
    {
        'c-drawing': cDrawing,
        'c-cursor': cCursor,
        'c-viewer': cViewer
    },
    props:
    {
        content:
        {
            type: Array,
            default: () => []
        }
    },
    data: function()
    {
        return {
            d: "M 125 0 L 250 0 M 0 0 L 125 0",
            endpoints: [{x: 50, y: 12.2, length: 0}],
            ePath: null,
            nCursors: [],
            currentCursorId: 0,
            isSpinning: false,
            currentDatas: {}
        }
    },
    watch:
    {
        content:
        {
            handler: function(val)
            {
                if(val.length > 0)
                {
                    this.$nextTick(() => {this.initialize()});
                }
            },
            immediate: true            
        },
        $route: 
        {
            handler: function(to, from)
            {
                if(to.name !== 'competences' || to.params.slug === undefined)
                {
                    return;
                }
  
                if(!this.isSpinning)
                {
                    this.computeRoute(to.params.slug);
                }
            }
        }
    },
    methods:
    {
        initialize: function()
        {
            this.nCursors = this.$refs.cursors;
            this.currentDatas = this.content[0];

            let totalLength = this.ePath.getTotalLength();
            let segmentLength = this.ePath.getTotalLength() / this.nCursors.length ;
            this.isSpinning = true;
            this.nCursors.forEach((nCursor, i) => {
                let length = segmentLength * i;
                length = (length > totalLength * 0.5) ? length - totalLength : length;
                if(i === Math.floor(this.nCursors.length / 2.0))
                {
                    nCursor.transitToLength(length, false, 'initialized');
                }
                else
                {
                    nCursor.transitToLength(length, false);
                }
            });

            this.$nextTick(() => {
                if(this.$route.params.slug === undefined)
                {
                    this.$router.push({ name: 'competences', params: { slug: this.content[0].slug }});
                }
            });
        },
        computeRoute: function(slug)
        {   
            let index = this.content.findIndex((elem) => { return slug === elem.slug});
            this.moveCursorToEndpoint(index);
        },
        moveCursorToEndpoint(cursorIndex)
        {
            this.isSpinning = true;

            let newCursor = this.nCursors[cursorIndex];
            let currentCursor = this.nCursors[this.currentCursorId];
            let newCursorLength = newCursor.lengthOnPath;

            let totalLength = this.ePath.getTotalLength();
            let offset = 0;

            if(newCursorLength >= totalLength * 0.5)
            {
                newCursor.transitToLength(totalLength, false, cursorIndex);
                currentCursor.moveToLength(totalLength); 
            }
            else
            {
               newCursor.transitToLength(0, false, cursorIndex);
               currentCursor.moveToLength(0); 
            }

            currentCursor.transitToLength(newCursorLength);
            this.currentCursorId = cursorIndex;
        },
        reachEndpoint: function(i)
        {
            this.isSpinning = false;
            if(i === 'initialized')
            {
                this.computeRoute(this.$route.params.slug);
                return;
            }
            this.currentDatas = this.content[i];
        },
        click: function(index)
        {
            if(this.isSpinning)
            {
                return;
            }
            this.$router.push({ name: 'competences', params: { slug: this.content[index].slug }});
        }
    },
    mounted: function()
    {
        this.ePath = this.$refs.drawing.$refs.path;
    }
}
</script>