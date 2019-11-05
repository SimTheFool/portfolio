<template>
    <div id="skillwheel" class="section">
        
        <div class="drawing">
            <c-icon
                ref="icons"
                v-for="(elem, index) in content"
                v-bind:data-id="index"
                v-bind:iconData="elem.logo"
                v-on:click="click"
            >
            </c-icon>

        </div>

        <c-viewer v-bind:content="currentDatas"></c-viewer>
        
    </div>
</template>
<script>

import cIcon from 'Modules/icon/c-icon.vue';
import cViewer from 'Modules/viewer/c-viewer.vue';

export default {
    components:
    {
        'c-viewer': cViewer,
        'c-icon': cIcon

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
            currentDatas: {}
        }
    },
    watch:
    {
        content:
        {
            handler: function(val, oldVal)
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
                
                let oldIndex = this.content.findIndex((elem) => { return elem.slug === from.params.slug});
                let newIndex = this.content.findIndex((elem) => { return elem.slug === to.params.slug});
                this.$refs.icons[oldIndex].setActive(false);
                this.$refs.icons[newIndex].setActive(true);
                this.computeRoute(to.params.slug);
            }
        }
    },
    methods:
    {
        initialize: function()
        {
            this.$nextTick(() => {
                if(this.$route.params.slug === undefined)
                {
                    this.$refs.icons[0].setActive(true);
                    this.$router.push({ name: 'competences', params: { slug: this.content[0].slug }});
                }
                else
                {
                    let currentIndex = this.content.findIndex((elem) => { return this.$route.params.slug === elem.slug});
                    this.$refs.icons[currentIndex].setActive(true);
                    this.computeRoute(this.$route.params.slug);
                }
            });
        },
        computeRoute: function(slug)
        {
            this.currentDatas = this.content.find((elem) => { return slug === elem.slug});
        },
        click: function(e)
        {
            let currentIndex = this.content.findIndex((elem) => { return this.$route.params.slug === elem.slug});
            let newIndex = e.dataset.id;

            if(currentIndex == newIndex)
            {
                return;
            }

            this.$router.push({ name: 'competences', params: { slug: this.content[e.dataset.id].slug } });
        }
    },
    mounted: function()
    {

    }
}
</script>