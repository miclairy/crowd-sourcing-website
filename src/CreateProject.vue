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
                    <v-subheader>Target</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field  v-model="target" error :rules="[checkIfCost(target)]" label="Amount" value="10021.00" prefix="$"></v-text-field>
                </v-flex>
            </v-layout>

            <v-layout row>
                <v-flex xs4>
                <v-subheader>Rewards</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field v-model="amount" label="Amount" error :rules="[checkIfCost(amount)]" value="10.00"></v-text-field>
                </v-flex>
                <v-flex xs8>
                    <v-text-field v-model="reward_description" label="Description"></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>

                <v-flex xs8>
                <v-btn class="pink" small top right fab v-on:click="addReward()"> <v-icon>add</v-icon> </v-btn>
                </v-flex>
            </v-layout>

            <v-flex>
                <v-layout row>
                    <form enctype="multipart/form-data" novalidate>
                        <v-subheader>Upload images</v-subheader>
                        <div id="preview">
                            <input type="file" v-on:change="filesChange($event.target.files);" accept="image/*" class="input-file">
                        </div>
                    </form>
                </v-layout>
            </v-flex>

            <v-flex xs4 v-for="reward in rewards">
                <v-layout row>
                        <p> {{reward.amount}} </p>
                    <v-spacer></v-spacer>
                        <p> {{ reward.description }} </p>
                    <v-spacer></v-spacer>
                    <v-btn small v-on:click="deleteReward(reward)"> <v-icon>clear</v-icon></v-btn>
                    <v-btn small v-on:click="editReward(reward)"> <v-icon>edit</v-icon></v-btn>
                </v-layout>
            </v-flex>

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
                rewards: [],
                amount: 10,
                reward_description: "",
                uploadedFiles: [],
                uploadError: null,
                uploadFieldName: 'photos',
                image : ""
            }
        },
        methods : {
            createProject: function(){
                this.addReward();
                let project = {
                    "title": this.title,
                    "subtitle": this.subtitle,
                    "description": this.description,
                    "target": this.target,
                    creators: [ {
                        "id" : parseInt(localStorage.getItem('id'))
                    }],
                    rewards: this.rewards
                };
                this.$http.post('http://localhost:4941/api/v2/projects', JSON.stringify(project), {headers: {'x-authorization': localStorage.getItem("token")}})
                    .then(function (response) {
                        if (response.status == 201){
                            alert("created " + this.title);
                            console.log(response.body.id);
                            console.log(this.image);
                            this.$http.put('http://localhost:4941/api/v2/projects/' + response.body.id + '/image', this.image, {headers: {
                                'x-authorization': localStorage.getItem("token"),
                                'content-type' : "image/jpg"
                            }})
                                .then (function (response) {
                                  console.log(response)
                                })
                        } else {
                            console.log(response);
                        }
                    } , function (error) {
                        console.log(error);
                    })
            },
            addReward: function () {
                if (!isNaN(this.amount) && this.reward_description.trim().length > 0) {
                    let reward = {
                        "amount": this.amount,
                        "description": this.reward_description
                    };
                    let found = false;
                    for (var i = 0; i < this.rewards.length; i++) {
                        if (this.rewards[i].description == this.reward_description && this.rewards[i].amount === this.amount) {
                            found = true;
                        }
                    }

                    if (found == false) {
                        this.rewards.push(reward)
                    }
                    this.amount = 0;
                    this.reward_description = "";
                }
            },
            deleteReward: function (reward) {
                var index = this.rewards.indexOf(reward);
                this.rewards.splice(index, 1);
            },
            editReward: function (reward) {
                this.amount = reward.amount;
                this.reward_description = reward.description;
                this.deleteReward(reward);
            },
            checkIfCost: function (cost) {
                if (isNaN(cost)) {
                    return 'Must be a cost';
                }
                return "";
            },
            preview(file) {
                if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
                    var reader = new FileReader();

                    reader.addEventListener("load", function () {
                        var image = new Image();
                        image.height = 100;
                        image.title = file.name;
                        image.src = this.result;
                        this.image = this.result;
                        document.querySelector('#preview').appendChild( image );
                    }, false);

                    reader.readAsDataURL(file);

                }
            },
            filesChange(fileList) {
                if (!fileList.length) return;
                this.preview(fileList[0]);
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
