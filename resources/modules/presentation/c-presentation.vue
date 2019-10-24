<template>
    <div ref="presentation" id="presentation" class="section"></div>
</template>
<script>
export default {
    props:
    {
        content:
        {
            type: Object,
            default: () => {return {
                presentation: "ABCD"
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
                });
            },
            immediate: true
        }
    }
    
}
</script>