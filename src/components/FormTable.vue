<template>
  <v-app>
    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>Table</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-btn outline class="buttonInsert" @click="getDialog">Insert</v-btn>
      </v-toolbar>
      <v-data-table :headers="headers" :items="items" :search="search" class="elevation-1">
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
            <v-icon small @click>delete</v-icon>
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
            <v-stepper-step :complete="e1 > 1" step="1">Name of step 1</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">Name of step 2</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Name of step 3</v-stepper-step>
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
              <v-btn color="primary" @click="savePdf">Continue</v-btn>
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
            <v-stepper-step :complete="e1 > 1" step="1">Name of step 1</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">Name of step 2</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Name of step 3</v-stepper-step>
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
              <v-btn color="primary" @click>Continue</v-btn>
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

import Form1 from "./Form1";
import Form2 from "./Form2";

import Form1Info from "./Form1Info";
import Form2Info from "./Form2Info";
import InfoForm from "./InfoForm";
import { mapState } from "vuex";

export default {
  data() {
    return {
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

        { text: "Actions", value: "name", sortable: false, align: "center" }
      ],
      items: [
        {
          id: 1,
          invoiceNumber: "123",
          customerId: "123",
          customerName: "444",
          invoiceSlip: "5555",
          soNumber: "666",
          invoiceAmount: "7777",
          service: "is a Sample",
          sinceServiceYear: 2555,
          sinceServiceMonth: "มกราคม",
          toServiceYear: 2560,
          toServiceMonth: "กุมภาพันธ์",
          last_created: "1/1/2022",
          status: ":)"
        }
      ],
      search: "",
      notifications: false,
      sound: true,
      widgets: false,
      enabled: true,
      infoDialog: false
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
    addinvoiceDoc() {
      console.log(this.$store.state.invoice);
      let length = this.items.length + 1;
      let item = {
        id: length,
        invoiceNumber: this.invoice.invoiceNumber,
        customerId: this.invoice.customerId,
        customerName: this.invoice.customerName,
        invoiceSlip: this.invoice.invoiceSlip,
        soNumber: this.invoice.soNumber,
        invoiceAmount: this.invoice.invoiceAmount,

        service: this.invoice.service,
        sinceServiceYear: this.invoice.sinceServiceYear,
        sinceServiceMonth: this.invoice.sinceServiceMonth,
        toServiceYear: this.invoice.toServiceYear,
        toServiceMonth: this.invoice.toServiceMonth,
        last_created: "1/1/2022",
        status: ":)"
      };
      console.log("itemAdded", item);
      this.items.push(item);

      //clear
      this.$store.commit("clearFormData");
      this.$store.commit("updateDialog", false);
    },
    openInfoDialog(item) {
      this.infoDialog = true;
      this.$store.commit("updateInvoiceInfo", item);
      console.log("infoClicked", this.invoice);
    },
    updateInvoice(item) {
      // this.$store.commit("updateUpdatedialog", true);
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
      let exId = 62107;
      var dd = {
        content: [
          {
            text: "แบบฟอร์มขออนุมัติลดหนี้\n",
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
                        text: `\n\nรหัสลูกค้า ..${this.invoice.invoiceNumber}...   ชื่อลูกค้า ........... \n อ้างอิง S/O เลขที่ .........................................................................`,
                        style: "headerLeft"
                      },
                      {
                        text: `เลขที่ใบลดหนี้ ....... \n\n เลขที่ใบแจ้งหนี้/เลขที่ใบเสร็จรับเงิน.......... \n จำนวนเงินตามใบแจ้งหนี้(ไม่รวมภาษีมูลค่าเพิ่ม) ...... บาท`,
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
                    text: "บริการที่ใช้งาน",
                    style: "headerLeft"
                  },
                  {
                    text:
                      "ตั้งแต่รอบบริการ พ.ศ. เดือน \n ถึงรอบบริการ พ.ศ. เดือน ",
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
                          { text: "\uf111", style: "symbol" },
                          {
                            text: [
                              {
                                text: " กรณีเปลี่ยนแปลงรายได้ \n \t",
                                style: "headerRight"
                              },
                              { text: "\uf111", style: "symbol" },
                              {
                                text:
                                  " ลดหนี้เต็มจำนวน จำนวน .......... บาท (ไม่รวม VAT) \n\t",
                                style: "headerRight"
                              },
                              { text: " \uf111", style: "symbol" },
                              {
                                text:
                                  " ลดหนี้บางส่วน จำนวน .......... บาท (ไม่รวม VAT) \n",
                                style: "headerRight"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        text: [
                          {
                            text: "\uf111",
                            style: "symbol"
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
                        text: "\uf111",
                        style: "symbol"
                      },
                      {
                        text:
                          "อื่นๆ น็อกคาวบอย คอลัมนิสต์ไบโอฮันนีมูน อพาร์ตเมนท์ เยอบีร่าเซี้ยวหยวนยาวี วอล์คเบอร์เกอร์แอปเปิลโฟล์ค กรีนโปรดักชั่นแซ็กมั้ย \n",
                        style: "headerLeft"
                      },
                      {
                        text:
                          "สาเหตุการลดหนี้ แมชชีนลอจิสติกส์ ไฮเทคเซ็นทรัลครัวซองต์เพียว เวณิกาเฮอร์ริเคนคอนโทรลละอ่อนเกรด บิลแฟนตาซีเทคโนแครตอาข่า โมเต็ล ไวอะกร้าผู้นำแฟร์ซีเนียร์ เอ๊าะโอเปอเรเตอร์เฟอร์นิเจอร์เซาท์ ธุหร่ำโนติส โซลาร์ไตรมาสบุญคุณนายแบบ ไอเดียเฟอร์นิเจอร์กรุ๊ปพูลฮาราคีรี เกรย์สหัสวรรษ การันตี มาม่าดีลเลอร์โฮสเตสแกรนด์บูติก แอพพริคอทซัพพลายเออร์ฮาร์ดอีสเตอร์วาทกรรม มิวสิควืดอพาร์ทเมนท์อุปการคุณ คอร์ปอเรชั่น",
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
                          { text: "\uf111", style: "symbol" },
                          {
                            text: [
                              {
                                text: "ต้นทุนบริการ \n \t",
                                style: "headerRight"
                              },
                              { text: "\uf111", style: "symbol" },
                              {
                                text:
                                  " มีค่าใช้จ่ายเกิดขึ้นแล้ว จำนวน .......... บาท (ไม่รวม VAT) \n\t",
                                style: "headerRight"
                              },
                              {
                                text:
                                  " ค่าใช้จ่ายสำหรับบริการ .......... บาท (ไม่รวม VAT) \n",
                                style: "headerRight"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        text: [
                          {
                            text: " \n \uf111 ",
                            style: "symbol"
                          },
                          {
                            text: "ยังไม่มีค่าใช้จ่ายเกิดขึ้น \n",
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
                        text: "\uf111",
                        style: "symbol"
                      },
                      {
                        text:
                          "อื่นๆ น็อกคาวบอย คอลัมนิสต์ไบโอฮันนีมูน อพาร์ตเมนท์ เยอบีร่าเซี้ยวหยวนยาวี วอล์คเบอร์เกอร์แอปเปิลโฟล์ค กรีนโปรดักชั่นแซ็กมั้ย \n",
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
                        text: "\uf111",
                        style: "symbol"
                      },
                      {
                        text: " อนุมัติ \n",
                        style: "headerLeft"
                      },
                      {
                        text: "\uf111",
                        style: "symbol"
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
                        text: "\uf111",
                        style: "symbol"
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
                        text: "\uf111",
                        style: "symbol"
                      },
                      {
                        text: " อนุมัติ \n",
                        style: "headerLeft"
                      },
                      {
                        text: "\uf111",
                        style: "symbol"
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
                        text: "\uf111",
                        style: "symbol"
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

      dd.styles.symbol = { font: "FontAwesome", color: "#656565" };
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
      }
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
</style>
