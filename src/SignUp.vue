<template>
    <v-container>
        <v-card width="60">
            <h3>Access your Dreams</h3>
            <form >
                <input class='register' type="text" placeholder="username"/>
                <input class='register' type="text" placeholder="email"/>
                <input class='register' type="text" placeholder="location"/>
                <input  class='register' type="password" placeholder="password"/>
                <button class="btnregister">Sign Up</button>
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