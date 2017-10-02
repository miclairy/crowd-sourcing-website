<template>
    <div>
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>

        <div v-if="$route.params.projectId">
            <div id="project-big">
                <router-link :to="{ name : 'projects'}"> Back to Projects</router-link>
                <br/>
                <br/>
                <h1> {{ selected.title }} </h1>
                <h2> {{ selected.subtitle }} </h2>
                <p> {{ selected.description }} </p>
            </div>
        </div>

        <div v-else>
            <div id="projects" class="container-fluid">
                <div class="row">
                    <div id="project" v-for="project in projects" class="col-sm-4">
                        <div class="v-card" style="width: 20rem;">
                            <img class="v-card-media" src="https://images.vice.com/vice/images/articles/meta/2014/12/30/tony-hawk-talks-about-the-rise-of-the-hoverboard-456-1419972535.jpeg?crop=1xw:1xh;center,center&resize=1050:*" alt="project img" width="200" height="300"/>
                            <div class="card-block">
                                <h4 class="card-title">{{ project.title }}</h4>
                                <p class="card-text"> {{ project.subtitle }}</p>
                                <!--<p class="card-text"> {{ project.description }}</p>-->
                            </div>
                        </div>

                    </div>
                </div>
            </div>
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
            }
        },
        mounted: function () {
            this.getProjects();
            this.getProject(this.$route.params.projectId);
        },
        methods: {
            getProjects: function () {
                this.$http.get('http://localhost:4941/api/v2/projects')
                    .then(function (response) {
                        this.projects = response.data;
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            getProject : function(id) {
                if (id != null) {
                    this.$http.get('http://localhost:4941/api/v2/projects/' + id)
                        .then(function (response) {
                            this.selected = response.data;
                            return this.selected;
                        }, function (error) {
                            this.error = error;
                            this.errorFlag = true;
                        });
                }
            }
        }
    }

</script>
