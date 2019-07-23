<template>
  <v-app class="background">
    <v-container>
      <v-snackbar v-model="snackbar" :color="colorSnackbar" right top>
        {{ textSnackbar }}
        <v-btn color="white" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>

      <v-layout align-center justify-center row wrap fill-height>
        <v-flex xs8 sm5 md3>
          <div class="relative">
            <div class="absolute">
              <v-img
                src="https://www.krungsri.com/bank/getmedia/623a66b4-326f-4ec0-a931-de8202f301c2/krungsri-guru-investments-25June2558-banner.jpg.aspx"
                aspect-ratio="1"
                class="grey lighten-2 circularImage"
              >
                <template v-slot:placeholder>
                  <v-layout fill-height align-center justify-center ma-0>
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-layout>
                </template>
              </v-img>
            </div>

            <v-card class="boxshadow round">
              <v-container>
                <v-card-text>
                  <v-form>
                    <v-text-field
                      :rules="emailRules"
                      v-model="email"
                      append-icon="person"
                      label="Email"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      :rules="passwordRules"
                      v-model="password"
                      v-on:keyup.enter="login"
                      append-icon="lock"
                      label="Password"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn dark color="green" @click="login" :loading="isloading">Login</v-btn>
                </v-card-actions>
              </v-container>
            </v-card>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { Encode, Decode } from "../services";

export default {
  data: () => ({
    email: "",
    password: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v =>
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v
        ) || "E-mail must be valid"
    ],
    passwordRules: [v => !!v || "Password is required"],
    snackbar: false,
    textSnackbar: "Hello i am snackbar",
    colorSnackbar: "green",
    isloading: false
  }),
  methods: {
    async login() {
      try {
        this.isloading = true;
        let result = await this.axios.post(process.env.VUE_APP_API + `/login`, {
          username: this.email,
          password: this.password
        });
        let encodeUser = Encode.encode(result.data);
        this.$cookies.set("user", encodeUser);
        this.isloading = false;
        this.$router.replace("/");
      } catch (error) {
        this.isloading = false;

        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.msg;
          this.snackbar = true;
        } else if (error.request) {
        } else {
        }
      }
    }
  }
};
</script>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 44%;
  border-bottom-left-radius: 30%;
  border-bottom-right-radius: 100%;
  background-image: -webkit-linear-gradient(180deg, #00b09b, #96c93d);
}
.boxshadow {
  -webkit-box-shadow: 3px 0px 34px -6px rgba(209, 205, 209, 1);
  -moz-box-shadow: 3px 0px 34px -6px rgba(209, 205, 209, 1);
  box-shadow: 3px 0px 34px -6px rgba(209, 205, 209, 1);
}
.round {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
}
.relative {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-clip: border-box;
  border-radius: 0.25rem;
}

.absolute {
  text-align: center;
  margin-top: -6.13rem;
  margin-bottom: -7rem;
  margin-left: 2rem;
  margin-right: 2rem;
  padding: 1rem;
  -webkit-border-radius: 0.125rem;
  border-radius: 0.125rem;
}
.circularImage {
  border-radius: 50%;
  border-style: solid;
}
</style>
