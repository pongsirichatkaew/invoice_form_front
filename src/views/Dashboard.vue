<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" class="background">
      <v-layout row fill-height>
        <v-card flat class="transparent" dark>
          <v-list two-line>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Welcome Pongsiri Chatkaew</v-list-tile-title>
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

              <v-list-tile-action v-if="itemP.subicon">
                <v-icon>{{itemP.subicon}}</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list class="transparent">
              <v-list-tile v-for="(itemM,index) in itemsMenu" :key="index" @click>
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
      <v-toolbar-title>Title</v-toolbar-title>
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
export default {
  data() {
    return {
      drawer: true,
      itemsPerson: [
        {
          icon: "mdi-account-card-details",
          title: "62107",
          subtitle: "Code"
        },
        {
          icon: "phone",
          title: "061 412 9476",
          subtitle: "Work"
        },
        {
          icon: "mdi-email",
          subicon: "chat",
          title: "pongsiri.ch@inet.co.th",
          subtitle: "Email"
        },
        {
          icon: "mdi-map-marker",
          title: "ฝ่ายทรัพยากรบุคคล",
          subtitle: "Department"
        }
      ],
      itemsMenu: [
        {
          icon: "mdi-logout",
          title: "Logout"
        }
      ]
    };
  },
  components: {
    formtable: FormTable
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
</style>