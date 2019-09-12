<template>
    <div id="skillwheel">
        <c-drawing v-bind:d="d">
            

            
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
            endpoints: [{x: 50, y: 12.2, length: 0}]
        }
    },
    watch:
    {
        content: function(val)
        {
            if(val !== {})
            {
                this.initialize();
            }
        }
    },
    methods:
    {
        initialize: function()
        {
            
        }
    }
}
</script>