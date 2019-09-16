import Vue from 'Vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import anime from 'animejs';
import random from 'random';
import utils from 'Utils/utils.js';

import cLogo from 'Modules/logo/c-logo.vue';



import cTimeline from 'Modules/timeline/c-timeline.vue';
import cSkillwheel from 'Modules/skillwheel/c-skillwheel.vue';


Vue.use(VueResource);
Vue.use(VueRouter);
new Vue({
    el: '#app',
    components:
    {
        'c-logo': cLogo,
        'c-timeline': cTimeline,
        'c-skillwheel': cSkillwheel
    },
    router: new VueRouter({
        base: '/',
        mode: 'history',
        routes: [
            { path: '/parcours', name: 'parcours', component: cTimeline},
            { path: '/competences', name: 'competences', component: cSkillwheel }
        ]
    }),
    data:
    {
        websiteContent: {},
    },
    computed:
    {
        content: function()
        {
            if(this.$route.name === 'parcours')
            {
                return this.websiteContent.timeline;
            }
            else if(this.$route.name === 'competences')
            {
                return this.websiteContent.skillwheel;
            }
        }
    },
    beforeCreate: function()
    {
        this.$http.get('./datas/datas.json').then(function(response){
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