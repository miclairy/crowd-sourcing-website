<template>
    <div>
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>
        <v-layout row >
            <v-text-field v-model="searchText" single-line label="Search Projects...." :append-icon="'search'" class="search"></v-text-field>
            <v-menu open-on-hover v-if="! isLoggedIn()" class="center">
                <v-btn slot="activator" flat>
                    {{ filter}} <v-icon>arrow_drop_down</v-icon>
                </v-btn>
                <v-list class="menuOpen">
                    <v-list-tile @click="noFilter()">
                        <v-list-tile-title>All</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="setCreated()">
                        <v-list-tile-title>Created</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="setBacked()">
                        <v-list-tile-title>Backed</v-list-tile-title>
                    </v-list-tile>

                </v-list>
            </v-menu>
        </v-layout>
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="3" class="containerWidth">
            <v-container grid-list-lg fluid id="projects">
                <v-layout row wrap>
                <v-flex d-flex lg4 id="project" v-for="project in search">
                    <v-card  class="v-card" height="100%">
                        <router-link :to="{ name : 'project', params: { projectId: project.id} }">
                            <v-card-media v-bind:src="'http://csse-s365.canterbury.ac.nz:4836/api/v2/projects/' + project.id + '/image'" height="250"/>
                        </router-link>
                        <v-card-title primary-title>
                            <h3 class="headline mb-0 textProject"><router-link :to="{ name : 'project', params: { projectId: project.id} }">{{ project.title }} </router-link></h3>
                        </v-card-title>
                            <div class="textProject smText"> {{project.subtitle }} </div>

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
                results: [],
                selected: {},
                busy: false,
                count: 0,
                allLoaded: false,
                searchText: "",
                filter: "Filter",
                lastSearch: ""
            }
        },
        mounted: function () {
            this.getProjects();
        },
        computed: {
            search : function () {

                if (this.searchText.length > 0) {
                    if (this.searchText !== this.lastSearch) {
                        this.count = 6;
                        this.lastSearch = this.searchText;
                    }
                    this.results = [];
                    for (let i = 0; i < this.projects.length; i += 1) {
                        if (this.projects[i].title.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1 ||
                            this.projects[i].subtitle.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1) {
                            this.results.push(this.projects[i]);
                        }
                    }
                    console.log("search count " + this.count);
                    this.results = this.results.slice(0, this.count);
                    return this.results;

                } else {
                    return this.results
                }

            },
        },
        methods: {
            getProjects: function () {
                console.log(localStorage.getItem("id") + " Loading project ");
                this.$http.get('http://csse-s365.canterbury.ac.nz:4836/api/v2/projects/?open=true')
                    .then(function (response) {
                        if (response.data.length > 0) {
                            console.log(this.projects.length);
                            this.projects = response.data;
                            this.results = this.projects.slice(0, 6);
                            console.log(this.results);
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
                this.$http.get('http://csse-s365.canterbury.ac.nz:4836/api/v2/projects/' + id)
                    .then(function (response) {
                        this.selected = response.data;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });

            },
            createdFilter : function () {
                this.filter = "Created";
                this.$http.get('http://csse-s365.canterbury.ac.nz:4836/api/v2/projects/?creator=' + localStorage.getItem('id'))
                    .then(function (response) {
                        this.projects = response.data;
                        this.results = this.projects.slice(0, 6);
                        this.count += 6;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            backedFilter : function () {
                this.$http.get('http://csse-s365.canterbury.ac.nz:4836/api/v2/projects/?backer=' + localStorage.getItem('id'))
                    .then(function (response) {
                        this.projects = response.data;
                        this.results = this.projects.slice(0, 6);
                        this.count += 6;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            setBacked : function () {
                this.count = 0;
                this.filter = "Backed";
                this.results = [];
                if (!this.isLoggedIn()){
                this.backedFilter();
                } else {
                    this.getProjects()
                }

            },
            setCreated : function () {
                this.count = 0;
                this.filter = "Created";
                this.results = [];
                if (!this.isLoggedIn()) {

                    this.createdFilter();
                } else {
                    this.getProjects()
                }

            },
            loadMore : function () {
                this.count += 6;
                console.log("Loading more " + this.count);
                if (this.count < this.projects.length) {
                    this.busy = true;

                    this.results = this.projects.slice(0, this.count);
                    this.busy = false;
                } else {
                    this.results = this.projects;
                }
            },
            isLoggedIn : function () {
                let isUser = localStorage.getItem("id") == "null" || localStorage.getItem("id") == 'undefined' || localStorage.getItem('id') == null;
                return isUser;
            },
            noFilter: function () {
                this.filter = "All";
                this.count = 0;
                this.getProjects()
//                console.log(this.results);
            }
        }
    }

</script>

<style>
    .menuOpen {
        background-color: snow;
    }

    .search{
        max-width: 600px;
        margin: auto;
    }

    .center{
        margin: auto;
    }

    .containerWidth{

        max-width: 1400px;
        margin-left: auto;
        margin-right: auto;
        align-content: center;
    }

    .textProject {
        text-align: left;
        font-size: 16px;
    }

    .smText {
       margin-left: 20px;
        margin-right: 20px;
        padding-bottom: 10px;
    }
</style>