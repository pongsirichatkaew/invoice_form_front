<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" class="background">
      <v-layout row fill-height>
        <v-card flat class="transparent" dark>
          <v-list two-line>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-for="(itemP,index) in itemsPerson" :key="index">
              <v-list-tile-action>
                <v-icon color="white">{{itemP.icon}}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{itemP.title}}</v-list-tile-title>
                <v-list-tile-sub-title>{{itemP.subtitle}}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action >
                <v-icon>{{itemP.subicon}}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider class="white"></v-divider>
            <v-list class="transparent">
              <v-list-tile v-for="(itemM,index) in itemsMenu" :key="index" @click="itemM.method">
                <v-list-tile-action>
                  <v-icon>{{itemM.icon}}</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>{{itemM.title}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-list>
        </v-card>
      </v-layout>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title></v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <formtable></formtable>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import FormTable from "../components/FormTable";
import Swal from "sweetalert2";
import { Encode, Decode } from "../services/";

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
  components: {
    formtable: FormTable
  },
  methods: {
    logout() {
      this.$cookies.remove("user");
      this.$router.push("/login");
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