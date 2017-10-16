<template>
    <div v-if="loaded">
        <div v-if="errorFlag" style="color: darkred;">
            {{ error }}
        </div>
        <v-container fluid id="project-big">
            <v-flex xs8>
                <label v-if="owner" id="editImage" for="changeImage"><v-icon dark>edit</v-icon></label>
                <input id="changeImage" name="changeImage" v-if="owner" type="file" v-on:change="changeImage($event.target.files[0]);" accept="image/*" class="inputFile">
            </v-flex>
            <v-layout row>
            <v-flex xs6>
                <img  v-bind:src="imageSrc"/>
            </v-flex>
            <v-flex xs6 >
                <h1> {{ selected.title }} </h1>
                <h2> {{ selected.subtitle }} </h2>
                <p> Target: ${{ selected.target / 100 }} </p>
                <div class="progress" >
                    <div class="progress-bar progress-bar-success" role="progressbar" v-bind:aria-valuenow="percentage"
                         aria-valuemin="0" aria-valuemax="100" :style="'width:'+percentage+'%'">
                        {{ percentage }}%
                    </div>
                </div>
                <p> {{ numberOfBackers }} backers </p>
                <p> ${{ amountPledged / 100 }} toward the target </p>
                <v-layout class="creators" row>
                    <p id="created"> Created </p>
                    <p class="creators" > {{ creationDate }} by </p>
                    <div  v-for="creator in selected.creators">
                        <p> {{ creator.username }} </p>
                    </div>

                </v-layout>
                <div v-if="selected.open && !owner && !isLoggedIn()"><button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#pledgeModal">Pledge</button></div>
                <div v-if="!selected.open"><p>Project is closed</p></div>
                <div v-if="owner && selected.open"><button type="button" class="btn btn-danger btn-lg" v-on:click="closeProject()">close project</button></div>
            </v-flex>
            </v-layout>
            <v-layout row>
            <v-flex xs6>
                <h2>About this project</h2>
                <p> {{ selected.description }} </p>

                <h2> Pledges </h2>
                <v-container>
                <v-layout row v-if="anonymousPledged > 0">
                    <p> Anonymous backers gave ${{anonymousPledged }}</p>
                </v-layout>
                </v-container>
                <v-container v-for="backer in selected.backers.slice(0, 5)" v-if="backer.username != 'anonymous'">
                        <p>{{backer.username }} gave ${{ backer.amount }}</p>
                </v-container>

            </v-flex>


            <v-flex xs5>
            <h2> Rewards </h2>
                <div v-for="reward in selected.rewards">
                <v-card >
                    <v-card-title primary-title><h4 class="headline mb-0">Pledge ${{ reward.amount }} or more</h4></v-card-title>
                <v-card-text> and receive...  {{ reward.description }}</v-card-text>
                </v-card>
                </div>
            </v-flex>
            </v-layout>

        </v-container>


        <!-- Modal -->
        <div id="pledgeModal" class="modal fade" role="dialog" tabindex="-1">
            <div class="modal-dialog" role="document">

                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Pledge to: {{selected.title}}</h4>
                    </div>
                    <div class="modal-body">
                        <v-container>
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Amount</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field v-model="pledgeData.amount" prefix="$" ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs4>
                                    <v-subheader>Credit Card</v-subheader>
                                </v-flex>
                                <v-flex xs8>
                                    <v-text-field v-model="pledgeData.card.authToken" ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </div>
                    <div class="modal-footer">
                        <input type="checkbox" v-model="pledgeData.anonymous" name="Anonymous" value="anonymous"> Anonymous
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="pledge()">Pledge</button>
                    </div>
                </div>

            </div>
        </div>
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
                numberOfBackers: -1,
                percentage: 0,
                amountPledged : 0,
                anonymousPledged: 0,
                id : -1,
                owner : false,
                loaded : false,
                pledgeData: {
                    id: parseInt(localStorage.getItem("id")),
                    amount: 0,
                    anonymous: false,
                    card: {
                        authToken: ""
                    }
                },
                imageSrc: ""
            }
        },
        mounted: function () {
            this.getProject(this.$route.params.projectId);
        },
        methods: {
            getProject : function(id) {
                this.id = id;
                this.imageSrc = 'http://localhost:4941/api/v2/projects/' + this.id + '/image';
                this.amountPledged = 0;
                this.anonymousPledged = 0;
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
                            this.numberOfBackers = 0;
                            var usernames = new Set();
                            for (var i = 0; i < response.data.backers.length; i += 1){
                                if (! usernames.has(this.selected.backers[i].username)){
                                    usernames.add(this.selected.backers[i].username);
                                    this.numberOfBackers += 1;
                                }
                                this.amountPledged += this.selected.backers[i].amount;
                                if (this.selected.backers[i].username == "anonymous"){
                                    this.anonymousPledged += this.selected.backers[i].amount;
                                }
                            }

                            for (var i = 0; i < response.data.creators.length; i += 1){
                                if (localStorage.getItem('id') == response.data.creators[i].id){
                                    this.owner = true;
                                }
                            }

                            this.percentage = Math.round((this.amountPledged / this.selected.target) * 1000);
                            this.amountPledged = this.amountPledged / 100;
                            this.loaded = true;

                        }, function (error) {
                            this.error = error;
                            this.errorFlag = true;
                        });
                }
            },
            pledge : function () {
                this.pledgeData.amount = parseInt(this.pledgeData.amount) * 100;
                console.log(this.pledgeData.anonymous);
                this.$http.post('http://localhost:4941/api/v2/projects/' + this.id + "/pledge", JSON.stringify(this.pledgeData),
                    {headers: {'x-authorization': localStorage.getItem("token")}})
                    .then(function (response) {
                        console.log(response);
                        this.getProject(this.id);
                    }, function (error) {
                        console.log(error);
                    })
            },
            closeProject : function() {
                if (confirm("Are you sure you want to close the project?") == true) {
                    this.$http.put('http://localhost:4941/api/v2/projects/' + this.id , JSON.stringify({"open": false}),
                        {headers: {'x-authorization': localStorage.getItem("token")}})
                        .then (function (response) {
                            this.getProject(this.id);
                        })

                }

            },
            changeImage : function (image) {
                this.$http.put('http://localhost:4941/api/v2/projects/' + this.id + '/image', image, {headers: {
                    'x-authorization': localStorage.getItem("token"),
                    'content-type' : image.type
                }})
                .then(function (response) {
                    console.log(response);
                    this.imageSrc = 'http://localhost:4941/api/v2/projects/' + this.id + '/image?' + moment();


                }, function (error) {
                    console.log(error);
                })
            },
            isLoggedIn : function () {
                let isUser = localStorage.getItem("id") == "null" || localStorage.getItem("id") == 'undefined' || localStorage.getItem('id') == null;
                return isUser;
            }
        }
    }

</script>

<style>

    h1{
        font-size: 4em;
    }

    h2{
        font-size: 2em;
    }

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

    img {
        margin:auto;
        max-width:100%;
        max-height:100%;
        display: block;
    }

    .inputFile {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }

    #editImage {
        font-size: 1.25em;
        font-weight: 700;
        color: white;
        background-color: #6f14a1;
        display: inline-block;
    }

    #editImage:focus,
    #editImage:hover {
        background-color: #9374a6;
    }

    #editImage {
        cursor: pointer; /* "hand" cursor */
    }

</style>