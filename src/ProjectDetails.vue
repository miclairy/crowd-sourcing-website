<template>
    <div>
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>
        <v-container id="project-big">
            <br/>
            <br/>
            <h1> {{ selected.title }} </h1>
            <h2> {{ selected.subtitle }} </h2>
            <p> {{ selected.description }} </p>
            <v-flex xs4 v-for="reward in selected.rewards">
                <v-layout row>
                    <p id="created"> Created </p>
                    <p class="creators" > {{ creationDate }} by </p>
                <div  v-for="creator in selected.creators">
                    <p> {{ creator.username }} </p>
                </div>

                </v-layout>
            </v-flex>
            <p> Rewards: </p>

            <v-flex xs4 v-for="reward in selected.rewards">
                <v-layout row>
                <p>{{ reward.amount }}</p>
                    <v-spacer></v-spacer>
                <p>  {{ reward.description }}</p>
                </v-layout>
            </v-flex>
            <p> Target: {{ selected.target }} </p>
            <v-card-media contain v-bind:src="'http://localhost:4941/api/v2/projects/' + selected.id + '/image'" width="200" height="250"/>
            <button class="button" type="button" v-on:click="pledge()">pledge</button>


        </v-container>
    </div>

</template>


<script>
    import moment from "moment";

    export default {
        data(){
            return {
                error: "",
                errorFlag: false,
                selected: {},
                creationDate: "1/1/1111",
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
                            this.creationDate =  moment(this.selected.creationDate).calendar(null, {
                                sameDay: '[Today]',
                                nextDay: '[Tomorrow]',
                                nextWeek: 'dddd',
                                lastDay: '[Yesterday]',
                                lastWeek: '[Last] dddd',
                                sameElse: 'DD/MM/YYYY'
                            });
                        }, function (error) {
                            this.error = error;
                            this.errorFlag = true;
                        });
                }
            },
            pledge : function () {
                return true;
            }
        }
    }

</script>

<style>
    .creators {
        margin-left: 5px;
        margin-right: 5px;
    }

    .button {
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 5px -5px 15px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 14px;
    }
</style>