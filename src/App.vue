<template>
  <div id="app">
      <v-toolbar class="light dense">
        <v-toolbar-title> Dream Starter </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-side-icon class="hidden-md-and-up"></v-toolbar-side-icon>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat :to="{ name:'projects'}">Projects</v-btn>
          <v-btn flat :to="{ path:'/create'}">Create</v-btn>
          <v-btn flat>{{username}}</v-btn>
          <v-btn v-if="isLoggedIn()" flat :to="{ path:'/signup'}">Sign Up</v-btn>
            <v-btn v-if="isLoggedIn()" flat :to="{ path: '/login'}">Login</v-btn>
          <v-btn v-else flat v-on:click="logout()">Log out</v-btn>

        </v-toolbar-items>
      </v-toolbar>


    <router-view></router-view>


  </div>
</template>

<script>
export default {
    name: 'App',
    data(){
        return {
            username : "",
        }
    },
    methods : {
        isLoggedIn : function () {
            let isUser = localStorage.getItem("id") == "null" || localStorage.getItem("id") == 'undefined' || localStorage.getItem('id') == null ;
            if (! isUser){
                this.getUser();
            }
            return isUser;
        },
        logout : function () {
            this.$http.post('http://localhost:4941/api/v2/users/logout', {}, {headers: {'x-authorization': localStorage.getItem("token")}})
                .then(function (response) {
                    if (response.status == 200) {
                        localStorage.setItem("token", null);
                        localStorage.setItem("id", null);
                        this.username = "";
                        this.$router.push('/logout');
                    } else {
                        console.log(response)
                    }
            }, function (error) {
                    this.username = "";
                    localStorage.setItem("token", null);
                    localStorage.setItem("id", null);
                });
        },
        getUser : function () {
              this.$http.get('http://localhost:4941/api/v2/users/' + localStorage.getItem("id"), {headers: {'x-authorization': localStorage.getItem("token")}})
                  .then(function (response) {
                      if (response.status == 200) {
                          this.username = response.data.username;
                          return true;
                      } else {
                          return false;
                      }
                  }, function (error) {
                      localStorage.setItem("token", null);
                      localStorage.setItem("id", null);
                      this.username = "";
                      return false;
                })

        }
    }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
