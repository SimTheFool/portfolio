<template>
    <svg class="icon icon--clickable" version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                v-on:click="$emit('click', $event.currentTarget)">

        <path v-bind:d="iconData"/>

    </svg>
</template>

<script>
    export default  {
        props:
        {
            iconData: ""
        },
        methods:
        {
            setActive: function(boolean)
            {

                if(boolean)
                {
                    this.$el.classList.remove('icon--clickable');
                    this.$el.classList.add('icon--active');
                    return;
                }

                this.$el.classList.add('icon--clickable');
                this.$el.classList.remove('icon--active');
            }
        }
    }
</script>