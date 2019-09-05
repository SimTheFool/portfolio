<template>
    <div id="timeline">

        <c-path ref="path"></c-path>

    </div>
</template>

<script>

import cPath from 'Modules/path/c-path.vue';

export default {
    components:
    {
        'c-path': cPath
    },
    props:
    {
        content:
        {
            default: null
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
            this.$refs.path.createPath(this.content);
        }
    },
}

</script>