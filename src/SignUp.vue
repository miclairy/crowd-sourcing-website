<template>
    <v-container>
        <v-card width="60">
            <h3>Access your Dreams</h3>
            <form >
                <input v-model="username" class='register' type="text" placeholder="username"/>
                <input v-model="email" class='register' type="email" placeholder="email"/>
                <input v-model="location" class='register' type="text" placeholder="location"/>
                <input v-model="password" class='register' type="password" placeholder="password"/>
                <button class="btnregister" type="button" v-on:click="signUp()">Sign Up</button>
                <div v-if="errorFlag" style="color: darkred;">
                    <p>Invalid Data Entered</p>
                </div>
                <p>Already registered? <router-link :to="{ path: '/login'}">Login</router-link></p>
            </form>
        </v-card>
    </v-container>
</template>

<style>
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
                location: ""
            }
        },
        methods: {
            signUp : function () {
                this.$http.post('http://localhost:4941/api/v2/users', {
                    "username": this.username,
                    "email": this.email,
                    "password": this.password,
                    "location": this.location
                })
                    .then(function (response) {
                        if (response.status == 201) {
                            this.errorFlag = false;
                            this.login();
                        } else {
                            this.errorFlag = true;
                        }
                    }, function (error) {
                        this.error = error;
                        this.errorFlag = true;
                    });
            },
            login : function () {
                this.$http.post('http://localhost:4941/api/v2/users/login?username=' + this.username + "&password=" + this.password)
                    .then(function (response) {
                        if (response.status == 200) {
                            this.errorFlag = false;
//                            this.$store.commit('setValues', response.token, response.id);
//                            console.log(this.$store.state.token);
                            // Store
                            localStorage.setItem("id", response.id);
                            localStorage.setItem("token", response.token);

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