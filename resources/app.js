import Vue from 'Vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import anime from 'animejs';
import random from 'random';
import utils from 'Utils/utils.js';

import cTimeline from 'Modules/timeline/c-timeline.vue';
import cSkillwheel from 'Modules/skillwheel/c-skillwheel.vue';
import cHeader from 'Modules/header/c-header.vue';
import cNav from 'Modules/nav/c-nav.vue';

Vue.use(VueResource);
Vue.use(VueRouter);
new Vue({
    el: '#app',
    components:
    {
        'c-timeline': cTimeline,
        'c-skillwheel': cSkillwheel,
        'c-header': cHeader,
        'c-nav': cNav,
    },
    router: new VueRouter({
        base: '/',
        mode: 'history',
        routes: [
            { path: '/parcours/:slug?', name: 'parcours', component: cTimeline },
            { path: '/competences/:slug?', name: 'competences', component: cSkillwheel }
        ]
    }),
    data:
    {
        websiteContent: {},
    },
    computed:
    {
        properties: function()
        {
            if(this.$route.name === 'parcours')
            {
                return {
                    content : this.websiteContent.timeline
                };
            }
            else if(this.$route.name === 'competences')
            {
                return {
                    content : this.websiteContent.skillwheel
                };
            }
        }
    },
    beforeCreate: function()
    {
        this.$http.get('/datas/datas.json').then(function(response){
            this.websiteContent = response.data;
        }, function(error){
            console.log('Erreur : Les données n\'ont pu être récupérées');
        })
    },
    provide:
    {
        anime: anime,
        random: random,
        utils: utils
    }
});