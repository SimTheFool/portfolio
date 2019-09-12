<template>
    <div id="skillwheel">
        <c-drawing
            ref="drawing"
            v-bind:d="d">
            
            <c-cursor 
                v-for="(data, index) in content"
                v-bind:ref="'cursors'"
                v-bind:path="ePath"
                v-bind:content="data.logo"
                contentType="svg"
                v-bind:data-id="index"
            ></c-cursor>
            
        </c-drawing>
        
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
            d: "M 50 12.2 L 88.8 40.4 L 74 86 L 26 86 L 11.2 40.4 z",
            endpoints: [{x: 50, y: 12.2, length: 0}],
            ePath: null,
            nCursors: []
        }
    },
    watch:
    {
        content: function(val)
        {
            if(val !== [])
            {
                this.$nextTick(() => {this.initialize()});
            }
        }
    },
    methods:
    {
        initialize: function()
        {
            this.nCursors = this.$refs.cursors;

            let segmentLength = this.ePath.getTotalLength() / this.nCursors.length ;
            this.nCursors.forEach((nCursor, i) => {
                nCursor.transitToLength(segmentLength * i);
            });
        }
    },
    mounted: function()
    {
        this.ePath = this.$refs.drawing.$refs.path;
    }
}
</script>