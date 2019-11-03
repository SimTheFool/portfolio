<template>
    <div class="viewer">
        <div ref="placeholder">Brenda</div>
        <c-viewer-transition></c-viewer-transition>
    </div>
</template>
<script>
import cViewerTransition from 'Modules/transition/c-viewerTransition.vue';

export default {
    inject: ["eventBus"],
    components: 
    {
        'c-viewer-transition': cViewerTransition
    },
    props:
    {
        content:
        {
            type: Object,
            default: () => {}
        }
    },
    datas: function()
    {
        return {
            parser: null
        }
    },
    watch:
    {
        content: function(val, oldVal)
        {
            if(Object.entries(oldVal).length > 0)
            {
                this.eventBus.$emit('viewerNewContent');
            }
            else
            {
                this.setContentAsHTML(this.content.description);
            }
        }
    },
    methods:
    {
        setContentAsHTML: function(content)
        {
            let children = [...this.$el.childNodes];
            for(let i = 0; i < children.length - 1; i++)
            {
                children[i].remove();
            }

            let nodes = this.parser.parseFromString(content, "text/html").querySelector('body').childNodes;
            for(let i = nodes.length - 1; i--; i >= 0)
            {
                this.$el.prepend(nodes[i]);
            }
        }
    },
    mounted: function()
    {
        this.parser = new DOMParser();

        this.eventBus.$on('viewerHidden', () => {
            this.setContentAsHTML(this.content.description);
        });
    }
}
</script>