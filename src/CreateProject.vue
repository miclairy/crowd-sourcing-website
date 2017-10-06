<template>
    <div>
        <h2>Create a Project</h2>
        <v-container fluid>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader>Title</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field v-model="title" label="Free Donuts"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader>Subtitle</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field v-model="subtitle" name="input-2-3" label="for everyone" single-line></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader>Description</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field v-model="description" name="input-7-3" label="Talk about your project" multi-line></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader>Error</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field name="input-3-5" label="Hint Text" value="Input text"
                            :rules="[() => 'Username or Password is incorrect.']"
                            error single-line
                    ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader>Target</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field  v-model="target" label="Amount" value="10021.00" prefix="$"></v-text-field>
                </v-flex>
            </v-layout>

            <v-layout row>
                <v-flex xs4>
                <v-subheader>Rewards</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field label="Amount" value="10.00"
                    ></v-text-field>
                </v-flex>
                <v-flex xs8>
                    <v-text-field label="Description"></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>

                <v-flex xs8>
                <v-btn class="pink" small top right fab>
                    <v-icon>add</v-icon>
                </v-btn>
                </v-flex>
            </v-layout>

            <v-layout row>
                <v-flex xs4>
                    <v-subheader>Creators</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field label="Username" :rules="[() => 'Username doesn\'t exist']" error ></v-text-field>
                </v-flex>
                <v-flex xs8>
                    <v-btn class="pink" small top right fab>
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>




        <button class="createbtn" type="button" v-on:click="createProject()">Create Project</button>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                title: "New house for Eeyore ",
                subtitle: "Rebuild eeyores house",
                description: "Rebuild eeyores house because it fell down :",
                target: 10000,
                creators: [],
                rewards: []
            }
        },
        methods : {

            createProject: function(){
                let project = {
                    "title": this.title,
                    "subtitle": this.subtitle,
                    "description": this.description,
                    "target": this.target,
                    creators: [ {
                        "id" : parseInt(localStorage.getItem('id'))
                    }],
                    rewards: [ {
                        "amount" : 0,
                        "description" : "string"
                    }]
                };
                console.log(JSON.stringify(project));
                this.$http.post('http://localhost:4941/api/v2/projects', JSON.stringify(project), {headers: {'x-authorization': localStorage.getItem("token")}})
                    .then(function (response) {
                        if (response.status == 201){
                            alert("created " + this.title);
                        } else {
                            console.log(response);
                        }
                    } , function (error) {
                        console.log(error);
                    })
            }

        }
    }
</script>

<style>
    .create {
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 5px -5px 15px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 14px;
    }
    .createbtn {
        font-family: "Roboto", sans-serif;
        text-transform: uppercase;
        outline: 0;
        background: #4CAF50;
        width: 100%;
        border: 0;
        padding: 15px;
        color: #FFFFFF;
        font-size: 14px;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
        cursor: pointer;
    }
    .createbtnt button:hover,.btnLogin:active,.btnLogin:focus {
        background: #43A047;
    }
</style>
