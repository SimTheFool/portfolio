<template>
    <div ref="presentation" id="presentation" class="section"></div>
</template>
<script>
export default {
    inject: ['eventBus'],
    props:
    {
        content:
        {
            type: Object,
            default: () => {return {
                presentation: ""
            }}
        }
    },
    watch:
    {
        content:
        {
            handler:function(val, oldVal)
            {
                this.$nextTick(() => {
                    this.$refs.presentation.innerHTML = val.presentation;
                    let links = this.$el.querySelectorAll('a');
                    links.forEach((link) => {
                        link.addEventListener('mouseenter', () => {
                            this.eventBus.$emit('focus');
                        });
                        link.addEventListener('mouseleave', () => {
                            this.eventBus.$emit('unfocus');
                        });
                    });
                });
            },
            immediate: true
        }
    }
    
}
</script>