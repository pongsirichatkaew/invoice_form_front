<template>
  <div>
    <v-navigation-drawer app v-model="drawer" width="300" class="background pa-2">
      <v-layout row fill-height>
        <v-card text class="transparent" dark>
          <v-list two-line nav>
            <v-list-item avatar>
              <v-list-item-content>
                <v-list-item-title>{{name}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item v-for="(itemP,index) in itemsPerson" :key="index">
              <v-list-item-action>
                <v-icon color="white">{{itemP.icon}}</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title>{{itemP.title}}</v-list-item-title>
                <v-list-item-subtitle>{{itemP.subtitle}}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-icon>{{itemP.subicon}}</v-icon>
              </v-list-item-action>
            </v-list-item>
            <v-divider class="white"></v-divider>
            <v-list class="transparent">
              <v-list-item v-for="(itemM,index) in itemsMenu" :key="index" @click="itemM.method">
                <v-list-item-action>
                  <v-icon>{{itemM.icon}}</v-icon>
                </v-list-item-action>
                <v-list-item-title>{{itemM.title}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-list>
        </v-card>
      </v-layout>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="flex-grow-1"></div>
    </v-app-bar>
    <!-- <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title></v-toolbar-title>
    </v-toolbar>-->
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { Decode } from "../services/";

export default {
  data() {
    return {
      drawer: true,
      itemsPerson: [],
      itemsMenu: [
        {
          icon: "mdi-logout",
          title: "Logout",
          method: this.logout
        }
      ],
      name: ""
    };
  },

  methods: {
    logout() {
      this.$cookies.remove("user");
      this.$router.push("/");
    }
  },
  created() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: "success",
      title: "Signed in successfully"
    });

    var obj = JSON.parse(Decode.decode(this.$cookies.get("user")));
    this.userId = obj.userid;
    this.name = `${obj.title} ${obj.name} ${obj.lastname}`;

    this.itemsPerson = [
      {
        icon: "mdi-account-card-details",
        title: `${obj.userid}`,
        subtitle: "Code"
      },
      {
        icon: "mdi-email",
        title: `${obj.email}`,
        subtitle: "Email"
      },
      {
        icon: "mdi-map-marker",
        title: `${obj.department}`,
        subtitle: "Department"
      }
    ];
  }
};
</script>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 33%;
  background-image: -webkit-linear-gradient(80deg, #96c93d, #00b09b);
}
>>> .v-divider {
  border-bottom: 1px solid;
}
</style>