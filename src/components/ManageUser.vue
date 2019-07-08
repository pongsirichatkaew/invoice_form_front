<template>
  <v-app>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>Add User</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Employee ID*"
                  required
                  :rules="addUserRules"
                  v-model="employeeId"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn
            color="blue darken-1"
            flat
            @click="getUserFromDevops"
            :disabled="checkEmployeeId"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>Users Admin</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          :loading="isSearch"
          v-model="search"
          append-icon="search"
          label="Search Anything Here"
          single-line
          hide-details
        ></v-text-field>
        <v-btn flat color="primary" @click="dialog = true">Add User</v-btn>
      </v-toolbar>
      <v-data-table :headers="headers" :items="users" :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.code }}</td>
          <td>{{ props.item.thainame }}</td>
          <td>{{ props.item.engname }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.phonenumber }}</td>
          <td>{{ props.item.positionname }}</td>
          <td class="justify-center layout px-0">
            <v-icon small @click="deleteUser(props.item.employee_id)">delete</v-icon>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
    <v-snackbar v-model="snackbar" :color="colorSnackbar">
      {{ textSnackbar }}
      <v-btn color="white" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import swal from "sweetalert";

export default {
  data() {
    return {
      dialog: false,
      editDialog: false,
      employeeId: "",
      addUserRules: [
        v => !!v || "Employee Id is required",
        v =>
          /^\+?(0|[1-9]\d*)$/.test(v) ||
          "Employee Id need to be valid number and be positive"
      ],
      snackbar: false,
      textSnackbar: "Hello i am snackbar",
      colorSnackbar: "green",
      search: "",
      isSearch: false,
      users: [],
      headers: [
        {
          text: "Employee ID",
          align: "left",
          value: "code"
        },
        { text: "Name TH", value: "thainame" },
        { text: "Name EN", value: "engname" },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "phonenumber" },
        { text: "Position", value: "positionname" },
        { text: "Action", sortable: false, align: "middle" }
      ],
    };
  },
  methods: {
    isNormalInteger(str) {
      return /^\+?(0|[1-9]\d*)$/.test(str);
    },
    getAllUsers() {
      // this.axios
      //   .get(process.env.VUE_APP_API + "/getAllUsers")
      //   .then(res => {
      //     console.log(res);
      //     this.users = res.data;
      //   })
      //   .catch(error => {
      //     if (error.response) {
      //       // The request was made and the server responded with a status code
      //       // that falls out of the range of 2xx
      //       console.log(error.response.data);
      //       this.colorSnackbar = "red";
      //       this.text = error.response.data.result;
      //       this.snackbar = true;
      //       console.log(error.response.status);
      //       console.log(error.response.headers);
      //     } else if (error.request) {
      //       // The request was made but no response was received
      //       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      //       // http.ClientRequest in node.js
      //       console.log(error.request);
      //     } else {
      //       // Something happened in setting up the request that triggered an Error
      //       console.log("Error", error.message);
      //     }
      //     console.log(error.config);
      //   });
    },
    async getUserFromDevops() {
      try {
        let result = await this.axios.get(
          process.env.VUE_APP_API_INET + "/employee/" + this.employeeId,
          {
            headers: { Authorization: `f49949b6-4a03-41c6-9e10-15aca0c59114` }
          }
        );
        console.log(result);
        let employee = result.data.employee_detail[0];
        this.users.push(employee)
        this.dialog = false;
      } catch (error) {
        console.log(error.response);
        this.colorSnackbar = "red";
        this.textSnackbar =
          error.response.data.message || error.response.data.result;
        this.snackbar = true;
      }
    },
    deleteUser(employeeId) {
      // swal({
      //   title: "Are you sure?",
      //   text: "Will you really want to delete user",
      //   icon: "warning",
      //   buttons: true,
      //   dangerMode: true
      // }).then(async willDelete => {
      //   if (willDelete) {
      //     try {
      //       let result = await this.axios.delete(
      //         process.env.VUE_APP_API + "/deleteUser/" + employeeId
      //       );
      //       swal("Your user has been deleted", {
      //         icon: "success"
      //       });
      //       this.getAllUsers();
      //       console.log(result);
      //     } catch (error) {
      //       console.log(error.response);
      //       this.colorSnackbar = "red";
      //       this.textSnackbar =
      //         error.response.data.message || error.response.data.result;
      //       this.snackbar = true;
      //     }
      //   }
      // });
    }
  },
  computed: {
    checkEmployeeId() {
      console.log("checkEmployeeId");
      if (this.isNormalInteger(this.employeeId)) {
        return false;
      }
      return true;
    }
  },
  created() {
  },
  watch: {
    search(value) {
      console.log(value);
      if (value !== "") {
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    }
  }
};
</script>


