<template>
  <div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-toolbar text>
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
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn class="success" text @click="insertUser" :disabled="checkEmployeeId">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-toolbar>
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
          <v-btn color="blue darken-1" text @click="editDialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="updateUser" :disabled="checkEmployeeId">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>ผู้จัดการข้อมูล/ผู้ดูแลระบบ</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          class="mr-3"
          :loading="isSearch"
          v-model="search"
          append-icon="mdi-magnify"
          label="ค้นหาข้อมูล"
          outlined
          single-line
          hide-details
        ></v-text-field>
        <v-btn color="primary" @click="clickOpenInsertDialog">เพิ่มผู้จัดการข้อมูล</v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="users"
        :search="search"
        class="elevation-1"
        :loading="isLoading"
        :items-per-page="itemsPerPage"
      >
        <template v-slot:item.action="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editUser(item)"
            v-if="userId!==item.code && uesrRole !=2 "
          >mdi-edit</v-icon>
          <v-icon
            small
            @click="deleteUser(item)"
            v-if="userId!==item.code && uesrRole !=2"
          >mdi-delete</v-icon>
        </template>
        <!-- <template v-slot:items="props">
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
            <v-icon
              small
              @click="deleteUser(props.item)"
              v-if="userId!==props.item.code && uesrRole !=2"
            >delete</v-icon>
          </td>
        </template>-->
      </v-data-table>
    </v-card-text>
    <v-snackbar v-model="snackbar" :color="colorSnackbar" top right>
      {{ textSnackbar }}
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { Decode } from "../services/";

export default {
  data() {
    return {
      rowsPerPageItems: [10, 20, 30, 40],
      itemsPerPage: 25,
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

        { text: "Action", value: "action", sortable: false, align: "middle" }
      ],
      items: [],
      selectRole: "ผู้จัดการข้อมูล",
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
        result.data.msg.forEach(user => {
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
          this.colorSnackbar = "red";
          this.text = error.response.data.result;
          this.snackbar = true;
        } else if (error.request) {
        } else {
        }
      }
    },
    editUser(user) {
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
        this.dialog = false;
        this.getAllUsers();
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.msg;
          this.snackbar = true;
        } else if (error.request) {
        } else {
        }
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
        this.editDialog = false;
        this.getAllUsers();
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.msg;
          this.snackbar = true;
        } else if (error.request) {
        } else {
        }
      }
    },
    deleteUser(user) {
      Swal.fire({
        text: "คุณต้องการลบผู้ใช้นี้ใช้ไหม",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "ไม่",
        confirmButtonText: "ใช่"
      }).then(async result => {
        if (result.value) {
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
            this.dialog = false;
            this.getAllUsers();
          } catch (error) {
            if (error.response) {
              this.colorSnackbar = "red";
              this.textSnackbar = error.response.data.msg;
              this.snackbar = true;
            }
          }
        }
      });
    }
  },
  computed: {
    checkEmployeeId() {
      if (this.isNormalInteger(this.userIdAdd)) {
        return false;
      }
      return true;
    }
  },
  created() {
    var obj = JSON.parse(Decode.decode(this.$cookies.get("user")));
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


