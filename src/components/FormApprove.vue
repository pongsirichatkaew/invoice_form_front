<template>
  <div>
    <v-card color="white">
      <v-layout row wrap class="ml-3 mr-3 pt-6">
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs12 md7 lg9 xl10>
              <v-text-field
                class="ml-9 pr-8"
                v-model="search"
                append-icon="mdi-magnify"
                label="ค้นหาข้อมูล "
                placeholder="ลำดับ เลขที่เอกสาร เลขที่ใบลดหนี้ รหัสลูกค้า ชื่อลูกค้า "
                outlined
                hide-details
              ></v-text-field>
            </v-flex>
            <v-flex xs9 md3 lg3 xl2>
              <v-btn
                :class="{'ml-9 mt-3' : $vuetify.breakpoint.xsOnly,'ml-9 mt-2' : $vuetify.breakpoint.smOnly,' mt-2' : $vuetify.breakpoint.mdAndUp} "
                elevation="2"
                large
                outlined
                color="green"
                @click="advancedSearchClick"
              >
                Advanced Searching
                <!-- <v-icon right>mdi-arrow-down</v-icon> -->
              </v-btn>
            </v-flex>

            <v-flex v-if="advancedSearch" xs12 lg3 class="pl-8 pt-6 pr-8">
              <v-menu
                ref="menuStart"
                v-model="menuStart"
                :close-on-content-click="false"
                :return-value.sync="startDate"
                transition="scale-transition"
                offset-y
                full-width
                min-width="100px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="d-flex"
                    outlined
                    v-model="startDate"
                    label="ตั้งแต่วันที่"
                    append-icon="mdi-calendar-blank"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker :max="max_date" v-model="startDate" no-title scrollable>
                  <div class="flex-grow-1"></div>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex v-if="advancedSearch" xs12 lg3 class="pl-8 pt-6 pr-8">
              <v-menu
                ref="menuStop"
                v-model="menuStop"
                :close-on-content-click="false"
                :return-value.sync="stoptDate"
                transition="scale-transition"
                offset-y
                full-width
                min-width="100px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="d-flex"
                    outlined
                    v-model="stoptDate"
                    label="ถึงวันที่"
                    append-icon="mdi-calendar-blank"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker :min="min_date" v-model="stoptDate" no-title scrollable>
                  <div class="flex-grow-1"></div>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex v-if="advancedSearch" xs12 lg3 class="pl-8 pt-6 pr-8">
              <v-select v-model="select" :items="status" label="เลือกสถานะ" outlined></v-select>
            </v-flex>
            <v-flex v-if="advancedSearch" xs12 lg3 class="pl-8 pt-6 pr-8">
              <v-select
                v-model="selectIncome"
                :items="incomeList"
                label="เลือกกรณีเปลี่ยนแปลงรายได้"
                outlined
              ></v-select>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>

      <v-spacer></v-spacer>
      <v-col class="d-flex mt-8" cols="12" sm></v-col>
    </v-card>
    <v-snackbar v-model="snackbar" :color="colorSnackbar" right top>
      {{ textSnackbar }}
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-data-table
      :headers="headers"
      class="elevation-1"
      :loading="isLoadingAll"
      :items-per-page="itemsPerPage"
      :items="items"
    >
      <template v-slot:item.action="{ item }">
        <v-chip
          class="ma-2 white--text"
          :color="item.colorShip"
          @click="openTakeForm(item)"
        >{{item.status}}</v-chip>
      </template>
      <template v-slot:item.edit="{ item }">
        <v-icon small @click="openInfoDialog(item)">mdi-file-document</v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="confirmDialog" persistent max-width="600px">
      <v-card>
        <v-toolbar text>
          <v-toolbar-title>ยืนยันการรับเอกสาร</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field
                  label="เลขที่เอกสาร*"
                  disabled
                  required
                  v-model="confirmInvoiceNumber"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 d-flex>
                <v-text-field label="รหัสพนักงาน*" v-model="userId" disabled></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md10>
                <v-form ref="userAdd">
                  <v-text-field
                    label="รหัสพนักงานของผู้รับ*"
                    :rules="employeeRules"
                    required
                    v-model="userIdConfirm"
                  ></v-text-field>
                </v-form>
              </v-flex>
              <v-flex xs12 lg2>
                <v-btn class="mt-3 ml-3" outlined @click="searchEmployee">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-card outlined class="mx-auto">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="mb-3">รหัสพนักงาน: {{employeeConfirm.code}}</v-list-item-title>
                  <v-list-item-title
                    class="mb-3"
                  >ชื่อพนักงาน: {{employeeConfirm.thainame}} {{employeeConfirm.thlastname}}</v-list-item-title>
                  <v-list-item-title class="mb-3">ฝ่าย: {{employeeConfirm.orgname}}</v-list-item-title>
                  <v-list-item-title class="mb-3">อีเมลล์: {{employeeConfirm.email}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="confirmDialog = false">ปิด</v-btn>
          <v-btn class="success" text @click="confirmForm()" :disabled="checkEmployeeId">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="takeDialog" persistent max-width="600px">
      <v-card>
        <v-toolbar text>
          <v-toolbar-title>เอกสาร</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <p>เลขที่เอกสาร: {{confirmInvoiceNumber}}</p>
              </v-flex>
              <v-flex xs12>
                <p>รหัสพนักงาน: {{userId}}</p>
              </v-flex>
              <v-flex xs12 v-if="reasonTake !== ''">
                <p>เหตุผล: {{reasonTake}}</p>
              </v-flex>
              <v-flex xs12 lg10>
                <v-form ref="formReturn">
                  <v-text-field
                    :rules="employeeRules"
                    label="รหัสพนักงานของผู้คืนเอกสาร*"
                    required
                    v-model="userIdTakeFrom"
                  ></v-text-field>
                </v-form>
              </v-flex>
              <v-flex xs12 lg2>
                <v-btn class="mt-3 ml-3" outlined @click="searchEmployeeFrom">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12>
                <v-card outlined class="mx-auto">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="mb-3">รหัสพนักงาน: {{employeeTakeFrom.code}}</v-list-item-title>
                      <v-list-item-title
                        class="mb-3"
                      >ชื่อพนักงาน: {{employeeTakeFrom.thainame}} {{employeeTakeFrom.thlastname}}</v-list-item-title>
                      <v-list-item-title class="mb-3">ฝ่าย: {{employeeTakeFrom.orgname}}</v-list-item-title>
                      <v-list-item-title class="mb-3">อีเมลล์: {{employeeTakeFrom.email}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-flex>

              <v-flex xs12 lg10>
                <v-form ref="formRecieve">
                  <v-text-field
                    :rules="employeeRules"
                    label="รหัสพนักงานของผู้รับเอกสาร*"
                    required
                    v-model="userIdConfirm"
                  ></v-text-field>
                </v-form>
              </v-flex>
              <v-flex xs12 lg2>
                <v-btn class="mt-3 ml-3" outlined @click="searchEmployeeConfirm">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12>
                <v-card outlined class="mx-auto">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="mb-3">รหัสพนักงาน: {{employeeConfirm.code}}</v-list-item-title>
                      <v-list-item-title
                        class="mb-3"
                      >ชื่อพนักงาน: {{employeeConfirm.thainame}} {{employeeConfirm.thlastname}}</v-list-item-title>
                      <v-list-item-title class="mb-3">ฝ่าย: {{employeeConfirm.orgname}}</v-list-item-title>
                      <v-list-item-title class="mb-3">อีเมลล์: {{employeeConfirm.email}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeTakeDialog">ปิด</v-btn>
          <v-btn class="success" text @click="takeForm()" :disabled="checkEmployeeTake">บันทึก</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="infoDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeInfoDialog">
            <v-icon dark>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-items class="hidden-sm-and-down"></v-toolbar-items>
        </v-toolbar>
        <v-form>
          <v-card class="ma-3">
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field v-model="employee.code" label="รหัสพนักงาน" disabled></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field v-model="employee.thainame" label="ชื่อ" disabled></v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field v-model="employee.thlastname" label="นามสกุล" disabled></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
        <infoForm1></infoForm1>
        <infoForm2></infoForm2>
        <v-form v-if="my_invoice.comment">
          <v-card class="ma-3">
            <v-container>
              <v-row>
                <v-col cols="12" md="12">
                  <v-text-field v-model="my_invoice.comment" label="เหตุผล" disabled></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-form>
        <v-container>
          <v-card flat>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="error"
                large
                dark
                @click="openApproveDialog(false)"
                v-if="showBtnReject"
              >
                <v-icon left>mdi-close</v-icon>ไม่อนุมัติ
              </v-btn>
              <v-btn color="info" large dark @click="createPdf()">
                <v-icon left>mdi-file</v-icon>ดูเอกสาร
              </v-btn>
              <v-btn
                color="success"
                large
                dark
                @click="openApproveDialog(true)"
                v-if="showBtnAprrove"
              >
                <v-icon left>mdi-check</v-icon>อนุมัติ
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-container>

        <v-dialog v-model="approveDialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{headlinneApprove}}</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="formApprove">
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex>
                      <v-textarea
                        :rules="commentApproveRules"
                        v-model="approveComment"
                        name="input-7-4"
                        label="ความคิดเห็นเพิ่มเติม"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeApproveDialog">ปิด</v-btn>
              <v-btn
                outlined
                @click="saveApproveDialog"
                :disabled="checkCommentApprove"
              >{{btnApprove}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card-text style="height: 30px; position: relative"></v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogReasons" persistent max-width="500">
      <v-card>
        <v-app-bar flat color="primary">
          <v-toolbar-title style="color:white">หมายเหตุ</v-toolbar-title>
        </v-app-bar>
        <v-container>
          <v-layout row wrap>
            <v-container grid-list-xs>
              <v-card outlined>
                <v-card-text>
                  <v-flex xs12 v-if="employee_take_from_name.length > 0">
                    <p
                      class="text--primary subtitle-1"
                    >ชื่อผู้คืนเอกสาร: {{employee_take_from_name}}</p>
                  </v-flex>

                  <v-flex xs12 v-if="employee_take_from_code.length > 0">
                    <p
                      class="text--primary subtitle-1"
                    >รหัสพนักงานของผู้คืนเอกสาร: {{employee_take_from_code}}</p>
                  </v-flex>
                </v-card-text>
              </v-card>
              <v-card class="mt-3" outlined>
                <v-card-text>
                  <v-flex xs12 v-if="employee_take_by_name.length > 0">
                    <p class="text--primary subtitle-1">ชื่อผู้รับเอกสาร: {{employee_take_by_name}}</p>
                  </v-flex>

                  <v-flex xs12 v-if="employee_take_by_code.length > 0">
                    <p
                      class="text--primary subtitle-1"
                    >รหัสพนักงานของผู้รับคืนเอกสาร: {{employee_take_by_code}}</p>
                  </v-flex>

                  <v-flex xs12 v-if="employee_take_at.length > 0">
                    <p class="text--primary subtitle-1">เวลา: {{employee_take_at}}</p>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-container>
          </v-layout>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click.native="dialogReasons = false">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Form1Info from "./Form1Info";
import Form2Info from "./Form2Info";
import { mapState } from "vuex";
import { Encode, Decode } from "../services/";

import Swal from "sweetalert2";

export default {
  data() {
    return {
      commentApproveRules: [v => !!v || "กรุณาใส่เหตุผล"],
      employeeRules: [v => !!v || "กรุณาใส่รหัสพนักงาน"],

      itemsPerPage: 25,
      select: "",
      selectIncome: "",
      isLoadingAll: false,
      rowsPerPageItems: [10, 20, 30, 40],

      headers: [
        {
          text: "ลำดับ",
          align: "left",
          value: "index"
        },
        {
          text: "เลขที่เอกสาร",
          value: "invoiceDoc",
          align: "left"
        },
        {
          text: "เลขที่ใบลดหนี้",
          value: "invoiceNumber",
          class: "font-weight:bold"
        },
        { text: "ชื่อลูกค้า", value: "customerName" },
        { text: "การเปลี่ยนแปลงรายได้", value: "isIncome" },

        { text: "วันที่แก้ไขล่าสุด", value: "last_created" },
        { text: "สถานะ", value: "status" },
        {
          text: "การรับเอกสาร",
          value: "action",
          align: "center",
          sortable: false
        },
        { text: "เอกสาร", value: "edit", sortable: false, align: "center" }
        // { text: "การส่งคืน", value: "take", sortable: false, align: "center" }
      ],
      items: [],
      itemsCopy: [],
      status: [],
      incomeList: [],
      obj: {},
      labelDropdown: "สถานะทั้งหมด",
      labelIncome: "กรณีทั้งหมด",
      search: "",
      notifications: false,
      sound: true,
      widgets: false,
      enabled: true,
      infoDialog: false,
      userId: "",
      approveDialog: false,
      isApprove: false,
      approveComment: "",
      headlinneApprove: "",
      btnApprove: "",
      confirmDialog: false,
      confirmInvoiceNumber: "",
      confirmCode: "",
      confirmPassword: "",
      id_user: "",
      password: "",
      snackbar: false,
      textSnackbar: "",
      colorSnackbar: "green",
      isloading: false,
      showBtnAprrove: true,
      showBtnReject: false,
      isCommentApprove: false,
      userIdConfirm: "",
      userIdTakeFrom: "",
      employeeTakeFrom: {},
      employee: {},
      startDate: "",
      stoptDate: "",
      menuStart: false,
      menuStop: false,
      searchCustomerName: "",
      advancedSearch: false,
      overlay: false,
      min_date: "",
      max_date: "",
      takeDialog: false,
      reasonTake: "",
      dialogReasons: false,
      employee_take_by_name: "",
      employee_take_by: {},
      employee_take_by_code: "",
      employee_take_at: "",
      employee_take_from_name: "",
      employee_take_from: {},
      employee_take_from_code: "",
      employeeConfirm: {},
      disabledEmployeeConfirm: true,
      disabledEmployeeTake: false
    };
  },
  components: {
    infoForm1: Form1Info,
    infoForm2: Form2Info
  },
  computed: {
    ...mapState(["dialog", "updateDialog", "my_invoice"]),
    e1: {
      get() {
        return this.$store.getters.e1;
      },
      set(value) {
        this.$store.dispatch("updateE1", value);
      }
    },
    checkEmployeeId() {
      if (
        this.isNormalInteger(this.userIdConfirm) &&
        !this.disabledEmployeeConfirm
      ) {
        return false;
      }
      return true;
    },
    checkEmployeeTake() {
      if (
        this.isNormalInteger(this.userIdConfirm) &&
        !this.disabledEmployeeConfirm &&
        !this.disabledEmployeeTake
      ) {
        return false;
      }
      return true;
    },
    checkCommentApprove() {
      console.log(this.isApprove, this.approveComment.length);
      if (this.approveComment.length == 0 && !this.isApprove) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    search(value) {
      console.log("search", value);

      this.items = this.itemsCopy;
      this.checkItemStatus();
      this.checkItemDate();
      this.checkItemIncome();

      console.log("items", this.items);
      this.checkItemSearch();
    },
    select() {
      this.items = this.itemsCopy;
      this.checkItemStatus();
      this.checkItemDate();
      this.checkItemIncome();
      this.checkItemSearch();
    },
    startDate(value) {
      this.max_date = "";

      this.$refs.menuStart.save(this.startDate);
      this.items = this.itemsCopy;
      this.checkItemStatus();
      this.checkItemDate();
      this.checkItemIncome();
      this.checkItemSearch();

      console.log("value", value);
      this.min_date = value;
    },
    stoptDate(value) {
      this.min_date = "";
      this.$refs.menuStop.save(this.stoptDate);
      this.items = this.itemsCopy;
      this.checkItemStatus();
      this.checkItemDate();
      this.checkItemIncome();
      this.checkItemSearch();

      console.log("value", value);
      this.max_date = value;
    },
    selectIncome(value) {
      console.log("value", value);

      this.items = this.itemsCopy;
      this.checkItemStatus();
      this.checkItemDate();
      this.checkItemIncome();
      this.checkItemSearch();
    }
  },
  methods: {
    isNormalInteger(str) {
      return /^\+?(0|[1-9]\d*)$/.test(str);
    },
    getDialog() {
      this.$store.commit("updateDialog", true);
    },
    getUpdateDialog(item) {
      this.$store.commit("updateUpdatedialog", true);
      this.$store.commit("updateInvoiceInfo", item);
    },
    openInfoDialog(item) {
      this.infoDialog = true;
      // this.$cookies.remove("item");
      // this.$cookies.set("item", item);
      localStorage.removeItem("item");

      console.log("info", item);

      localStorage.setItem("item", Encode.encode(JSON.stringify(item)));
      this.$store.commit("updateInvoiceInfo", item);
      if (this.my_invoice.status === "รออนุมัติ") {
        this.showBtnReject = true;
        this.showBtnAprrove = true;
      } else {
        this.showBtnReject = false;
        this.showBtnAprrove = false;
      }
      this.employee = item.employee;
    },
    openApproveDialog(value) {
      this.approveDialog = true;
      console.log("value", value);
      this.isApprove = value;
      console.log("value");
      if (this.isApprove) {
        this.headlinneApprove = "อนุมัติใบแจ้งหนี้";
        this.btnApprove = "อนุมัติ";
        this.commentApproveRules = [];
      } else {
        this.headlinneApprove = "ไม่อนุมัติใบแจ้งหนี้";
        this.btnApprove = "ไม่อนุมัติ";
        this.commentApproveRules = [v => !!v || "กรุณาใส่เหตุผล"];
      }
      this.$refs.formApprove.resetValidation();
    },
    closeApproveDialog() {
      this.approveDialog = false;
      this.approveComment = "";
    },
    advancedSearchClick() {
      this.advancedSearch = !this.advancedSearch;
    },
    checkItemSearch() {
      let filterItems = this.items.filter(
        item =>
          item.index.toString().includes(this.search) ||
          item.invoiceDoc.toString().includes(this.search) ||
          item.invoiceNumber.toString().includes(this.search) ||
          item.customerId.toString().includes(this.search) ||
          item.customerName.includes(this.search)
      );
      this.items = filterItems;
    },
    checkItemDate() {
      let start = Date.parse(this.startDate);
      let stop = Date.parse(this.stoptDate);
      if (this.startDate === "" && this.stoptDate !== "") {
        let filterItem = this.items.filter(item => {
          let itemDate = Date.parse(item.last_created);
          let dateStop = new Date(stop).toISOString().split("T")[0];
          let dateItem = new Date(itemDate).toISOString().split("T")[0];
          console.log(dateItem, dateStop);
          console.log(dateItem <= dateStop);
          return dateItem <= dateStop;
        });
        this.items = filterItem;
        console.log("filter", filterItem);
      } else if (this.stoptDate === "" && this.startDate !== "") {
        let filterItem = this.items.filter(item => {
          let itemDate = Date.parse(item.last_created);
          let dateStart = new Date(start).toISOString().split("T")[0];
          let dateItem = new Date(itemDate).toISOString().split("T")[0];
          console.log(dateItem, dateStart);
          console.log("start", dateStart);

          return dateItem >= dateStart;
        });
        this.items = filterItem;
        console.log("filter", filterItem);
      } else if (this.startDate !== "" && this.stoptDate !== "") {
        let filterItem = this.items.filter(item => {
          let itemDate = Date.parse(item.last_created);
          let dateItem = new Date(itemDate).toISOString().split("T")[0];
          let dateStart = new Date(start).toISOString().split("T")[0];
          let dateStop = new Date(stop).toISOString().split("T")[0];
          console.log("start", dateStart);
          console.log("stop", dateStop);
          console.log(dateStart, dateItem);
          console.log(dateStop, dateItem);
          return dateItem >= dateStart && dateItem <= dateStop;
        });
        this.items = filterItem;
        console.log("filter", filterItem);
      }
    },
    checkItemStatus() {
      console.log("select", this.select);
      if (this.select === this.labelDropdown) {
        this.items = this.itemsCopy;
      } else {
        let filterItems = this.items.filter(
          item => item.status === this.select
        );
        this.items = filterItems;
        console.log("filter", filterItems);
      }
    },
    checkItemIncome() {
      console.log(this.selectIncome);
      console.log(this.items);
      if (this.selectIncome === "ลดหนี้เต็มจำนวน") {
        let filterItems = this.items.filter(item => {
          return item.invoiceFull && item.income;
        });
        this.items = filterItems;
      } else if (this.selectIncome === "ลดหนี้บางส่วน") {
        let filterItems = this.items.filter(item => {
          return item.invoicePartial;
        });
        this.items = filterItems;
      } else if (this.selectIncome === "ไม่เปลี่ยนแปลงรายได้") {
        let filterItems = this.items.filter(item => {
          return item.notIncome;
        });
        this.items = filterItems;
      } else if (this.selectIncome === "อื่นๆ") {
        let filterItems = this.items.filter(item => {
          return item.otherIncome;
        });
        this.items = filterItems;
      } else if (this.selectIncome === this.labelIncome) {
        let filterItems = this.items.filter(item => {
          return item;
        });
        this.items = filterItems;
      }
    },
    selectStatus() {
      this.items = this.itemsCopy;

      this.checkItemStatus();
      this.checkItemDate();
    },
    async saveApproveDialog() {
      try {
        console.log("approveComment", this.approveComment);

        let status = "ไม่อนุมัติ";
        if (this.isApprove) {
          status = "อนุมัติ";
        }
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/approve`,
          {
            id_user: this.userId,
            id_from: this.my_invoice.invoiceDoc,
            status: status,
            edit_at: new Date(),
            comment: this.approveComment
          }
        );
        Swal.fire({
          type: "success",
          title: `${status}สำเร็จเรียบร้อย`,
          showConfirmButton: false,
          timer: 1500
        });
        this.closeInfoDialog();
        this.closeApproveDialog();
        this.getAllInvoiceForm();
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data;
          this.snackbar = true;
        }
      }
    },
    closeDialog() {
      this.$store.commit("updateDialog", false);
      this.$store.commit("clearFormData");
    },
    closeInfoDialog() {
      this.infoDialog = false;
      this.$store.commit("clearFormData");
    },
    closeUpdateDialog() {
      this.$store.commit("updateUpdatedialog", false);
      this.$store.commit("clearFormData");
    },
    async searchEmployee() {
      try {
        this.$refs.userAdd.validate();
        let result = await this.axios.get(
          process.env.VUE_APP_API_INET + `/employee/${this.userIdConfirm}`,
          {
            headers: { Authorization: "d0aa5a1d-a58b-4a45-9c99-1e1007408ef4" }
          }
        );
        this.employeeConfirm = result.data.employee_detail[0];
        this.disabledEmployeeConfirm = false;
        console.log("result", this.employee);
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.disabledEmployeeConfirm = true;

          this.textSnackbar = error.response.data.message;
          this.snackbar = true;
        }
      }
    },
    async searchEmployeeFrom() {
      try {
        this.$refs.formReturn.validate();
        let result = await this.axios.get(
          process.env.VUE_APP_API_INET + `/employee/${this.userIdTakeFrom}`,
          {
            headers: { Authorization: "d0aa5a1d-a58b-4a45-9c99-1e1007408ef4" }
          }
        );
        this.employeeTakeFrom = result.data.employee_detail[0];
        this.disabledEmployeeTake = false;
        console.log("result", this.employeeTakeFrom);
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.disabledEmployeeTake = true;
          this.textSnackbar = error.response.data.message;
          this.snackbar = true;
        }
      }
    },
    async searchEmployeeConfirm() {
      try {
        this.$refs.formRecieve.validate();
        let result = await this.axios.get(
          process.env.VUE_APP_API_INET + `/employee/${this.userIdConfirm}`,
          {
            headers: { Authorization: "d0aa5a1d-a58b-4a45-9c99-1e1007408ef4" }
          }
        );
        this.employeeConfirm = result.data.employee_detail[0];
        this.disabledEmployeeConfirm = false;
        console.log("result", this.employee);
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.disabledEmployeeConfirm = true;

          this.textSnackbar = error.response.data.message;
          this.snackbar = true;
        }
      }
    },
    async getAllInvoiceForm() {
      this.isLoadingAll = true;
      try {
        var moment = require("moment");

        this.itemsCopy = [];
        this.items = [];
        this.status.push(this.labelDropdown);
        this.incomeList.push(this.labelIncome);
        let result = await this.axios.post(process.env.VUE_APP_API + `/menu`, {
          user_id: this.userId
        });
        let index = 1;
        result.data.forEach(form => {
          let receiveDocument = "รอการยืนยัน";
          let receiveDocumentDisabled = false;
          let receiveDocumentStatus = "#f9a825";

          if (form.status === "อนุมัติ") {
            receiveDocument = "ยืนยันการรับเอกสาร";
            receiveDocumentStatus = "success";
          } else if (form.status === "ไม่อนุมัติ") {
            receiveDocument = "ไม่อนุมัติ";
            receiveDocumentStatus = "error";
          } else {
            receiveDocumentStatus = "#f9a825";
          }
          form.invoice.forEach(arr => {
            arr.invoiceSlip = arr.invoice_no;
            arr.soNumber = arr.ref_so;
            arr.invoiceAmount = arr.amount_no_vat;
          });
          var createAt = moment(form.create_at).locale("th");
          var takeAt = moment(form.take_at).locale("th");

          var isIncome = "อื่นๆ";
          if (form.change_income === 1 && form.full === 1) {
            isIncome = "มีการเปลี่ยนแปลงรายได้(ลดหนี้ทั้งหมด)";
          } else if (form.change_income === 1 && form.some === 1) {
            isIncome = "มีการเปลี่ยนแปลงรายได้(ลดหนี้บางส่วน)";
          } else if (form.not_change_income === 1) {
            isIncome = "ไม่เปลี่ยนแปลงรายได้";
          }

          let color = "orange";
          if (form.status === "อนุมัติ") {
            color = "green";
          } else if (form.status === "ไม่อนุมัติ") {
            color = "red";
          } else if (form.status === "รอส่งคืนเอกสาร") {
            color = "amber darken-1";
          } else if (form.status === "คืนเอกสารเรียบร้อยแล้ว") {
            color = "green";
          }

          let f = {
            index: index++,
            invoiceDoc: form.id_document,
            invoiceNumber: form.id_form,
            customerId: form.id_customer,
            customerName: form.customer_name,
            employee: form.employee,
            employee_approved: form.employee_approved,
            employee_take_by: form.employee_take_by,
            employee_take_from: form.employee_take_from,
            take_at: takeAt.format("L") + " " + takeAt.format("LT"),
            isIncome: isIncome,
            invoice: form.invoice,
            income: form.change_income === 1 ? true : false,
            invoiceFull:
              form.change_income === 1
                ? form.full === 1
                  ? true
                  : false
                : false,
            invoiceFullAmount: form.full_text,
            invoicePartial:
              form.change_income === 1
                ? form.some === 1
                  ? true
                  : false
                : false,
            invoicePartialAmount: form.some_text,
            notIncome: form.not_change_income === 1 ? true : false,
            otherIncome: form.other === 1 ? true : false,
            invoiceOtherDescription: form.other_text,
            invoiceDescription: form.debt_text,
            last_created: createAt.format("L") + " " + createAt.format("LT"), // 10 กันยายน 2019 เวลา 15:16,
            comment: form.comment,
            approved_by: form.approved_by,
            status: form.status,
            receiveDocument: receiveDocument,
            receiveDocumentDisabled: receiveDocumentDisabled,
            receiveDocumentStatus: receiveDocumentStatus,
            colorShip: color
          };
          console.log("f", f);
          console.log(this.incomeList);
          this.items.push(f);
          this.itemsCopy.push(f);
          this.status.push(f.status);
        });
        this.incomeList.push("ลดหนี้เต็มจำนวน");
        this.incomeList.push("ลดหนี้บางส่วน");
        this.incomeList.push("ไม่เปลี่ยนแปลงรายได้");
        this.incomeList.push("อื่นๆ");

        this.select = this.status[0];
        this.selectIncome = this.incomeList[0];
        this.isLoadingAll = false;
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data;
          this.snackbar = true;
        }
      }
    },
    openConfirmForm(form) {
      if (form.receiveDocumentStatus == "success") {
        console.log("form", form);
        this.employee = form.employee;
        this.confirmInvoiceNumber = form.invoiceDoc;
        this.userIdConfirm = "";
        this.employeeConfirm = {};

        this.confirmDialog = true;
      } else {
        Swal.fire({
          type: "error",
          text: "เอกสารยังไม่ได้รับการอนุมัติ"
        });
      }
    },
    async confirmForm() {
      try {
        console.log("inv", this.confirmInvoiceNumber);
        console.log("idon", this.userIdConfirm);
        console.log("code", this.employee.code);
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/confirm`,
          {
            id_user: this.employee.code,
            id_from: this.confirmInvoiceNumber,
            password: this.userIdConfirm
          }
        );
        Swal.fire({
          type: "success",
          title: "รับเอกสารเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 1500
        });
        this.confirmDialog = false;
        this.getAllInvoiceForm();
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data;
          this.snackbar = true;
        }
      }
    },
    openTakeForm(form) {
      if (form.receiveDocumentStatus == "success") {
        console.log("form", form);
        this.employee = form.employee;
        this.confirmInvoiceNumber = form.invoiceDoc;
        this.userIdConfirm = "";
        if (typeof this.$refs.userAdd != "undefined") {
          this.$refs.userAdd.reset();
        }
        this.confirmDialog = true;
      } else if (form.status === "รอส่งคืนเอกสาร") {
        if (typeof this.$refs.formReturn != "undefined") {
          this.$refs.formReturn.reset();
        }
        if (typeof this.$refs.formRecieve != "undefined") {
          this.$refs.formRecieve.reset();
        }
        this.takeDialog = true;
        this.employee = form.employee;
        this.employeeConfirm = {};
        this.employeeTakeFrom = {};
        this.confirmInvoiceNumber = form.invoiceDoc;
        this.disabledEmployeeConfirm = true;
        this.disabledEmployeeTake = true;
        this.userIdConfirm = "";
        this.userIdTakeFrom = "";
        this.reasonTake = form.comment;
      } else if (form.status === "รออนุมัติ" || form.status === "ไม่อนุมัติ") {
      } else {
        this.dialogReasons = true;
        this.employee_take_by_code = form.employee_take_by.code;
        this.employee_take_by_name = `${form.employee_take_by.thainame} ${form.employee_take_by.thlastname}`;
        this.employee_take_at = form.take_at;

        if (typeof form.employee_take_from !== "undefined") {
          this.employee_take_from_code = form.employee_take_from.code;
          this.employee_take_from_name = `${form.employee_take_from.thainame} ${form.employee_take_from.thlastname}`;
        }
        console.log(form.employee_take_from);
      }
    },
    closeTakeDialog() {
      this.takeDialog = false;
    },
    async takeForm() {
      try {
        console.log("inv", this.confirmInvoiceNumber);
        console.log("idon", this.userIdConfirm);
        console.log("code", this.employee.code);
        let result = await this.axios.post(process.env.VUE_APP_API + `/take`, {
          id_user: this.employee.code,
          id_from: this.confirmInvoiceNumber,
          password: this.userIdConfirm,
          take_from: this.userIdTakeFrom
        });
        Swal.fire({
          type: "success",
          title: "ส่งคืนเอกสารเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 1500
        });
        this.takeDialog = false;
        this.getAllInvoiceForm();
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data;
          this.snackbar = true;
        }
      }
    },
    createPdf() {
      let route = this.$router.resolve({
        name: "a"
      });
      // let route = this.$router.resolve('/link/to/page'); // This also works.
      window.open(route.href, "_blank");
      // this.$router.push({ name: "a" });
    }
  },
  created() {
    this.obj = JSON.parse(Decode.decode(this.$cookies.get("user")));
    this.userId = this.obj.userid;
    this.getAllInvoiceForm();
  }
};
</script>

<style scoped>
>>> .v-btn.v-btn--outline {
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
}
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.v-stepper__header {
  background-image: -webkit-linear-gradient(180deg, #96c93d, #00b09b);
}
.my-toolbar {
  position: fixed;
  top: 0;
  border: 0;
  z-index: 999;
  display: block;
}
.btn-approved {
  position: fixed;
  top: 10%;
  right: 0;
  border: 0;
  z-index: 999;
  display: block;
  width: 150px;
}
.btn-reject {
  position: fixed;
  top: 15%;
  right: 0;
  border: 0;
  z-index: 999;
  display: block;
  width: 150px;
}
>>> .btn-approved > .v-btn__content {
  justify-content: left;
}
>>> .btn-reject > .v-btn__content {
  justify-content: left;
}
.btn-pdf {
  position: fixed;
  top: 5%;
  right: 0;
  border: 0;
  z-index: 999;
  display: block;
  width: 150px;
  justify-content: left;
}
>>> .btn-pdf > .v-btn__content {
  justify-content: left;
}
.btn-document {
  border-radius: 22px;
  /* box-shadow: 4px -7px 81px -2px rgba(0, 0, 0, 1); */
}

.approved.อนุมัติ {
  background-color: #7cc144;
  border-left: 10px solid #7cc144;
}

.approved.รออนุมัติ {
  background-color: #f9a825;
}

.approved.ไม่อนุมัติ {
  background-color: red;
}

>>> .v-data-table thead tr th {
  color: rgba(0, 0, 0, 1) !important;
}
</style>
