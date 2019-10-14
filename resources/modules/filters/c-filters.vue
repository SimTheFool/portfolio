<template>
    <div id="filters">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
            <defs>
                  <c-section-transition class="trans" id="trans--section"></c-section-transition>
                  <c-loading-transition class="trans" id="trans--loading"></c-loading-transition>
                  <c-viewer-transition class="trans" id="trans--viewer"></c-viewer-transition>
            </defs>
        </svg>
    </div>
</template>

<script>

import cSectionTransition from "Modules/filters/c-section-transition.vue";
import cLoadingTransition from "Modules/filters/c-loading-transition.vue";
import cViewerTransition from "Modules/filters/c-viewer-transition.vue";

export default {
    components:
    {
        'c-section-transition': cSectionTransition,
        'c-loading-transition': cLoadingTransition,
        'c-viewer-transition': cViewerTransition,
    }
}
</script>