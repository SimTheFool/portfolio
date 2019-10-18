<template>
    <div class="viewer">
        

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
                this.$el.innerHTML = this.content.description;
            }
        }
    },
    mounted: function()
    {
        this.eventBus.$on('viewerHidden', () => {
            this.$el.innerHTML = this.content.description;
        });
    }
}
</script>