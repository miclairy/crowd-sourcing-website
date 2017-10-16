<template>
    <v-container>
        <!--<v-flex lg6 >-->
        <v-card v-if="isLoggedIn()" class="center">
            <h3>Reach your Dreams</h3>

         <v-form v-model="valid">
                <v-text-field
                        label="Username or E-mail"
                        v-model="username"
                        :rules="nameRules"
                        required
                        class="text"
                ></v-text-field>
                <v-text-field
                        label="Password"
                        v-model="password"
                        :rules="passwordRules"
                        required
                        class="text"
                        :type="hidden? 'password' : 'text'"
                ></v-text-field>
             <div v-if="errorFlag" style="color: darkred;">
                 <p>Incorrect Username or Password</p>
             </div>
             <v-btn class="btnLogin green" v-on:click="login()">login</v-btn>
             <p>Not registered? <router-link :to="{ path:'/signup'}">Create an account</router-link></p>

         </v-form>
        </v-card>

        <v-card v-if="!isLoggedIn()">
            <h2>Please log out to log in as a different user</h2>
        </v-card>
        <!--</v-flex>-->
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

    .btnLogin {
        background: #4CAF50;
        width: 100%;
        color: #FFFFFF;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
    }
    .btnLogin:hover,.btnLogin:active,.btnLogin:focus {
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
                valid: false,
                hidden: true,
                nameRules: [
                    (v) => !!v || 'Username / Email is required',
                ],
                passwordRules: [
                    (v) => !!v || 'Password is required',
                ],
            }
        },
        methods: {
            login : function () {
                  let  url = 'http://localhost:4941/api/v2/users/login?email=' + this.username + '&username=' + this.username + "&password=" + this.password;

                if (this.username.length > 0 && this.password.length > 0) {
                    this.$http.post(url)
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
                            }
                        }, function (error) {
                            this.error = error;
                            this.errorFlag = true;
                        });
                } else {
                    this.errorFlag = true;
                }
            }, isLoggedIn : function () {
                let isUser = localStorage.getItem("id") == "null" || localStorage.getItem("id") == 'undefined' || localStorage.getItem('id') == null ;
                return isUser;
            },
        }
    }

</script>