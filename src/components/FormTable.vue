<template>
  <div>
    <v-card color="white">
      <v-layout row wrap class="ml-3 mr-3 pt-6 pb-6">
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs12 md7 lg7 xl9>
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
            <v-flex xs2 lg2 xl1>
              <v-btn class="mt-4 primary" elevation="4" :disabled="isLoadingAll" @click="getDialog">
                <span v-if="$vuetify.breakpoint.smAndUp">เพิ่มรายการ</span>
                <v-icon v-if="$vuetify.breakpoint.xsOnly">mdi-plus</v-icon>
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
    </v-card>
    <v-snackbar v-model="snackbar" :color="colorSnackbar" right top>
      {{ textSnackbar }}
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :search="search"
      class="elevation-1"
      :loading="isLoadingAll"
      :items-per-page="itemsPerPage"
      :items="items"
    >
      <template v-slot:item.status="{ item }">
        <v-chip
          class="ma-2 white--text"
          :color="item.colorShip"
          @click="psReasons(item)"
        >{{item.status}}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          @click="openInfoDialog(item)"
          v-if="item.status === 'อนุมัติ'"
        >mdi-file-document</v-icon>
      </template>
      <template v-slot:item.edit="{ item }">
        <v-icon v-if="item.status === 'ไม่อนุมัติ'" small @click="getUpdateDialog(item)">mdi-pencil</v-icon>
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">
              <span class="white--text">สำหรับผู้ออกเอกสาร</span>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">
              <span class="white--text">แบบฟอร์มขออนุมัติลดหนี้</span>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">
              <span class="white--text">ตรวจสอบข้อมูลเอกสาร</span>
            </v-stepper-step>
            <v-btn icon dark @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <firstForm ref="first"></firstForm>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="checkForm1Valid">ต่อไป</v-btn>
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="2">
              <secondForm ref="second"></secondForm>
              <v-card-actions>
                <v-btn outlined text @click="e1=1" v-if="e1==2">ย้อนกลับ</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="checkForm2Valid"
                  :disabled="disabledBtn"
                  v-if="e1==2"
                >ต่อไป</v-btn>
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="3">
              <firstForm></firstForm>
              <secondForm></secondForm>
              <v-card-actions>
                <v-btn text @click="e1 =2 ">ย้อนกลับ</v-btn>

                <v-spacer></v-spacer>
                <v-btn color="primary" @click="addinvoiceDoc">เพิ่มรายการ</v-btn>
              </v-card-actions>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
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

          <v-btn icon large @click="closeInfoDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <infoForm1></infoForm1>
        <infoForm2></infoForm2>
        <v-container>
          <v-card flat>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="info" large dark @click="createPdf()">
                <v-icon left>mdi-file</v-icon>ดูเอกสาร
              </v-btn>

              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="updateDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      persistent
    >
      <v-card>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">
              <span class="white--text">สำหรับผู้ออกเอกสาร</span>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">
              <span class="white--text">แบบฟอร์มขออนุมัติลดหนี้</span>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">
              <span class="white--text">ตรวจสอบข้อมูลเอกสาร</span>
            </v-stepper-step>
            <v-btn icon dark @click="closeUpdateDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <firstForm ref="first"></firstForm>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="checkForm1Valid">ต่อไป</v-btn>
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="2">
              <secondForm ref="second"></secondForm>
              <v-card-actions>
                <v-btn outlined text @click="e1=1" v-if="e1==2">ย้อนกลับ</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="checkForm2Valid"
                  :disabled="disabledBtn"
                  v-if="e1==2"
                >ต่อไป</v-btn>
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="3">
              <firstForm></firstForm>
              <secondForm></secondForm>
              <v-card-actions>
                <v-btn text @click="e1 =2 ">ย้อนกลับ</v-btn>

                <v-spacer></v-spacer>
                <v-btn color="primary" @click="updateInvoice">อัพเดทข้อมูล</v-btn>
              </v-card-actions>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
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
                  <v-flex xs12>
                    <p class="text--primary subtitle-1">ชื่อผู้อนุมัติ: {{employee_approved_name}}</p>
                  </v-flex>

                  <v-flex xs12>
                    <p
                      class="text--primary subtitle-1"
                    >รหัสพนักงานผู้อนุมัติ: {{employee_approved.code}}</p>
                  </v-flex>
                  <v-flex xs12 v-if="comment.length > 0">
                    <p class="text--primary subtitle-1">เหตุผล: {{comment}}</p>
                  </v-flex>
                </v-card-text>
              </v-card>
              <v-card v-if="employee_take_from_code.length > 0" class="mt-3" outlined>
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
              <v-card v-if="employee_take_by_code.length > 0" class="mt-3" outlined>
                <v-card-text>
                  <v-flex xs12 v-if="employee_take_by_name.length > 0">
                    <p class="text--primary subtitle-1">ชื่อผู้รับเอกสาร: {{employee_take_by_name}}</p>
                  </v-flex>

                  <v-flex xs12 v-if="employee_take_by_code.length > 0">
                    <p class="text--primary subtitle-1">รหัสพนักงานผู้รับ: {{employee_take_by_code}}</p>
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
import Form1 from "./Form1";
import Form2 from "./Form2";

import Form1Info from "./Form1Info";
import Form2Info from "./Form2Info";
import { mapState } from "vuex";
import { Encode, Decode } from "../services/";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      itemsPerPage: 25,

      rowsPerPageItems: [10, 20, 30, 40],
      pagination: {
        rowsPerPage: 25
      },
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
        { text: "เลขที่ใบลดหนี้", value: "invoiceNumber" },
        { text: "ชื่อลูกค้า", value: "customerName" },
        { text: "การเปลี่ยนแปลงรายได้", value: "isIncome" },

        { text: "วันที่แก้ไขล่าสุด", value: "last_created" },
        { text: "สถานะ", value: "status", sortable: false, align: "center" },
        { text: "เอกสาร", value: "action", sortable: false, align: "center" },

        { text: "แก้ไขข้อมูล", value: "edit", sortable: false, align: "center" }
      ],
      items: [],
      itemsCopy: [],
      status: [],
      incomeList: [],
      select: "",
      selectIncome: "",
      isLoadingAll: false,
      snackbar: false,
      textSnackbar: "Hello i am snackbar",
      colorSnackbar: "green",
      search: "",
      notifications: false,
      sound: true,
      widgets: false,
      enabled: true,
      userId: "",
      labelDropdown: "สถานะทั้งหมด",
      labelIncome: "กรณีทั้งหมด",
      dialogReasons: false,
      comment: "",
      approved_by: "",
      employee: {},
      employee_approved: {},
      employee_approved_name: "",
      employee_take_by_name: "",
      employee_take_by: {},
      employee_take_by_code: "",
      employee_take_at: "",
      disabledBtn: false,
      startDate: "",
      stoptDate: "",
      menuStart: false,
      menuStop: false,
      searchCustomerName: "",
      advancedSearch: false,
      last_row: "",
      min_date: "",
      max_date: "",
      employee_take_from_name: "",
      employee_take_from: {},
      employee_take_from_code: ""
    };
  },
  components: {
    firstForm: Form1,
    secondForm: Form2,
    infoForm1: Form1Info,
    infoForm2: Form2Info
  },
  computed: {
    ...mapState([
      "dialog",
      "infoDialog",
      "updateDialog",
      "invoice",
      "my_invoice",
      "lastInvoiceDoc"
    ]),
    e1: {
      get() {
        console.log(this.$store.getters.e1);
        return this.$store.getters.e1;
      },
      set(value) {
        this.$store.dispatch("updateE1", value);
      }
    }
  },
  methods: {
    checkForm1Valid() {
      this.$refs.first.checkForm1Valid();
    },
    checkForm2Valid() {
      this.$refs.second.checkForm2Valid();
    },
    advancedSearchClick() {
      this.advancedSearch = !this.advancedSearch;
    },
    psReasons(item) {
      if (item.status !== "รออนุมัติ") {
        this.comment = "";
        this.employee_approved = "";
        this.employee_approved_name = "";
        this.employee_take_by_code = "";
        this.employee_take_by_name = "";
        this.employee_take_at = "";

        this.dialogReasons = true;
        this.comment = item.comment;
        this.employee_approved = item.employee_approved;
        this.employee_approved_name = `${item.employee_approved.thainame} ${item.employee_approved.thlastname}`;
        if (typeof item.employee_take_by !== "undefined") {
          this.employee_take_by_code = item.employee_take_by.code;
          this.employee_take_by_name = `${item.employee_take_by.thainame} ${item.employee_take_by.thlastname}`;
          this.employee_take_at = item.take_at;
        }
        console.log(item.employee_take_from);
        if (typeof item.employee_take_from !== "undefined") {
          this.employee_take_from_code = item.employee_take_from.code;
          this.employee_take_from_name = `${item.employee_take_from.thainame} ${item.employee_take_from.thlastname}`;
        }
      }
    },
    getDialog() {
      let year = new Date().getFullYear().toString();
      let split_item = this.last_row.split("-");
      if (year > split_item[0]) {
        this.$store.commit("updateLastInvoiceDoc", year + "-" + "00001");
      } else {
        let last_number = parseInt(split_item[1], 10) + 1;
        let str_number = last_number.toString();

        for (let index = 0; index < 4; index++) {
          if (str_number.length < 5) {
            str_number = "0" + str_number;
          }
        }
        console.log("aplsi", split_item[0] + "-" + str_number);
        this.$store.commit(
          "updateLastInvoiceDoc",
          split_item[0] + "-" + str_number
        );
      }

      this.$store.commit("updateDialog", true);
    },

    getUpdateDialog(item) {
      this.$store.commit("updateUpdatedialog", true);
      console.log("update", item);

      this.$store.commit("updateInvoiceInfo", item);
    },
    checkItemSearch() {
      let filterItems = this.items.filter(item => {
        return (
          item.index.toString().includes(this.search) ||
          item.invoiceDoc.toString().includes(this.search) ||
          item.invoiceNumber.toString().includes(this.search) ||
          item.customerId.toString().includes(this.search) ||
          item.customerName.includes(this.search)
          // item.invoice ==
          //   item.invoice.filter(inv => {
          //     console.log("inv", inv);
          //     return (
          //       inv.ref_so.includes(this.search) ||
          //       inv.service.includes(this.search) ||
          //       inv.invoiceAmount.includes(this.search) ||
          //       inv.invoiceSlip.includes(this.search)
          //     );
          //   })
        );
      });
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

      if (this.select === this.labelDropdown) {
        this.items = this.itemsCopy;
      } else {
        let filterItems = this.items.filter(
          item => item.status === this.select
        );
        this.items = filterItems;
      }
      console.log(this.items);
    },
    async getAllForm() {
      try {
        var moment = require("moment");

        this.isLoadingAll = true;

        this.items = [];
        this.status.push(this.labelDropdown);
        this.incomeList.push(this.labelIncome);

        let result = await this.axios.post(process.env.VUE_APP_API + `/menu`, {
          user_id: this.userId
        });
        let index = 1;
        console.log("result", result);
        result.data.forEach(form => {
          form.invoice.forEach(arr => {
            arr.invoiceSlip = arr.invoice_no;
            arr.soNumber = arr.ref_so;
            arr.invoiceAmount = arr.amount_no_vat;
          });
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
            last_row: form.last_row,
            comment: form.comment,
            approved_by: form.approved_by,
            status: form.status,
            colorShip: color
          };
          this.last_row = form.last_row;
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
        this.isLoadingAll = false;

        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.result;
          this.snackbar = true;
        }
      }
    },
    async addinvoiceDoc() {
      try {
        console.log("my_invoice", this.my_invoice);
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/create`,
          {
            id_document: this.lastInvoiceDoc,
            id_form: this.my_invoice.invoiceNumber,
            id_customer: this.my_invoice.customerId,
            customer_name: this.my_invoice.customerName,
            change_income: this.my_invoice.income ? 1 : 0,

            full: this.my_invoice.invoiceFull ? 1 : 0,
            full_text: this.my_invoice.invoiceFullAmount,
            some: this.my_invoice.invoicePartial ? 1 : 0,
            some_text: this.my_invoice.invoicePartialAmount,
            not_change_income: this.my_invoice.notIncome ? 1 : 0,
            other: this.my_invoice.otherIncome ? 1 : 0,
            other_text: this.my_invoice.invoiceOtherDescription,
            debt_text: this.my_invoice.invoiceDescription,
            id_user: this.userId,
            create_at: new Date(),

            invoice: this.my_invoice.invoice
          }
        );
        console.log("result", result);
        this.getAllForm();

        Swal.fire({
          type: "success",
          title: "เพิ่มใบแจ้งหนี้เรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 1500
        });
        this.$store.commit("clearFormData");
        this.$store.commit("updateDialog", false);
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.result;
          console.log(error.response.data.result);
          this.snackbar = true;
        }
      }
    },
    openInfoDialog(item) {
      localStorage.removeItem("item");

      console.log("info", item);
      // this.$cookies.remove("item");

      // this.$cookies.set("item", item);
      localStorage.setItem("item", Encode.encode(JSON.stringify(item)));

      this.$store.commit("updateInfoDialog", true);
      this.$store.commit("updateInvoiceInfo", item);

      this.employee = item.employee;
    },
    async updateInvoice() {
      try {
        let result = await this.axios.post(process.env.VUE_APP_API + `/edit`, {
          id_document: this.lastInvoiceDoc,
          id_form: this.my_invoice.invoiceNumber,
          id_customer: this.my_invoice.customerId,
          customer_name: this.my_invoice.customerName,
          change_income: this.my_invoice.income ? 1 : 0,

          full: this.my_invoice.invoiceFull ? 1 : 0,
          full_text: this.my_invoice.invoiceFullAmount,
          some: this.my_invoice.invoicePartial ? 1 : 0,
          some_text: this.my_invoice.invoicePartialAmount,
          not_change_income: this.my_invoice.notIncome ? 1 : 0,
          other: this.my_invoice.otherIncome ? 1 : 0,
          other_text: this.my_invoice.invoiceOtherDescription,
          debt_text: this.my_invoice.invoiceDescription,
          id_user: this.userId,
          create_at: new Date(),

          invoice: this.my_invoice.invoice
        });
        Swal.fire({
          type: "success",
          title: "อัพเดทเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 1500
        });
        console.log("result", result);
        this.getAllForm();
        this.$store.commit("clearFormData");
        this.$store.commit("updateUpdatedialog", false);
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.result;
          this.snackbar = true;
        }
      }
    },
    closeDialog() {
      this.$store.commit("updateDialog", false);
      this.$store.commit("clearFormData");
    },
    closeInfoDialog() {
      this.$store.commit("updateInfoDialog", false);
      this.$store.commit("clearFormData");
    },
    closeUpdateDialog() {
      this.$store.commit("updateUpdatedialog", false);
      this.$store.commit("clearFormData");
    },
    createPdf() {
      let route = this.$router.resolve({
        name: "a"
      });
      window.open(route.href, "_blank");
    }
  },
  watch: {
    search(value) {
      console.log("search", value);

      this.items = this.itemsCopy;
      this.checkItemStatus();
      this.checkItemDate();
      this.checkItemSearch();
      this.checkItemIncome();
    },
    select(value) {
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
  created() {
    var obj = JSON.parse(Decode.decode(this.$cookies.get("user")));
    this.userId = obj.userid;
    this.getAllForm();
  }
};
</script>

<style scoped>
.v-btn.v-btn--outline {
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
.btn-pdf {
  position: fixed;
  top: 10%;
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

.approved.อนุมัติ {
  background-color: #7cc144;
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
