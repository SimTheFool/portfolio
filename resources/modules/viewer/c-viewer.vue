<template>
    <div class="viewer">
        
        {{effectiveContent.description}}

    </div>
</template>
<script>
export default {
    inject: ["eventBus"],
    props:
    {
        content:
        {
            type: Object,
            default: () => {}
        }
    },
    data: function ()
    {
        return {
            effectiveContent: {}
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
                this.effectiveContent = this.content;
            }
        }
    },
    mounted: function()
    {
        this.eventBus.$on('viewerHidden', () => {
            this.effectiveContent = this.content;
        });
    }
}
</script>