import Vue from 'Vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import anime from 'animejs';
import randomize from 'Utils/randomize.js';

Vue.use(VueResource);
Vue.use(VueRouter);

import cLogo from 'Modules/logo/c-logo.vue';

new Vue({
    el: '#app',
    components:
    {
        'c-logo': cLogo
    },
    methods:
    {
        getRdFloat: function(min, max)
        {
            return Math.random() * (max - min) + min;
        }
    },
    provide:
    {
        anime: anime,
        randomize: randomize,
    }
});