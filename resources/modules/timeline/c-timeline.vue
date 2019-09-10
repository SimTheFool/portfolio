<template>
    <div id="timeline">

        <c-drawing ref="drawing"
            v-bind:path="path"
            v-bind:endpoints="endpoints"
            v-on:clickEndpoint="animateCursor"        
        >
            <c-cursor ref="cursor"
                v-bind:path="pathRef"
                v-bind:endpoints="endpoints"
                v-on:reachEndpoint="displayData"
                v-on:mousedown="dragstart"
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
    inject: ['anime', 'utils'],
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
            path: '',
            pathRef: null,
            endpoints: [],
            currentDatas: {},
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
            let datas = [...this.content];
            datas.pop();
            let pathDatas = this.createPath(datas, 0.5);

            this.path = pathDatas.path;
            this.endpoints = pathDatas.endpoints;
            this.currentDatas = this.content[this.content.length - 1];
            this.pathRef = this.$refs.drawing.$refs.path;
        },
        // Compute the path d attribute based on datas. Return an array of endpoints constituting the path.
        createPath: function(datas, slope)
        {
            let sum = datas.reduce((a, e) => {return a + e.duration}, 0);
            let endpoints = datas.map((e) => {return e.duration/sum*100});
            this.utils.clampAndBalance(endpoints, 10, 30);

            // Array of coordinates relative to previous point coordinates.
            endpoints.forEach((y, i, a)=>{
                let newSlope = (i === 0 || i === a.length - 1) ? slope/2 : slope;
                let x = y * newSlope;
                x *= this.utils.checkParity(i);
                a[i] = {
                    x : x,
                    y: y
                }
            });
            endpoints.unshift({x:0, y:0});

            // Array of absolute coordinates
            endpoints.forEach(function(coord, i, a){
                if(i === 0){return;}

                a[i] = {
                    x : a[i-1].x + a[i].x,
                    y: a[i-1].y + a[i].y
                }
            });

            // Generating the d attribute, and computing the length of each endpoint on the path.
            let d = '';
            let virtualPathNode = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            endpoints.forEach( (coord, i, a) => {
                d += (i === 0) ? 'M 0 0' : ` L ${coord.x} ${coord.y}`;
                virtualPathNode.setAttribute('d', d);
                a[i].length = virtualPathNode.getTotalLength();
            });

            return {
                path: d,
                endpoints: endpoints
            };
        },
        animateCursor: function(i)
        {
            this.$refs.cursor.moveToEndpoint(i);
        },
        moveCursor: function(l)
        {
            this.$refs.cursor.move(l);
        },
        displayData: function(i)
        {
            this.currentDatas = this.content[i];
        },
        dragstart: function()
        {
            this.$refs.drawing.$el.addEventListener('mousemove', this.drag);
            document.addEventListener('mouseup', this.dragend);
        },
        drag: function(e)
        {
            let y = this.utils.userToInitialCoordSys(
                this.$refs.drawing.$el,
                {x: e.layerX, y: e.layerY}
            ).y;
            
            let i = this.endpoints.findIndex((elem) =>{
                return y <= elem.y;
            });

            if(i === -1)
            {
                this.moveCursor(this.endpoints[this.endpoints.length - 1].length);
                return;
            }

            if(i === 0)
            {
                this.moveCursor(0);
                return;
            }

            if(this.endpoints[i].y === y)
            {
                this.moveCursor(this.endpoints[i].length);
                return;
            }

            let sup = this.endpoints[i];
            let inf = this.endpoints[i-1];
            let ratio = (y - inf.y)/(sup.y - inf.y);
            let l = inf.length + (sup.length - inf.length) * ratio;
            this.moveCursor(l);
        },
        dragend: function()
        {
            this.$refs.drawing.$el.removeEventListener('mousemove', this.drag);
        }
    },
}

</script>