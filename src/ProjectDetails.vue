<template>
    <div>
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>
        <div id="project-big">
            <br/>
            <br/>
            <h1> {{ selected.title }} </h1>
            <h2> {{ selected.subtitle }} </h2>
            <p> {{ selected.description }} </p>
            <p> Creators: </p>
                <div v-for="creator in selected.creators">
                    <p>{{ creator.username }}</p>
                </div>
            <p> {{ selected.creationDate }} </p>
            <p> Rewards: </p>
            <v-container>
            <v-flex xs4 v-for="reward in selected.rewards">
                <v-layout row>
                <p>{{ reward.amount }}</p>
                    <v-spacer></v-spacer>
                <p>  {{ reward.description }}</p>
                </v-layout>
            </v-flex>
            </v-container>
            <p> Target: {{ selected.target }} </p>
            <v-card-media contain v-bind:src="'http://localhost:4941/api/v2/projects/' + selected.id + '/image'" width="200" height="250"/>

        </div>
    </div>
</template>


<script>
    export default {
        data(){
            return {
                error: "",
                errorFlag: false,
                selected: {},
            }
        },
        mounted: function () {
            this.getProject(this.$route.params.projectId);
        },
        methods: {
            getProject : function(id) {
                if (id != null) {
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
    }

</script>