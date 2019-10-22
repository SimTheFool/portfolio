<template>
    <svg class="drawing" version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                v-bind:viewBox="vbox"
                preserveAspectRatio="xMidYMid meet">
        <path class="line" ref="path" v-bind:d="d"/>
        <line v-for="(point, index) in endpoints"
            class="endpoint"
            v-bind:x1="point.x - 2"
            v-bind:y1="point.y"
            v-bind:x2="point.x - 5 - endpointsOffset[index]"
            v-bind:y2="point.y"
        />
        <line v-for="(point, index) in endpoints"
            ref="endpointClickers"
            class="endpoint--clicker"
            v-bind:x1="point.x"
            v-bind:y1="point.y"
            v-bind:x2="point.x - 7 - endpointsOffset[index]"
            v-bind:y2="point.y"
            v-bind:data-id="index"
            v-on:click="click($event.currentTarget.dataset.id)"
            v-on:mouseover="mouseover($event.currentTarget.dataset.id)"
            v-on:mouseout="mouseout($event.currentTarget.dataset.id)"
        />
        <slot></slot>
    </svg>
</template>

<script>
export default {
    inject: ['anime'],
    props:
    {
        vbox: "",
        d:
        {
            type: String,
            default: ''
        },
        endpoints:
        {
            type: Array,
            default: () => []
        },
    },
    data: function()
    {
        return {
            endpointsOffset: {},
            movingTo: null,
        }
    },
    watch:
    {
        endpoints: function(val, oldVal)
        {
            if(val.length > 0)
            {
                this.endpointsOffset = {};

                for(let i = 0; i < val.length; i++)
                {
                    this.$set(this.endpointsOffset, i.toString(), 0);
                }
            }
        },
        movingTo: function(val, oldVal)
        {
            let id = oldVal;

            this.anime({
                targets: this.endpointsOffset,
                easing: 'linear',
                [id]: 0,
                duration: 500,
           });
        }
    },
    methods:
    {
       click: function(id)
       {
           if(this.movingTo === id)
           {
               return;
           }

           this.anime({
               targets: this.endpointsOffset,
               easing: 'linear',
               [id]: 5,
               duration: 500,
               begin: () => {
                   this.movingTo = id;
               }
           });

           this.$emit('clickEndpoint', id);
       },
       mouseover: function(id)
       {
            if(this.movingTo === id)
            {
                return;
            }

           this.anime({
               targets: this.endpointsOffset,
               easing: 'linear',
               [id]: 2,
               duration: 300,
           });
       },
       mouseout: function(id)
       {
            if(this.movingTo === id)
            {
                return;
            }

           this.anime({
               targets: this.endpointsOffset,
               easing: 'linear',
               [id]: 0,
               duration: 300,
           });
       }
    }
}
</script>