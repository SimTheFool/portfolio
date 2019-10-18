<template>
    <div id="timeline" class="section">

        <c-drawing ref="drawing"
            vbox="-10 -5 30 110"
            v-bind:d="d"
            v-bind:endpoints="endpoints"
            v-on:clickEndpoint="clickEndpoint"        
        >
            <c-cursor ref="cursor"
                width="40px"
                height="40px"
                v-bind:path="ePath"
                v-bind:content="currentDatas.year"
                contentType="text"
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
            initialized: false,
            d: '',
            endpoints: [],
            currentDatas: {},
            ePath: null,
            eDrawing: null,
            nCursor: null
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
                if(to.name !== 'parcours' || to.params.slug === undefined)
                {
                    return;
                }
                this.computeRoute(to.params.slug);
            }
        }
    },
    methods:
    {
        initialize: function()
        {
            this.initialized = true;

            let datas = [...this.content];
            datas.pop();
            let pathDatas = this.createPath(datas, 0.4);

            this.d = pathDatas.d;
            this.endpoints = pathDatas.endpoints;
            this.currentDatas = this.content[this.content.length - 1];
            this.ePath = this.$refs.drawing.$refs.path;

            this.$nextTick(() => {
                if(this.$route.params.slug === undefined)
                {
                    this.$router.push({ name: 'parcours', params: { slug: this.content[this.content.length - 1].slug } });
                }
                this.computeRoute(this.$route.params.slug);
            });
        },
        computeRoute(slug)
        {
            let index = this.content.findIndex((elem) => { return slug === elem.slug});
            this.transitCursor(index);
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
            endpoints.forEach((coord, i, a) => {
                if(i === 0){return;}

                a[i] = {
                    x : a[i-1].x + a[i].x,
                    y: a[i-1].y + a[i].y,
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
                d: d,
                endpoints: endpoints
            };
        },
        transitCursor: function(index)
        {
            this.nCursor.transitToLength(this.endpoints[index].length, index);
            
        },
        displayData: function(i)
        {
            this.currentDatas = this.content[i];
        },
        clickEndpoint: function(index)
        {
            this.$router.push({ name: 'parcours', params: { slug: this.content[index].slug } });
        },
        dragstart: function()
        {
            this.eDrawing.addEventListener('mousemove', this.drag);
            document.addEventListener('mouseup', this.dragend);
        },
        drag: function(e)
        {
            let y = this.utils.userToInitialCoordSys(
                this.eDrawing,
                {x: e.clientX, y: e.clientY}
            ).y;
            
            let i = this.endpoints.findIndex((elem) =>{
                return y <= elem.y;
            });

            if(i === -1)
            {
                this.nCursor.moveToLength(this.endpoints[this.endpoints.length - 1].length);
                return;
            }

            if(i === 0)
            {
                this.nCursor.moveToLength(0);
                return;
            }

            if(this.endpoints[i].y === y)
            {
                this.nCursor.moveToLength(this.endpoints[i].length);
                return;
            }

            let sup = this.endpoints[i];
            let inf = this.endpoints[i-1];
            let ratio = (y - inf.y)/(sup.y - inf.y);
            let l = inf.length + (sup.length - inf.length) * ratio;
            this.nCursor.moveToLength(l);
        },
        dragend: function()
        {
            this.eDrawing.removeEventListener('mousemove', this.drag);

            let l = this.nCursor.lengthOnPath;
            let i = this.endpoints.findIndex((elem) => {
                return  l <= elem.length;
            });

            let sup = this.endpoints[i];
            if(l === sup.length)
            {
                return;
            }

            let inf = this.endpoints[i-1];
            if(l - inf.length < sup.length - l)
            {
                this.transitCursor(i-1);
            }
            else
            {
                this.transitCursor(i);
            }
        }
    },
    mounted: function()
    {
            this.eDrawing = this.$refs.drawing.$el;
            this.nCursor = this.$refs.cursor;
    }
}

</script>