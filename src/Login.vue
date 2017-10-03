<template>
    <v-container>
        <v-card width="60">
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
                this.$http.post('http://localhost:4941/api/v2/users/login?username=' + this.username + "&password=" + this.password)
                    .then(function (response) {
                        console.log(response.status);
                        if (response.status == 200) {
                            this.errorFlag = false;
                            this.$router.push("/projects")
                        } else {
                            this.errorFlag = true;
                        }
                    }, function (error) {
                    this.error = error;
                    this.errorFlag = true;
                });
            }
        }
    }

</script>