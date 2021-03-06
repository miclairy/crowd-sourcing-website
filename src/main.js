import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Home from './Home.vue';
import Projects from './Projects.vue';
import VueResource from 'vue-resource';
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import ProjectDetails from './ProjectDetails.vue';
import Login from './Login.vue'
import SignUp from './SignUp.vue'
import CreateProject from './CreateProject.vue'
import infiniteScroll from 'vue-infinite-scroll'
import Icon from 'vue-awesome/components/Icon.vue'
import 'vue-awesome/icons'


Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(infiniteScroll);

Vue.component('icon', Icon);

const routes = [
    {
        path: "/",
        redirect: "/projects"
    },
    {
        path: '/projects',
        name: "projects",
        component: Projects
    },
    {
        path: '/projects/:projectId',
        name: "project",
        component: ProjectDetails
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/signup',
        component: SignUp
    },
    {
        path: '/create',
        component: CreateProject
    }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history'
});

// const store = new Vuex.Store({
//     state: {
//         token: null,
//         id: null
//     },
//     mutations: {
//         setValues (state, token, id) {
//             state.token = token;
//             state.id = id;
//         },
//         logout (state){
//             state.token = "";
//             state.id = -1;
//             alert("Continue dreaming later")
//         }
//     }
// });

new Vue({
  el: '#app',
  router: router,
    // store : store,
  render: h => h(App)
});

