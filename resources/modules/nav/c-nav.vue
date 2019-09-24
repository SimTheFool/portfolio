<template>
    <nav>
        <span class="navBtn--left navBtn" v-on:click="clickLeft">
            <svg class="navBtn--symbol"
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-10 -10 120 120">
                <path d="M13.7,52.3c23,15.4,46,30.9,69,46.3c2.5,1.7,4.8-2.3,2.3-4c-23-15.4-46-30.8-69-46.2
                C13.6,46.7,11.2,50.5,13.7,52.3L13.7,52.3z M16,52.3c23-15.5,46-31.3,69-46.8c2.5-1.7,0.2-5.8-2.3-4c-23,15.5-46,31.3-69,46.8
                C11.2,49.9,13.6,54,16,52.3L16,52.3z"/>

                <circle cx="50" 
                        cy="50"
                        r="50"
                />
            </svg>  
        </span>
        <span class="navBtn--right navBtn" v-on:click="clickRight">
            <svg class="navBtn--symbol"
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-10 -10 120 120">
                <path d="M88.7,47.7c-23-15.4-46-30.9-69-46.3c-2.5-1.7-4.8,2.3-2.3,4c23,15.4,46,30.8,69,46.2
                C88.9,53.3,91.2,49.5,88.7,47.7L88.7,47.7z M86.4,47.7c-23,15.5-46,31.3-69,46.8c-2.5,1.7-0.2,5.8,2.3,4c23-15.5,46-31.3,69-46.8
                C91.2,50.1,88.9,46,86.4,47.7L86.4,47.7z"/>
                <circle cx="50" 
                        cy="50"
                        r="50"
                />
            </svg>
        </span>
    </nav>
</template>
<script>
export default {
    props:
    {
        left:
        {
            type: Object,
            default: () => {}
        },
        right:
        {
            type: Object,
            default: () => {}
        }
    },
    methods:
    {
        clickLeft: function()
        {
            this.$router.push(this.left);
        },
        clickRight: function()
        {
            this.$router.push(this.right);
        }
    }
}
</script>