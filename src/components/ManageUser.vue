<template>
  <v-app>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>เพิ่มผู้จัดการข้อมูล</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="รหัสพนักงาน*"
                  required
                  :rules="addUserRules"
                  v-model="userIdAdd"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-select v-model="selectRole" :items="items" label="ตำแหน่ง"></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="insertUser" :disabled="checkEmployeeId">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-toolbar flat>
          <v-toolbar-title>เพิ่มผู้จัดการข้อมูล</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="รหัสพนักงาน*"
                  required
                  disabled
                  :rules="addUserRules"
                  v-model="userIdAdd"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 d-flex>
                <v-select v-model="selectRole" :items="items" label="ตำแหน่ง"></v-select>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="editDialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="updateUser" :disabled="checkEmployeeId">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>ผู้จัดการข้อมูล/ผู้ดูแลระบบ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          :loading="isSearch"
          v-model="search"
          append-icon="search"
          label="Search Anything Here"
          single-line
          hide-details
        ></v-text-field>
        <v-btn flat color="primary" @click="clickOpenInsertDialog">เพิ่มผู้จัดการข้อมูล</v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        class="elevation-1"
        :loading="isLoading"
        :pagination.sync="pagination"
      >
        <template v-slot:items="props">
          <td>{{ props.item.code }}</td>
          <td>{{ props.item.thainame }}</td>
          <td>{{ props.item.engname }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.phonenumber }}</td>
          <td>{{ props.item.position }}</td>
          <td>{{ props.item.role }}</td>

          <td class="justify-center layout px-0">
            <v-icon
              small
              class="mr-2"
              @click="editUser(props.item)"
              v-if="userId!==props.item.code && uesrRole !=2 "
            >edit</v-icon>
            <v-icon small @click="deleteUser(props.item)" v-if="userId!==props.item.code">delete</v-icon>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
    <v-snackbar v-model="snackbar" :color="colorSnackbar" top right>
      {{ textSnackbar }}
      <v-btn color="white" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Swal from "sweetalert2";
import { Encode, Decode } from "../services/";

export default {
  data() {
    return {
      rowsPerPageItems: [10, 20, 30, 40],
      pagination: {
        rowsPerPage: 25
      },
      dialog: false,
      editUserId: false,
      editDialog: false,
      userId: "",
      uesrRole: "",
      userIdAdd: "",
      addUserRules: [
        v => !!v || "กรุณาใส่รหัสพนักงาน",
        v => /^\+?(0|[1-9]\d*)$/.test(v) || "รหัสพนักงานต้องเป็นจำนวนเต็มบวก"
      ],
      snackbar: false,
      textSnackbar: "Hello i am snackbar",
      colorSnackbar: "green",
      search: "",
      isSearch: false,
      users: [],
      headers: [
        {
          text: "รหัสพนักงาน",
          align: "left",
          value: "code"
        },
        { text: "ชื่อภาษาไทย", value: "thainame" },
        { text: "ชื่อภาษาอังกฤษ", value: "engname" },
        { text: "อีเมลล์", value: "email" },
        { text: "เบอร์โทรศัพท์", value: "phonenumber" },
        { text: "ตำแหน่ง", value: "position" },
        { text: "หน้าที่", value: "role" },

        { text: "Action", sortable: false, align: "middle" }
      ],
      items: [],
      selectRole: "",
      isLoading: false
    };
  },
  methods: {
    isNormalInteger(str) {
      return /^\+?(0|[1-9]\d*)$/.test(str);
    },
    clickOpenInsertDialog() {
      this.dialog = true;
      this.userIdAdd = "";
    },
    async getAllUsers() {
      try {
        this.isLoading = true;
        this.users = [];
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/show_admin`,
          {
            user_id: this.userId
          }
        );
        console.log(result);
        result.data.msg.forEach(user => {
          console.log(user);
          let roleText = "";
          if (user.role === 2) {
            roleText = "ผู้จัดการข้อมูล";
          } else if (user.role === 3) {
            roleText = "ผู้ดูแลระบบ";
          }
          let u = {
            code: user.code,
            thainame: `${user.thainame} ${user.thlastname}`,
            engname: `${user.engname} ${user.englastname}`,
            email: `${user.email}`,
            phonenumber: `${user.phonenumber}`,
            position: `${user.positionname}`,
            role: `${roleText}`
          };
          this.users.push(u);
        });
        this.isLoading = false;
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          this.colorSnackbar = "red";
          this.text = error.response.data.result;
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
    },
    editUser(user) {
      console.log("userEdit", user);
      this.editDialog = true;
      this.userIdAdd = user.code;
    },
    async insertUser() {
      try {
        let role = 2;
        if (this.selectRole === "ผู้จัดการข้อมูล") {
          role = 2;
        } else if (this.selectRole === "ผู้ดูแลระบบ") {
          role = 3;
        }
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/add_admin`,
          {
            user_id: this.userId,
            user_id_add: this.userIdAdd,
            role: role
          }
        );

        Swal.fire({
          type: "success",
          title: "เพิ่มผู้จัดการข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 1500
        });
        console.log(result);
        this.dialog = false;
        this.getAllUsers();
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.msg);
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.msg;
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
    },
    async updateUser(user) {
      try {
        let role = 2;
        if (this.selectRole === "ผู้จัดการข้อมูล") {
          role = 2;
        } else if (this.selectRole === "ผู้ดูแลระบบ") {
          role = 3;
        }
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/add_admin`,
          {
            user_id: this.userId,
            user_id_add: this.userIdAdd,
            role: role
          }
        );

        Swal.fire({
          type: "success",
          title: "เพิ่มผู้จัดการข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 1500
        });
        console.log(result);
        this.editDialog = false;
        this.getAllUsers();
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.msg);
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.msg;
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
    },
    async deleteUser(user) {
      try {
        console.log("delete", user);
        let role = 2;
        if (this.selectRole === "ผู้จัดการข้อมูล") {
          role = 2;
        } else if (this.selectRole === "ผู้ดูแลระบบ") {
          role = 3;
        }
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/add_admin`,
          {
            user_id: this.userId,
            user_id_add: user.code,
            role: 1
          }
        );

        Swal.fire({
          type: "success",
          title: "ลบผู้จัดการข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 1500
        });
        console.log(result);
        this.dialog = false;
        this.getAllUsers();
      } catch (error) {
        if (error.response) {
          console.log(error.response.data.msg);
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.msg;
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
  },
  computed: {
    checkEmployeeId() {
      console.log("checkEmployeeId");
      if (this.isNormalInteger(this.userIdAdd)) {
        return false;
      }
      return true;
    }
  },
  created() {
    var obj = JSON.parse(Decode.decode(this.$cookies.get("user")));
    console.log("jsonObj", obj);
    this.userId = obj.userid;
    let role = obj.role;
    this.uesrRole = role;

    if (role === 2) {
      this.items.push("ผู้จัดการข้อมูล");
    } else if (role === 3) {
      this.items.push("ผู้จัดการข้อมูล");
      this.items.push("ผู้ดูแลระบบ");
    }
    this.getAllUsers();
  },
  watch: {
    search(value) {
      if (value !== "") {
        this.isSearch = true;
      } else {
        this.isSearch = false;
      }
    }
  }
};
</script>


