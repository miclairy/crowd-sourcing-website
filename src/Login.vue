<template>
    <v-container>
        <v-card v-if="isLoggedIn()">
            <h3>Reach your Dreams</h3>
            <form >
                <input v-model="username" class='login' type="text" placeholder="username"/>
                <input v-model="password" class='login' type="password" placeholder="password"/>
                <button class="btnLogin" type="button" v-on:click="login()">login</button>
                <div v-if="errorFlag" style="color: darkred;">
                    <p>Incorrect Username or Password</p>
                </div>
                <p>Not registered? <router-link :to="{ path:'/signup'}">Create an account</router-link></p>
            </form>
        </v-card>

        <v-card v-if="!isLoggedIn()">
            <h2>Please log out to log in as a different user</h2>
        </v-card>
    </v-container>
</template>

<style>
    .login {
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 5px -5px 15px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 14px;
    }
    .btnLogin {
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
            }
        },
        methods: {
            login : function () {
                let url = "";
                if (/@/g.test(this.username)){
                    url = 'http://localhost:4941/api/v2/users/login?email=' + this.username + "&password=" + this.password
                } else {
                    url = 'http://localhost:4941/api/v2/users/login?username=' + this.username + "&password=" + this.password
                }
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
            }, isLoggedIn : function () {
                let isUser = localStorage.getItem("id") == "null" || localStorage.getItem("id") == 'undefined' || localStorage.getItem('id') == null ;
                return isUser;
            },
        }
    }

</script>