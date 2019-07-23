<template>
  <v-app>
    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>ตารางอนุมัติการแจ้งหนี้</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      </v-toolbar>
      <v-snackbar v-model="snackbar" :color="colorSnackbar" right top>
        {{ textSnackbar }}
        <v-btn color="white" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        class="elevation-1"
        :pagination.sync="pagination"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.invoiceNumber }}</td>
          <td>{{ props.item.service }}</td>
          <td>{{ props.item.last_created }}</td>
          <td>{{ props.item.status }}</td>
          <td class="justify-center layout px-0">
            <v-btn
              class="btn-document"
              :color="props.item.receiveDocumentStatus"
              :disabled="props.item.receiveDocumentDisabled"
              @click="openConfirmForm(props.item)"
            >{{props.item.receiveDocument}}</v-btn>
          </td>
          <td class="text-xs-center">
            <v-icon small @click="openInfoDialog(props.item)">mdi-file-document</v-icon>
          </td>
          <v-dialog v-model="confirmDialog" persistent max-width="600px">
            <v-card>
              <v-toolbar flat>
                <v-toolbar-title>ยืนยันการรับเอกสาร</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-container grid-list-md>
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
                    <v-flex xs12 sm12 md12>
                      <v-text-field label="รหัสพนักงานของผู้รับ*" required v-model="userIdConfirm"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="confirmDialog = false">ปิด</v-btn>
                <v-btn
                  class="success"
                  flat
                  @click="confirmForm(props.item)"
                  :disabled="checkEmployeeId"
                >บันทึก</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table>
    </v-card-text>

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
            <v-icon dark>close</v-icon>
          </v-btn>
          <v-toolbar-items class="hidden-sm-and-down"></v-toolbar-items>
        </v-toolbar>

        <infoForm1></infoForm1>
        <infoForm2></infoForm2>
        <v-container>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                color="success"
                large
                dark
                v-on="on"
                @click="openApproveDialog(true)"
                v-if="showBtnAprrove"
              >
                <v-icon left>mdi-check</v-icon>อนุมัติ
              </v-btn>
            </template>
            <span>อนุมัติ</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                color="error"
                large
                dark
                v-on="on"
                @click="openApproveDialog(false)"
                v-if="showBtnReject"
              >
                <v-icon left>mdi-close</v-icon>ไม่อนุมัติ
              </v-btn>
            </template>
            <span>ไม่อนุมัติ</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn color="info" large dark v-on="on" @click="savePdf()">
                <v-icon left>mdi-file</v-icon>ดูเอกสาร
              </v-btn>
            </template>
            <span>ดูเอกสาร</span>
          </v-tooltip>
        </v-container>

        <v-dialog v-model="approveDialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{headlinneApprove}}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex>
                    <v-textarea
                      v-model="approveComment"
                      name="input-7-4"
                      label="ความคิดเห็นเพิ่มเติม"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="closeApproveDialog">ปิด</v-btn>
              <v-btn color="blue darken-1" flat @click="saveApproveDialog">{{btnApprove}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card-text style="height: 30px; position: relative"></v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Form1 from "./Form1";
import Form2 from "./Form2";

import Form1Info from "./Form1Info";
import Form2Info from "./Form2Info";
import InfoForm from "./InfoForm";
import { mapState } from "vuex";
import { Encode, Decode } from "../services/";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      rowsPerPageItems: [10, 20, 30, 40],
      pagination: {
        rowsPerPage: 25
      },
      headers: [
        {
          text: "ลำดับ",
          align: "left",
          value: "id"
        },
        {
          text: "เลขเอกสาร",
          value: "invoiceNumber",
          align: "left"
        },
        { text: "บริการที่ใช้งาน", value: "service" },
        { text: "วันที่แก้ไขล่าสุด", value: "last_created" },
        { text: "สถานะ", value: "status" },
        {
          text: "การรับเอกสาร",
          value: "name",
          sortable: false,
          align: "center"
        },
        { text: "เอกสาร", value: "", sortable: false, align: "center" }
      ],
      items: [],
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
      userIdConfirm: ""
    };
  },
  components: {
    firstForm: Form1,
    secondForm: Form2,
    infoForm1: Form1Info,
    infoForm2: Form2Info
  },
  computed: {
    ...mapState(["dialog", "updateDialog", "invoice"]),
    e1: {
      get() {
        return this.$store.getters.e1;
      },
      set(value) {
        this.$store.dispatch("updateE1", value);
      }
    },
    checkEmployeeId() {
      if (this.isNormalInteger(this.userIdConfirm)) {
        return false;
      }
      return true;
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
      this.$store.commit("updateInvoiceInfo", item);
      if (this.invoice.status === "ไม่อนุมัติ") {
        this.showBtnReject = false;
        this.showBtnAprrove = false;
      } else if (this.invoice.status === "อนุมัติ") {
        this.showBtnReject = false;
        this.showBtnAprrove = false;
      } else {
        this.showBtnReject = true;
        this.showBtnAprrove = true;
      }
    },
    openApproveDialog(value) {
      this.approveDialog = true;
      this.isApprove = value;
      if (this.isApprove) {
        this.headlinneApprove = "อนุมัติใบแจ้งหนี้";
        this.btnApprove = "อนุมัติ";
      } else {
        this.headlinneApprove = "ไม่อนุมัติใบแจ้งหนี้";
        this.btnApprove = "ไม่อนุมัติ";
      }
    },
    closeApproveDialog() {
      this.approveDialog = false;
      this.approveComment = "";
    },
    async saveApproveDialog() {
      try {
        let status = "ไม่อนุมัติ";
        if (this.isApprove) {
          status = "อนุมัติ";
        }
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/approve`,
          {
            id_user: this.userId,
            id_from: this.invoice.invoiceNumber,
            status: status,
            edit_at: new Date(),
            comment: this.approveComment
          }
        );
        Swal.fire({
          type: "success",
          title: "อนุมัติสำเร็จเรียบร้อย",
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
        } else if (error.request) {
        } else {
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
    async getAllInvoiceForm() {
      try {
        this.items = [];
        let result = await this.axios.post(process.env.VUE_APP_API + `/menu`, {
          user_id: this.userId
        });
        let index = 1;
        result.data.forEach(form => {
          let receiveDocument = "รอการอนุมัติ";
          let receiveDocumentDisabled = false;
          let receiveDocumentStatus = "info";

          if (form.status === "อนุมัติ") {
            receiveDocument = "ยืนยันการรับเอกสาร";
            receiveDocumentStatus = "success";
          } else if (form.status === "ไม่อนุมัติ") {
            receiveDocument = "ไม่ได้รับการอนุมัติ";
            receiveDocumentStatus = "error";
          } else {
            receiveDocumentDisabled = true;
          }
          let f = {
            id: index++,
            invoiceNumber: form.id_from,
            customerId: form.id_customer,
            customerName: form.customer_name,
            invoiceSlip: form.invoice_no,
            soNumber: form.ref_so,
            invoiceAmount: form.amount_no_vat,
            service: form.service,
            sinceServiceYear: form.from_year,
            sinceServiceMonth: form.from_month,
            toServiceYear: form.to_year,
            toServiceMonth: form.to_month,
            income: form.change_income,
            invoiceFull: form.full,
            invoiceFullAmount: form.full_text,
            invoicePartial: form.some,
            invoicePartialAmount: form.some_text,
            notIncome: form.not_change_income,
            otherIncome: form.other,
            invoiceOtherDescription: form.other_text,
            invoiceDescription: form.debt_text,
            last_created: form.create_at,
            status: form.status,
            receiveDocument: receiveDocument,
            receiveDocumentDisabled: receiveDocumentDisabled,
            receiveDocumentStatus: receiveDocumentStatus
          };
          this.items.push(f);
        });
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data;
          this.snackbar = true;
        } else if (erro.request) {
        } else {
        }
      }
    },
    openConfirmForm(form) {
      if (form.receiveDocumentStatus == "success") {
        this.confirmInvoiceNumber = form.invoiceNumber;
        this.userIdConfirm = "";
        this.confirmDialog = true;
      } else {
        Swal.fire({
          type: "error",
          text: "เอกสารยังไม่ได้รับการอนุมัติ"
        });
      }
    },
    async confirmForm(form) {
      try {
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/confirm`,
          {
            id_user: this.userId,
            id_from: form.invoiceNumber,
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
        } else if (error.request) {
        } else {
        }
      }
    },
    savePdf() {
      let symbolIncome = this.invoice.income
        ? "check_box"
        : "check_box_outline_blank";
      let symbolNotIncome = this.invoice.notIncome
        ? "check_box"
        : "check_box_outline_blank";

      let symbolOtherIncome = this.invoice.otherIncome
        ? "check_box"
        : "check_box_outline_blank";
      let symbolInvoiceFull = this.invoice.income
        ? this.invoice.invoiceFull
          ? "check_box"
          : "check_box_outline_blank"
        : "check_box_outline_blank";
      let symbolInvoicePartial = this.invoice.income
        ? this.invoice.invoicePartial
          ? "check_box"
          : "check_box_outline_blank"
        : "check_box_outline_blank";

      let invoiceFullAmount = this.invoice.invoiceFull
        ? `${this.invoice.invoiceFullAmount}`
        : "0";
      let invoicePartialAmount = this.invoice.invoicePartial
        ? `${this.invoice.invoicePartialAmount}`
        : "0";

      var dd = {
        content: [
          {
            text: "แบบฟอร์มขออนุมัติลดหนี้  \n ",
            style: "header"
          },
          {
            style: "tableExample",
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "ส่วนที่ 1 สำหรับผู้ออกเอกสาร",
                    style: "subheader"
                  }
                ],
                [
                  {
                    alignment: "justify",
                    columns: [
                      {
                        text: `\n\nรหัสลูกค้า: ${this.invoice.customerId}   ชื่อลูกค้า: ${this.invoice.customerName}\n อ้างอิง S/O เลขที่: ${this.invoice.soNumber}`,
                        style: "headerLeft"
                      },
                      {
                        text: `เลขที่ใบลดหนี้: ${this.invoice.invoiceNumber} \n\n เลขที่ใบแจ้งหนี้/เลขที่ใบเสร็จรับเงิน: ${this.invoice.invoiceSlip} \n จำนวนเงินตามใบแจ้งหนี้(ไม่รวมภาษีมูลค่าเพิ่ม): ${this.invoice.invoiceAmount} บาท`,
                        style: "headerRight"
                      }
                    ]
                  }
                ]
              ]
            },
            layout: {
              fillColor: function(rowIndex, node, columnIndex) {
                return rowIndex === 0 ? "#CCCCCC" : null;
              }
            }
          },
          {
            style: "tableExample",
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "ขออนุมันติลดหนี้",
                    style: "middleSubHeader"
                  }
                ]
              ]
            },
            layout: {
              fillColor: function(rowIndex, node, columnIndex) {
                return rowIndex === 0 ? "#CCCCCC" : null;
              }
            }
          },
          {
            style: "tableExample",
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: `บริการที่ใช้งาน: ${this.invoice.service}`,
                    style: "headerLeft"
                  },
                  {
                    text: `ตั้งแต่รอบบริการ พ.ศ.${this.invoice.sinceServiceYear} เดือน ${this.invoice.sinceServiceMonth} \n ถึงรอบบริการ พ.ศ.${this.invoice.toServiceYear} เดือน ${this.invoice.toServiceMonth}`,
                    style: "headerLeft"
                  }
                ]
              ]
            }
          },
          {
            style: "tableExample",
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    columns: [
                      {
                        text: [
                          { text: `${symbolIncome.trim()}`, style: "symbol1" },
                          {
                            text: [
                              {
                                text: "กรณีเปลี่ยนแปลงรายได้\n",
                                style: "headerRight"
                              },
                              {
                                text: `${symbolInvoiceFull}`,
                                style: "symbol1"
                              },
                              {
                                text: `ลดหนี้เต็มจำนวนจำนวน${invoiceFullAmount}บาท(ไม่รวม VAT)\n `,
                                style: "headerLeft"
                              },
                              {
                                text: `${symbolInvoicePartial}`,
                                style: "symbol1"
                              },
                              {
                                text: `ลดหนี้บางส่วนจำนวน${invoicePartialAmount}บาท(ไม่รวม VAT)`,
                                style: "headerLeft"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        text: [
                          {
                            text: `${symbolNotIncome}`,
                            style: "symbol1"
                          },
                          {
                            text: " กรณีไม่เปลี่ยนแปลงรายได้ ",
                            style: "headerRight"
                          }
                        ]
                      }
                    ]
                  }
                ]
              ]
            }
          },
          {
            style: "tableExample",
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: [
                      {
                        text: `${symbolOtherIncome}`,
                        style: "symbol1"
                      },
                      {
                        text: `อื่นๆ: ${this.invoice.invoiceOtherDescription} \n`,
                        style: "headerLeft"
                      },
                      {
                        text: `สาเหตุการลดหนี้: ${this.invoice.invoiceDescription}`,
                        style: "headerLeft"
                      }
                    ]
                  }
                ]
              ]
            }
          },
          {
            style: "tableExample",
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text:
                      "ส่วนที่ 2 สำหรับฝ่ายบริหารต้นทุน (ตรวจสอบต้นทุนที่เกิดขึ้นของบริการที่ขอลดหนี้)",
                    style: "subheader"
                  }
                ],
                [
                  {
                    columns: [
                      {
                        text: [
                          { text: "check_box_outline_blank", style: "symbol1" },
                          {
                            text: [
                              {
                                text: " ต้นทุนบริการ \n \t",
                                style: "headerRight"
                              },
                              {
                                text: "check_box_outline_blank",
                                style: "symbol1"
                              },
                              {
                                text:
                                  "มีค่าใช้จ่ายเกิดขึ้นแล้ว จำนวน .......... บาท(ไม่รวม VAT)\n\t",
                                style: "headerRight"
                              },
                              {
                                text:
                                  "ค่าใช้จ่ายสำหรับบริการ .......... บาท(ไม่รวม VAT)\n",
                                style: "headerRight"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        text: [
                          {
                            text: "\ncheck_box_outline_blank",
                            style: "symbol1"
                          },
                          {
                            text: " ยังไม่มีค่าใช้จ่ายเกิดขึ้น \n",
                            style: "headerRight"
                          },
                          {
                            text:
                              "เนื่องจาก ................................................... ",
                            style: "headerLeft"
                          }
                        ]
                      }
                    ]
                  }
                ]
              ]
            },
            layout: {
              fillColor: function(rowIndex, node, columnIndex) {
                return rowIndex === 0 ? "#CCCCCC" : null;
              }
            }
          },
          {
            style: "tableExample",
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: [
                      {
                        text: "check_box_outline_blank",
                        style: "symbol1"
                      },
                      {
                        text:
                          " อื่นๆ น็อกคาวบอย คอลัมนิสต์ไบโอฮันนีมูน อพาร์ตเมนท์ เยอบีร่าเซี้ยวหยวนยาวี วอล์คเบอร์เกอร์แอปเปิลโฟล์ค กรีนโปรดักชั่นแซ็กมั้ย \n",
                        style: "headerLeft"
                      }
                    ]
                  }
                ]
              ]
            }
          },

          {
            style: "tableExample",
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    text: "ส่วนที่ 3 สำหรับฝ่ายบัญชีและการเงิน",
                    style: "subheader"
                  }
                ],
                [
                  {
                    text:
                      "\t \t \t ความคิดเห็น: ไบโออุรังคธาตุ รวมมิตร โอเวอร์ดัมพ์ช็อปเปอร์ช็อปปิ้งออดิทอเรียม แม็กกาซีนเซอร์วิสอุปสงค์คอร์สเพนกวิน ช็อคธรรมาวืดแผดเผา อาร์ติสต์ม้ง แอปพริคอทโบตั๋น รีสอร์ตบลูเบอร์รี่อิออน แฟลชราสเบอร์รีเที่ยงคืนเอสเปรสโซ ฮวงจุ้ยเชอร์รี่ฟิวเจอร์แคมเปญ เซาท์ปาสคาล ฟิวเจอร์อะไมค์เฟรชชี่รากหญ้า เอนทรานซ์ต่อรองท็อปบู๊ทอะแคป พาวเวอร์สปิริตเพนกวินคอปเตอร์ สตาร์เป่ายิ้งฉุบกรรมาชน อันเดอร์ไคลแม็กซ์มาร์เก็ตติ้ง \n",
                    style: "headerLeft"
                  }
                ]
              ]
            },
            layout: {
              fillColor: function(rowIndex, node, columnIndex) {
                return rowIndex === 0 ? "#CCCCCC" : null;
              }
            }
          },
          {
            style: "tableExample",

            table: {
              widths: ["*"],
              headerRows: 1,
              body: [
                [
                  {
                    text: "ส่วนที่ 4 สำหรับฝ่ายบริหารกรณีเปลี่ยนแปลงรายได้",
                    style: "subheader"
                  }
                ]
              ]
            },
            layout: {
              fillColor: function(rowIndex, node, columnIndex) {
                return rowIndex === 0 ? "#CCCCCC" : null;
              }
            }
          },
          {
            style: "tableExample",
            table: {
              widths: ["*", "*"],
              body: [
                [
                  {
                    text: [
                      {
                        text: "ความเห็นฝ่ายบริหาร \n",
                        style: "middleSubHeader"
                      },
                      {
                        text: "check_box_outline_blank",
                        style: "symbol1"
                      },
                      {
                        text: " อนุมัติ \n",
                        style: "headerLeft"
                      },
                      {
                        text: "check_box_outline_blank",
                        style: "symbol1"
                      },
                      {
                        text: " ขอข้อมูลเพิ่มเติมเรื่อง  ",
                        style: "headerLeft"
                      },
                      {
                        text:
                          "\t .................................................. \n",
                        style: "middleSubHeader"
                      },

                      {
                        text: "check_box_outline_blank",
                        style: "symbol1"
                      },
                      {
                        text: " ไม่อนุมัติ เนื่องจาก ",
                        style: "headerLeft"
                      },
                      {
                        text:
                          "\t\t .................................................. \n",
                        style: "middleSubHeader"
                      },
                      {
                        text:
                          "\t\t .................................................................................................... \n",
                        style: "headerLeft"
                      }
                    ]
                  },
                  {
                    text: [
                      {
                        text: "ความเห็นฝ่ายบริหาร \n",
                        style: "middleSubHeader"
                      },
                      {
                        text: "check_box_outline_blank",
                        style: "symbol1"
                      },
                      {
                        text: " อนุมัติ \n",
                        style: "headerLeft"
                      },
                      {
                        text: "check_box_outline_blank",
                        style: "symbol1"
                      },
                      {
                        text: " ขอข้อมูลเพิ่มเติมเรื่อง  ",
                        style: "headerLeft"
                      },
                      {
                        text:
                          "\t .................................................. \n",
                        style: "middleSubHeader"
                      },

                      {
                        text: "check_box_outline_blank",
                        style: "symbol1"
                      },
                      {
                        text: " ไม่อนุมัติ เนื่องจาก ",
                        style: "headerLeft"
                      },
                      {
                        text:
                          "\t\t ...................................................... \n",
                        style: "middleSubHeader"
                      },
                      {
                        text:
                          "\t\t ................................................................................................ \n",
                        style: "headerLeft"
                      }
                    ]
                  }
                ]
              ]
            }
          }
        ],
        defaultStyle: {
          font: "THSarabunNew",
          columnGap: 20
        },
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            alignment: "center"
          },
          tableExample: {
            margin: [0, 0, 0, 0]
          },
          headerRight: {
            fontSize: 13,
            alignment: "right"
          },
          headerLeft: {
            fontSize: 13,
            alignment: "left"
          },
          subheader: {
            fontSize: 13,
            bold: true
          },
          middleSubHeader: {
            fontSize: 13,
            bold: true,
            alignment: "center"
          },
          fontawesome: {
            font: "FontAwesome",
            color: "#656565"
          },
          icon: { font: "Fontello" },
          quote: {
            italics: true
          },
          small: {
            fontSize: 8
          },
          text: {
            fontSize: 15
          },
          invoiceNumber: {
            alignment: "right"
          },
          exText: {
            alignment: "justify"
          }
        }
      };

      dd.styles.symbol = { font: "FontAwesome", color: "red" };
      dd.styles.symbol1 = { font: "MaterialIconsRegular" };
      pdfMake.createPdf(dd).open();
      const pdfDocGenerator = pdfMake.createPdf(dd);
      // const pdfDocGenerator = pdfMake.createPdf(dd);
      // pdfDocGenerator.getBase64(data => {
      //   alert(data);
      // });
    }
  },
  created() {
    pdfMake.fonts = {
      THSarabunNew: {
        normal: "THSarabunNew.ttf",
        bold: "THSarabunNew-Bold.ttf",
        italics: "THSarabunNew-Italic.ttf",
        bolditalics: "THSarabunNew-BoldItalic.ttf"
      },
      Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-MediumItalic.ttf"
      },
      Fontello: {
        normal: "fontello.ttf",
        bold: "fontello.ttf",
        italics: "fontello.ttf",
        bolditalics: "fontello.ttf"
      },
      FontAwesome: {
        normal: "fontawesome-webfont.ttf",
        bold: "fontawesome-webfont.ttf",
        italics: "fontawesome-webfont.ttf",
        bolditalics: "fontawesome-webfont.ttf"
      },
      Wingdng2: {
        normal: "wingdng2.ttf",
        bold: "wingdng2.ttf",
        italics: "wingdng2.ttf",
        bolditalics: "wingdng2.ttf"
      },
      MaterialIconsRegular: {
        normal: "MaterialIcons-Regular.ttf"
      }
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    var obj = JSON.parse(Decode.decode(this.$cookies.get("user")));
    this.userId = obj.userid;
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
</style>
