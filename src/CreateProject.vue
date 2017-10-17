<template>
    <div class="createWidth">
        <h2>Create a Project</h2>
        <v-container fluid v-if="! isLoggedIn()">
            <v-layout row>
            <v-flex lg6>
                <v-text-field required :rules="notEmpty" class="createField" v-model="title" label="Title"></v-text-field>
                <v-text-field required :rules="notEmpty" class="createField" v-model="subtitle" name="input-2-3" label="Subtitle" ></v-text-field>
                <v-text-field required :rules="notEmpty" class="createField" v-model="description" name="input-7-3" label="Description" multi-line></v-text-field>
                <v-text-field required :rules="costRule" class="createField" v-model="target" label="Target Amount" prefix="$"></v-text-field>
                <h6>Rewards*</h6>
            <v-layout row>
                <v-flex xs8 class="ml-3">
                    <v-text-field class="createField" v-model="amount" label="Amount" prefix="$" :rules="costRule" value="10.00"></v-text-field>
                </v-flex>
                <v-flex xs8 class="ml-3">
                    <v-text-field class="createField" :rules="notEmpty" v-model="reward_description" label="Description"></v-text-field>
                </v-flex>
                <v-spacer></v-spacer>

                <v-flex xs8 class="">
                <v-btn class="pink" small top right fab v-on:click="addReward()"> <v-icon>add</v-icon> </v-btn>
                </v-flex>
            </v-layout>


            <table class="rewards">
                <tr v-for="reward in rewards">
                    <td class="data"> ${{reward.amount}} </td>
                    <td class="data"> {{ reward.description }} </td>
                    <td><v-icon v-on:click="deleteReward(reward)" class="iconButton">clear</v-icon></td>
                    <td><v-icon v-on:click="editReward(reward)" class="iconButton">edit</v-icon></td>
                </tr>
            </table>

            </v-flex>
            <v-flex lg6 class="imagebox">
                <h6>Project Image</h6>
                <label v-if="image==''" id="uploadImage" for="inputImage"><icon class="iconButton" scale="3" name="camera"></icon></label>
                <label v-else id="changeImage" for="inputImage"><icon scale="2" name="camera"></icon></label>
                <v-icon v-if="image!==''" v-on:click="clearImage()" class="iconButton" scale="3" large id="clearImage" >clear</v-icon>

                <img src="" id="preview"/>
                    <input type="file" v-on:change="preview($event.target.files[0]);" accept="image/*" id="inputImage">
            </v-flex>
            </v-layout>
            <p style="color: darkred">{{error}}</p>
            <button class="createbtn" type="button" v-on:click="createProject()">Create Project</button>

        </v-container>

        <h3 v-if="isLoggedIn()">You mst log in to create a project</h3>


    </div>
</template>

<script>
    export default {

        data(){
            return {
                title: "New house for Eeyore ",
                error: "",
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
                image : "",
                notEmpty: [
                    (v) => !!v || 'Required',
                ],
                costRule: [
                    (v) => !!v || 'Required',
                    (v) => !isNaN(v) || 'Must be a dollar amount',
                    (v) => v > 0 || 'Must be greater than 0'
                 ]
            }
        },
        methods : {
            createProject: function(){
                this.addReward();
                this.error = "";
                if (this.checkFields()) {
                    let project = {
                        "title": this.title,
                        "subtitle": this.subtitle,
                        "description": this.description,
                        "target": parseInt(this.target) * 100,
                        creators: [{
                            "id": parseInt(localStorage.getItem('id'))
                        }],
                        rewards: this.rewards
                    };
                    this.$http.post('http://csse-s365.canterbury.ac.nz:4836/api/v2/projects', JSON.stringify(project), {headers: {'x-authorization': localStorage.getItem("token")}})
                        .then(function (response) {
                            if (response.status == 201) {
                                alert("created " + this.title);
                                let id = response.body.id;

                                console.log(this.image);
                                if (this.image !== "") {
                                    this.$http.put('http://csse-s365.canterbury.ac.nz:4836/api/v2/projects/' + response.body.id + '/image', this.image, {
                                        headers: {
                                            'x-authorization': localStorage.getItem("token"),
                                            'content-type': this.image.type
                                        }
                                    })
                                        .then(function (response) {
                                            console.log(response);
                                            this.$router.push("/projects/" + id);
                                        })
                                } else {
                                    this.$router.push("/projects/" + id);
                                    console.log(response);
                                }
                            }
                        }, function (error) {
                            console.log(error);
                        })
                } else {
                    this.error = "Fields have not been filled out correctly"
                }
            },
            addReward: function () {
                if (!isNaN(this.amount) && this.reward_description.trim().length > 0 && this.amount > 0) {
                    let reward = {
                        "amount": parseInt(this.amount),
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
                return true;
            },
            preview(file) {
                this.image = file;
                var preview = document.querySelector('img'); //selects the query named img

                if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
                var reader  = new FileReader();

                    reader.onloadend = function () {
                        preview.src = reader.result;
                    };

                    if (file) {
                        reader.readAsDataURL(file); //reads the data as a URL
                    } else {
                        preview.src = "";
                    }

                }
            }, isLoggedIn : function () {
                let isUser = localStorage.getItem("id") == "null" || localStorage.getItem("id") == 'undefined' || localStorage.getItem('id') == null;
                return isUser;
            }, clearImage : function () {
                this.image = "";
                var preview = document.querySelector('img'); //selects the query named img
                preview.src = "";
            },
            checkFields : function () {
                return  this.title.length > 0 &&this.subtitle.length > 0 && this.description.length > 0 && parseInt(this.target) > 0 && this.rewards.length > 0
            }
        }
    }
</script>

<style>

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

    .createWidth {
        /*max-width: 1400px;*/
        /*background-color: darkturquoise;*/
    }

    #inputImage {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    #uploadImage {
        font-size: 1.25em;
        font-weight: 700;
        color: white;
        background-color: #6f14a1;
        display: inline-block;
        padding: 200px;
        margin-left: 40px;
        margin-right: 20px;
    }

    #uploadImage:focus,
    #uploadImage:hover {
        background-color: #9374a6;
    }

    #uploadImage {
        cursor: pointer; /* "hand" cursor */
    }


    .iconButton {
        cursor: pointer; /* "hand" cursor */
    }

    .iconButton:hover{
        color: #595160;
    }

    .createField{
        margin-left: 60px;
        margin-right: 60px;
    }

    .data {
        text-align: left;
        margin-left: auto;
        margin-right: auto;
    }

    .rewards{
        width: 100%;
        margin-left: 60px;
        font-size: larger;
    }

    #changeImage {
        cursor: pointer;
        z-index: 5;
        color: inherit;
        margin-right: auto;
    }

    #clearImage {
        cursor: pointer;
        z-index: 5;
        margin-left: 60%;
        padding-bottom: 20px;
    }

    #preview {
        margin: auto;
        width: 50%;
    }

    .imagebox {
        margin-left: 80px ;
        align-content: center;

    }


</style>
