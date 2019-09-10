<template>
    <div id="timeline">

        <c-path ref="path"
            v-on:clickEndpoint="moveCursor"        
        >
            <c-cursor ref="cursor"
                v-bind:path="path"
                v-bind:endpoints="endpoints"
                v-on:reachEndpoint="displayData"
                draggable="true"
            ></c-cursor>
        </c-path>

        <c-viewer v-bind:content="currentDatas"></c-viewer>

    </div>
</template>

<script>

import cPath from 'Modules/path/c-path.vue';
import cCursor from 'Modules/cursor/c-cursor.vue';
import cViewer from 'Modules/viewer/c-viewer.vue';

export default {
    inject: ['anime'],
    components:
    {
        'c-path': cPath,
        'c-cursor': cCursor,
        'c-viewer': cViewer
    },
    props:
    {
        content:
        {
            default: null
        }
    },
    data: function()
    {
        return {
            path: null,
            endpoints: [],
            currentDatas: {},
        }
    },
    watch:
    {
        content: function(val)
        {
            if(val !== null)
            {
                this.initialize();
            }
        }
    },
    methods:
    {
        initialize: function()
        {
            let datas = [...this.content];
            datas.pop();

            let pathDatas = this.$refs.path.createPath(datas, 0.5);
            this.path = pathDatas.path;
            this.endpoints = pathDatas.endpoints;
            this.currentDatas = this.content[this.content.length - 1];
        },
        moveCursor: function(i)
        {
            this.$refs.cursor.moveToEndpoint(i);
        },
        displayData: function(i)
        {
            this.currentDatas = this.content[i];
        }
    },
    provide: function()
    {
        anime: this.anime
    }
}

</script>