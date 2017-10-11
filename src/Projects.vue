<template>
    <div>
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>

            <v-container grid-list-xs fluid id="projects"  >
                <v-layout row wrap>
                <v-flex xs4 id="project" v-for="project in projects">
                    <v-card  class="v-card" height="100%">
                        <v-card-media contain v-bind:src="'http://localhost:4941/api/v2/projects/' + project.id + '/image'" height="250"/>
                        <v-card-title primary-title>
                            <h3 class="headline mb-0"><router-link :to="{ name : 'project', params: { projectId: project.id} }">{{ project.title }} </router-link></h3>
                            <div> {{project.subtitle }} </div>
                        </v-card-title>
                    </v-card>
                </v-flex>
                </v-layout>
            </v-container>

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
                show: []
            }
        },
        mounted: function () {
            this.getProjects();
        },
        methods: {
            getProjects: function () {
                console.log(localStorage.getItem("id"));
                this.$http.get('http://localhost:4941/api/v2/projects')
                    .then(function (response) {
                        this.projects = response.data;
                        let size = this.projects.length;
                        while(size--) this.show.push(false);
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

            }
        }
    }

</script>

<style>
</style>