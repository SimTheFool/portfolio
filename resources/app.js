import Vue from 'Vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';

import anime from 'animejs';
import utils from 'Utils/utils.js';

import cHeader from 'Modules/header/c-header.vue';
import cNav from 'Modules/nav/c-nav.vue';
import cFilters from 'Modules/filters/c-filters.vue';

import cTimeline from 'Modules/timeline/c-timeline.vue';
import cSkillwheel from 'Modules/skillwheel/c-skillwheel.vue';
import cPresentation from 'Modules/presentation/c-presentation.vue';

const EventBus = new Vue();
Vue.use(VueResource);
Vue.use(VueRouter);
new Vue({
    el: '#app',
    components:
    {
        'c-header': cHeader,
        'c-nav': cNav,
        'c-filters': cFilters,
    },
    router: new VueRouter({
        base: '/',
        mode: 'history',
        routes: [
            { path: '/', name: 'presentation', component: cPresentation},
            { path: '/parcours/:slug?', name: 'parcours', component: cTimeline },
            { path: '/competences/:slug?', name: 'competences', component: cSkillwheel }
        ]
    }),
    data:
    {
        websiteContent: {},
        currentRoutes: [
            {name : 'presentation'}, 
            {name : 'parcours', params: {slug: ''}}, 
            {name : 'competences', params: {slug: ''}}, 
        ],
        currentRouteId: 0
    },
    computed:
    {
        routedProps: function()
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
            else if(this.$route.name === 'presentation')
            {
                return {
                    content : this.websiteContent.general
                };
            }
        },
        navProps:function()
        {
            return {
                left: this.currentRoutes[((this.currentRouteId - 1) % 3 + 3) % 3],
                right: this.currentRoutes[(this.currentRouteId + 1) % 3]
            }
        }
    },
    watch:
    {
        $route:
        {
            handler: function(val)
            {
                if(val.name === 'presentation')
                {
                    this.currentRouteId = 0;
                }
                else if(val.name === 'parcours' && val.params.slug !== undefined)
                {
                    this.currentRoutes[1].params.slug = val.params.slug;
                    this.currentRouteId = 1;
                }
                else if(val.name === 'competences' && val.params.slug !== undefined)
                {
                    this.currentRoutes[2].params.slug = val.params.slug;
                    this.currentRouteId = 2;
                }
            },
            immediate: true
        }
    },
    methods:
    {
        initNavigation: function()
        {
            let parcoursSlug = this.websiteContent.timeline.slice(-1)[0].slug;
            let competencesSlug = this.websiteContent.skillwheel[0].slug;

            this.currentRoutes[1].params.slug = this.currentRoutes[1].params.slug || parcoursSlug;
            this.currentRoutes[2].params.slug = this.currentRoutes[2].params.slug || competencesSlug;
        },
        setMetaDescription: function()
        {
            let meta = document.querySelector('meta[name="description"]');
            meta.content = this.websiteContent.general.meta; 
        },
        parseXmltoObj: function(xml)
        {
            let obj = {};

            let general = [...xml.querySelector('general').children];
            obj.general = {};
            general.forEach((e) => {
                obj.general[e.tagName] = e.innerHTML.replace(/\n/g, '');
            });

            let timeline = [...xml.querySelector('timeline').children];
            obj.timeline = [];
            timeline.forEach((e) => {
                let attributes = [...e.attributes];
                let newObj = {}

                attributes.forEach((e) => {
                    newObj[e.name] = e.value;
                });
                newObj.description = e.innerHTML.replace(/\n/g, '');

                obj.timeline.push(newObj);
            });

            let skillwheel = [...xml.querySelector('skillwheel').children];
            obj.skillwheel = [];
            skillwheel.forEach((e) => {
                let attributes = [...e.attributes];
                let newObj = {}

                attributes.forEach((e) => {
                    newObj[e.name] = e.value;
                });
                newObj.description = e.innerHTML.replace(/\n/g, '');

                obj.skillwheel.push(newObj);
            });
            
            return obj;
        }
    },
    beforeCreate: function()
    {
        this.$http.get('/datas/datas.xml').then(function(response){

            let parser = new DOMParser();
            let xml = parser.parseFromString(response.data, "text/xml");
            let datas = this.parseXmltoObj(xml);

            this.websiteContent = datas;
            //EventBus.$emit('datasInitialized');

            this.initNavigation();
            this.setMetaDescription();
                 
        }, function(error){
            console.log('Erreur : Les données n\'ont pu être récupérées');
        });
    },
    mounted: function()
    {
        let stopAppClick = function(e){
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
        };
        
        EventBus.$on('transitionBegin', () => {
            this.$el.addEventListener('click', stopAppClick, true);
        });

        EventBus.$on('transitionEnd', () => {
            this.$el.removeEventListener('click', stopAppClick, true);
        });
    },
    provide:
    {
        anime: anime,
        utils: utils,
        eventBus: EventBus
    }
});