<template>
    <div>
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>
        <v-menu open-on-hover>
            <v-btn slot="activator" flat>
                Filter <v-icon>arrow_drop_down</v-icon>
            </v-btn>
            <v-list class="menuOpen">
                <v-list-tile @click="getProjects()">
                    <v-list-tile-title>All</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="createdFilter()">
                    <v-list-tile-title>Created</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="backedFilter()">
                    <v-list-tile-title>Backed</v-list-tile-title>
                </v-list-tile>

            </v-list>
        </v-menu>
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            <v-container grid-list-xs fluid id="projects">
                <v-layout row wrap>
                <v-flex xs4 id="project" v-for="project in projects" v-if="project.open">
                    <v-card  class="v-card" height="100%">
                        <router-link :to="{ name : 'project', params: { projectId: project.id} }">
                            <v-card-media contain v-bind:src="'http://localhost:4941/api/v2/projects/' + project.id + '/image'" height="250"/>
                        </router-link>
                        <v-card-title primary-title>
                            <h3 class="headline mb-0"><router-link :to="{ name : 'project', params: { projectId: project.id} }">{{ project.title }} </router-link></h3>
                            <div> {{project.subtitle }} </div>
                        </v-card-title>
                    </v-card>
                </v-flex>
                    <h3 v-if="projects.length <= 0"> There are no projects for this filter</h3>
                </v-layout>
            </v-container>
        </div>

        </div>
</template>

<script>
    export default {
        data(){
            return {
                error: "",
                errorFlag: false,
                projects: [],
                selected: {},
                busy: false,
                count: 0,
                allLoaded: false
            }
        },
        mounted: function () {
            this.getProjects();
        },
        methods: {
            getProjects: function () {
                console.log(localStorage.getItem("id"));
                this.$http.get('http://127.0.0.1:4941/api/v2/projects/?open=true&startIndex=' + this.count + "&count=6")
                    .then(function (response) {
                        if (response.data.length > 0) {
                            this.projects = this.projects.concat(response.data);
                            this.count += 6;
                            this.allLoaded = false;
                        } else {
                            this.allLoaded = true;
                        }
                        this.busy = false;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            getProject : function(id) {
                this.$http.get('http://localhost:4941/api/v2/projects/' + id)
                    .then(function (response) {
                        this.selected = response.data;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });

            },
            createdFilter : function () {
                this.$http.get('http://127.0.0.1:4941/api/v2/projects/?open=true&creator=' + localStorage.getItem('id'))
                    .then(function (response) {
                        this.projects = response.data;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            backedFilter : function () {
                this.$http.get('http://127.0.0.1:4941/api/v2/projects/?open=true&backer=' + localStorage.getItem('id'))
                    .then(function (response) {
                        this.projects = response.data;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            loadMore : function () {
                console.log("Loading more");
                if (!this.allLoaded) {
                    this.busy = true;
                    this.getProjects();
                }


            }
        }
    }

</script>

<style>
    .menuOpen {
        background-color: snow;
    }
</style>