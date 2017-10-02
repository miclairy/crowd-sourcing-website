<template>
    <div>
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>

        <!--<div v-if="$route.params.userId">-->
            <!--<div id="user">-->
                <!--<router-link :to="{ name : 'users'}"> Back to Users</router-link>-->
                <!--<br/>-->
                <!--<br/>-->
                <!--<table>-->
                    <!--<tr>-->
                        <!--<td> User ID </td>-->
                        <!--<td> Username </td>-->
                    <!--</tr>-->
                    <!--<tr>-->
                        <!--<td> {{ $route.params.userId }} </td>-->
                        <!--<td> {{ getSingleUser($route.params.userId).username }}</td>-->
                    <!--</tr>-->
                <!--</table>-->
            <!--</div>-->
        <!--</div>-->

        <div v-else>
            <div id="projects">
                <table>
                    <tr v-for="project in projects">
                        <td> {{ project.title }}</td>
                    </tr>
                </table>
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
                projects: []
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
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            getProject : function(id) {
                for (var i = 0; i <= this.projects.length; i++){
                    if (this.projects[i].project_id == id){
                        return this.project[i];
                    }
                }
            }
        }
    }


</script>