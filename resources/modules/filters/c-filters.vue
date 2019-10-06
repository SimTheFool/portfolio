<template>
    <div id="filters">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
            <defs>
                  <c-transition id="trans--main"></c-transition>  
            </defs>
        </svg>
    </div>
</template>

<script>

import cTransition from "Modules/filters/c-transition.vue"

export default {
    components:
    {
        'c-transition': cTransition,
    }
}
</script>