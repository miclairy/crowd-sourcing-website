import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import Home from './Home.vue';
import Projects from './Projects.vue';
import VueResource from 'vue-resource';
import Vuetify from 'vuetify'
import ProjectDetails from './ProjectDetails.vue';
import Login from './Login.vue'
import SignUp from './SignUp.vue'

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

// import('./node_modules/vuetify/dist/vuetify.min.css') // Ensure you are using css-loader

const routes = [
    {
        path: "/",
        component: Home
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
    }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});