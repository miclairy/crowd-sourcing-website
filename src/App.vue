<template>
  <div id="app">
    <v-app>
      <v-toolbar class="light dense">
        <v-toolbar-title class="dream"> Dream Starter </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-side-icon  @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat :to="{ name:'projects'}">Projects</v-btn>
          <v-btn flat :to="{ path:'/create'}">Create</v-btn>
          <v-btn v-if="!isLoggedIn()" style="text-transform: capitalize" flat>Hello,  {{username}}</v-btn>
          <v-btn v-if="isLoggedIn()" flat :to="{ path:'/signup'}">Sign Up</v-btn>
            <v-btn v-if="isLoggedIn()" flat :to="{ path: '/login'}">Login</v-btn>
          <v-btn v-else flat v-on:click="logout()">Log out</v-btn>

        </v-toolbar-items>
      </v-toolbar>
      <v-alert color="info" icon="info" dismissible v-model="alert">
        You have been logged out
      </v-alert>

    <v-navigation-drawer temporary v-model="drawer" light absolute>
      <v-list class="pa-1">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>Dream starter</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile :to="{ name:'projects'}">
          <v-list-tile-content>
            <v-list-tile-title>Projects</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile :to="{ path:'/create'}">
          <v-list-tile-content>
            <v-list-tile-title>Create</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile v-if="!isLoggedIn()">
          <v-list-tile-content>
            <v-list-tile-title>Hello, {{ username }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile v-if="isLoggedIn()" :to="{ path:'/signup'}">
          <v-list-tile-content>
            <v-list-tile-title>Sign Up</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile v-if="isLoggedIn()" :to="{ path:'/login'}">
          <v-list-tile-content>
            <v-list-tile-title>Login</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile v-if="!isLoggedIn()" v-on:click="logout()">
          <v-list-tile-content>
            <v-list-tile-title>Log out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>


    </v-navigation-drawer>

    <router-view></router-view>

    </v-app>
  </div>

</template>

<script>
export default {
    name: 'App',
    data(){
        return {
            username : "",
            drawer: false,
            alert: false
        }
    },
    methods : {
        isLoggedIn : function () {
            let isUser = localStorage.getItem("id") == "null" || localStorage.getItem("id") == 'undefined' || localStorage.getItem('id') == null ;
            if (! isUser){
                this.getUser();
                this.alert = false;
            }
            return isUser;
        },
        logout : function () {
            this.$http.post('http://csse-s365.canterbury.ac.nz:4836/api/v2/users/logout', {}, {headers: {'x-authorization': localStorage.getItem("token")}})
                .then(function (response) {
                    if (response.status == 200) {
                        localStorage.setItem("token", null);
                        localStorage.setItem("id", null);
                        this.username = "";
                        this.alert = true;
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
              this.$http.get('http://csse-s365.canterbury.ac.nz:4836/api/v2/users/' + localStorage.getItem("id"), {headers: {'x-authorization': localStorage.getItem("token")}})
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
  text-align: center;
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
  color: #6f14a1;
}

.dream {
  color: #6f14a1;
}

  p {
    font-size: 16px;
  }



</style>
