<template>
  <v-app>
    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>ตารางอนุมัติหนี้</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-btn outline class="buttonInsert" @click="getDialog">Insert</v-btn>
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
        :loading="isLoadingAll"
        :pagination.sync="pagination"
      >
        <template v-slot:items="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.invoiceNumber }}</td>
          <td>{{ props.item.service }}</td>
          <td>{{ props.item.last_created }}</td>
          <td>{{ props.item.status }}</td>
          <td class="text-xs-center">
            <v-icon small @click="openInfoDialog(props.item)">mdi-file-document</v-icon>
          </td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="getUpdateDialog(props.item)">edit</v-icon>
          </td>
        </template>
      </v-data-table>
    </v-card-text>

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
              <span class="white--text"></span>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">
              <span class="white--text"></span>
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">
              <span class="white--text"></span>
            </v-stepper-step>
            <v-btn icon dark @click="closeDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <firstForm></firstForm>
            </v-stepper-content>

            <v-stepper-content step="2">
              <secondForm></secondForm>
            </v-stepper-content>

            <v-stepper-content step="3">
              <firstForm></firstForm>
              <secondForm></secondForm>
              <v-btn color="primary" @click="addinvoiceDoc">Continue</v-btn>
              <v-btn flat @click="e1 =2 ">Cancel</v-btn>
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
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn icon large @click="closeInfoDialog">
              <v-icon dark>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <infoForm1></infoForm1>
        <infoForm2></infoForm2>
        <v-container>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn color="info" large dark v-on="on" @click="savePdf()">
                <v-icon left>mdi-file</v-icon>พิมพ์เอกสาร
              </v-btn>
            </template>
            <span>พิมพ์เอกสาร</span>
          </v-tooltip>
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
            <v-stepper-step :complete="e1 > 1" step="1"></v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2"></v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3"></v-stepper-step>
            <v-btn icon dark @click="closeUpdateDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <firstForm></firstForm>
            </v-stepper-content>

            <v-stepper-content step="2">
              <secondForm></secondForm>
            </v-stepper-content>

            <v-stepper-content step="3">
              <firstForm></firstForm>
              <secondForm></secondForm>
              <v-btn color="primary" @click="updateInvoice">Continue</v-btn>
              <v-btn flat @click="e1 =2 ">Cancel</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake2 from "pdfmake-unicode";

import Form1 from "./Form1";
import Form2 from "./Form2";

import Form1Info from "./Form1Info";
import Form2Info from "./Form2Info";
import InfoForm from "./InfoForm";
import { mapState } from "vuex";
import { Encode, Decode } from "../services/";
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
        { text: "เอกสาร", value: "", sortable: false, align: "center" },

        { text: "แก้ไขข้อมูล", value: "name", sortable: false, align: "center" }
      ],
      items: [],
      isLoadingAll: false,
      snackbar: false,
      textSnackbar: "Hello i am snackbar",
      colorSnackbar: "green",
      search: "",
      notifications: false,
      sound: true,
      widgets: false,
      enabled: true,
      infoDialog: false,
      userId: ""
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
    }
  },
  methods: {
    getDialog() {
      this.$store.commit("updateDialog", true);
    },
    getUpdateDialog(item) {
      this.$store.commit("updateUpdatedialog", true);
      this.$store.commit("updateInvoiceInfo", item);
    },
    async getAllForm() {
      try {
        this.isLoadingAll = true;

        this.items = [];
        let result = await this.axios.post(process.env.VUE_APP_API + `/menu`, {
          user_id: this.userId
        });
        let index = 1;
        result.data.forEach(form => {
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
            status: form.status
          };
          this.items.push(f);
        });
        this.isLoadingAll = false;
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.result;
          this.snackbar = true;
        } else if (error.request) {
        } else {
        }
      }
    },
    async addinvoiceDoc() {
      try {
        let result = await this.axios.post(
          process.env.VUE_APP_API + `/create`,
          {
            id_user: this.userId,
            id_from: this.invoice.invoiceNumber,
            create_at: new Date(),
            id_customer: this.invoice.customerId,
            customer_name: this.invoice.customerName,
            invoice_no: this.invoice.invoiceSlip,
            ref_so: this.invoice.soNumber,
            amount_no_vat: this.invoice.invoiceAmount,

            service: this.invoice.service,
            from_year: this.invoice.sinceServiceYear,
            from_month: this.invoice.sinceServiceMonth,
            to_year: this.invoice.toServiceYear,
            to_month: this.invoice.toServiceMonth,

            change_income: this.invoice.income ? 1 : 0,
            full: this.invoice.invoiceFull ? 1 : 0,
            full_text: this.invoice.invoiceFullAmount,

            some: this.invoice.invoicePartial ? 1 : 0,
            some_text: this.invoice.invoicePartialAmount,

            not_change_income: this.invoice.notIncome ? 1 : 0,
            other: this.invoice.otherIncome ? 1 : 0,
            other_text: this.invoice.invoiceOtherDescription,

            debt_text: this.invoice.invoiceDescription
          }
        );
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
          this.snackbar = true;
        } else if (error.request) {
        } else {
        }
      }
    },
    openInfoDialog(item) {
      this.infoDialog = true;
      this.$store.commit("updateInvoiceInfo", item);
    },
    async updateInvoice() {
      try {
        let result = await this.axios.post(process.env.VUE_APP_API + `/edit`, {
          old_id_from: this.invoice.invoiceNumber,
          id_user: this.userId,
          id_from: this.invoice.invoiceNumber,
          create_at: new Date(),
          id_customer: this.invoice.customerId,
          customer_name: this.invoice.customerName,
          invoice_no: this.invoice.invoiceSlip,
          ref_so: this.invoice.soNumber,
          amount_no_vat: this.invoice.invoiceAmount,

          service: this.invoice.service,
          from_year: this.invoice.sinceServiceYear,
          from_month: this.invoice.sinceServiceMonth,
          to_year: this.invoice.toServiceYear,
          to_month: this.invoice.toServiceMonth,

          change_income: this.invoice.income ? 1 : 0,
          full: this.invoice.invoiceFull ? 1 : 0,
          full_text: this.invoice.invoiceFullAmount,

          some: this.invoice.invoicePartial ? 1 : 0,
          some_text: this.invoice.invoicePartialAmount,

          not_change_income: this.invoice.notIncome ? 1 : 0,
          other: this.invoice.otherIncome ? 1 : 0,
          other_text: this.invoice.other_text,

          debt_text: this.invoice.invoiceDescription
        });
        // await this.savePdf();
        this.getAllForm();
        this.$store.commit("clearFormData");
        this.$store.commit("updateUpdatedialog", false);
      } catch (error) {
        if (error.response) {
          this.colorSnackbar = "red";
          this.textSnackbar = error.response.data.result;
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
      // pdfDocGenerator.getBase64(data => {
      //   alert(data);
      // });
    }
  },
  watch: {},
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
</style>
