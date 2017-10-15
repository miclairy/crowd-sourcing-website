<template>
    <v-container>
        <v-card v-if="isLoggedIn()" class="center">
            <h3>Access your Dreams</h3>

            <v-form >
                <v-text-field
                        label="Username"
                        v-model="username"
                        :rules="nameRules"
                        required
                        class="text"
                ></v-text-field>
                <v-text-field
                        label="Email"
                        v-model="email"
                        :rules="emailRules"
                        required
                        class="text"
                ></v-text-field>
                <v-text-field
                        label="Location"
                        v-model="location"
                        class="text"
                ></v-text-field>
                <v-text-field
                    label="Password"
                    v-model="password"
                    :rules="passwordRules"
                    required
                    :type="hidden ? 'password' : 'text'"
                    class="text"
            ></v-text-field>
                <div v-if="errorFlag" style="color: darkred;">
                    <p>{{ error }}</p>
                </div>
                <v-btn class="btnLogin green" v-on:click="signUp()">Sign Up</v-btn>
                <p>Already registered? <router-link :to="{ path: '/login'}">Login</router-link></p>

            </v-form>
        </v-card>

        <v-card v-if="!isLoggedIn()">
            <h2>Please log out to sign up as a new user</h2>
        </v-card>
    </v-container>
</template>

<style>

    .center{
        justify-content: center;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .text {
        max-width: 550px;
        margin-left: 25px;
    }

    .register {
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 5px -5px 15px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 14px;
    }
    .btnregister {
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
    .btnregister:hover,.btnregister:active,.btnregister:focus {
        background: #43A047;
    }
</style>

<script>
    export default {
        data(){
            return {
                error: "",
                errorFlag: false,
                username: "",
                password: "",
                email: "",
                location: "",
                nameRules: [
                    (v) => !!v || 'Name is required',
                ],
                passwordRules: [
                    (v) => !!v || 'Password is required',
                ],
                hidden: true,
                emailRules: [
                    (v) => !!v || 'E-mail is required',
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
                ]
            }
        },
        methods: {
            signUp : function () {
                this.error = "";
                this.errorFlag = false;
                let userData = {
                    "username": this.username,
                    "email": this.email,
                    "password": this.password,
                    "location": this.location
                };
                if (this.username.indexOf(' ') >= 0){
                    this.error += "Username can not have spaces\n";
                    this.errorFlag = true;
                }
                if (this.username.length <= 0 || this.password.length <= 0 || this.email.length <= 0 ) {
                    this.error += "Password and email and username are compulsory\n";
                    this.errorFlag = true;
                }
                if (this.errorFlag == false) {
                    this.$http.post('http://localhost:4941/api/v2/users', JSON.stringify(userData))
                        .then(function (response) {
                            if (response.status == 201) {
                                this.errorFlag = false;
                                this.login();
                            } else {
                                this.errorFlag = true;
                            }
                        }, function (error) {
                            console.log(error);
                            this.error += "Already used email or username";
                            this.errorFlag = true;
                        });
                }
            }, login : function () {
                this.$http.post('http://localhost:4941/api/v2/users/login?username=' + this.username + "&password=" + this.password)
                    .then(function (response) {
                        if (response.status == 200) {
                            this.errorFlag = false;
//                            this.$store.commit('setValues', response.body.token, response.body.id);
                            console.log(response.body.token);
                            console.log(response.body.id);
                            // Store
                            localStorage.setItem("id", response.body.id);
                            localStorage.setItem("token", response.body.token);

                            this.$router.push("/projects")
                        } else {
                            this.errorFlag = true;
                            this.error += "Invalid Data Entered";
                        }
                    }, function (error) {
                        this.error += "Invalid Data Entered";
                        this.errorFlag = true;
                    });
            }, isLoggedIn : function () {
                let isUser = localStorage.getItem("id") == "null" || localStorage.getItem("id") == 'undefined' || localStorage.getItem('id') == null ;
                return isUser;
            },
        }
    }

</script>