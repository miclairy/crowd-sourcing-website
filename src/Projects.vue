<template>
    <div>
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>

            <v-container grid-list-xs id="projects" >
                <v-layout row wrap>
                <v-flex xs4 id="project" v-for="project in projects">
                    <v-card  >
                        <v-card-media contain src="https://images.vice.com/vice/images/articles/meta/2014/12/30/tony-hawk-talks-about-the-rise-of-the-hoverboard-456-1419972535.jpeg?crop=1xw:1xh;center,center&resize=1050:*" width="200" height="250"/>
                        <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0"><router-link :to="{ name : 'project', params: { projectId: project.id} }">{{ project.title }} </router-link></h3>
                                <div> {{project.subtitle }} </div>
                            </div>
                        </v-card-title>
                        <v-card-actions>

                            <v-spacer></v-spacer>
                            <v-btn icon @click.native="show[project.id - 1] = !show[project.id - 1]">
                                <v-icon>{{ show[project.id - 1] ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                            </v-btn>
                        </v-card-actions>
                        <v-slide-y-transition>
                            <v-card-text v-show="show[project.id - 1]">
                                I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
                            </v-card-text>
                        </v-slide-y-transition>
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
                show: [],
            }
        },
        mounted: function () {
            this.getProjects();
        },
        methods: {
            getProjects: function () {
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