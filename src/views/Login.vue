<template>
  <v-app class="background">
    <v-container>
      <v-snackbar v-model="snackbar" :color="colorSnackbar" right top>
        {{ textSnackbar }}
        <v-btn color="white" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>

      <v-layout align-center justify-center row wrap fill-height>
        <v-flex xs8  sm5 md4>
          <div class="relative">
            <div class="absolute">
              <v-img
                src="https://pbs.twimg.com/profile_images/1080545769034108928/CEzHCTpI_400x400.jpg"
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
                      placeholder="Email"
                      v-model="email"
                      append-icon="person"
                      label="Email"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      placeholder="Password"
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
                  <v-btn dark color="green" @click="login">Login</v-btn>
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
export default {
  data: () => ({
    email: "",
    password: "",
    snackbar: false,
    textSnackbar: "Hello i am snackbar",
    colorSnackbar: "green"
  }),
  methods: {
    async login() {
      try {
        let result = await this.axios.get(
          process.env.VUE_APP_API_INET +
            `/login/${this.email}/${this.password}`,
          {
            headers: {
              Authorization: `${process.env.VUE_APP_HEADER_AUTHORIZATION_INET}`
            }
          }
        );
        this.$router.replace("/form");
        console.log(result);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.message;
          this.snackbar = true;
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
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
  height: 33%;
  border-bottom-left-radius: 100%;
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
}
</style>
