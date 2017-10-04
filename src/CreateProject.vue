<template>
    <div>
        <h2>Create a Project</h2>
        <v-container fluid>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader>Title</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field v-model="title" name="input-2-3" label="Free Donuts" single-line></v-text-field>
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
                    <v-text-field v-model="subtitle" name="input-7-3" label="Talk about your project" multi-line></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs4>
                    <v-subheader>Error</v-subheader>
                </v-flex>
                <v-flex xs8>
                    <v-text-field
                            name="input-3-5"
                            label="Hint Text"
                            value="Input text"
                            :rules="[() => 'Username or Password is incorrect.']"
                            error
                            single-line
                    ></v-text-field>
                </v-flex>
            </v-layout>
        </v-container>
        <button class="createbtn" type="button" v-on:click="create()">login</button>

    </div>
</template>

<script>
    export default {
        data(){
            return {
                title: "",
                description: "",
                subtitle: "",
                target: "",
                creators: [],
                rewards: []
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
