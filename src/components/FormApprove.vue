<template>
  <v-app>
    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>ตารางอนุมัติการแจ้งหนี้</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
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
            <v-icon small class="mr-2" @click>mdi-check-outline</v-icon>
            <v-icon small @click>mdi-close-outline</v-icon>
          </td>
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
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="btn-approved"
              color="success"
              large
              dark
              v-on="on"
              @click="openApproveDialog(true)"
            >
              <v-icon left>mdi-check</v-icon>อนุมัติ
            </v-btn>
          </template>
          <span>อนุมัติ</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="btn-reject"
              color="error"
              large
              dark
              v-on="on"
              @click="openApproveDialog(false)"
            >
              <v-icon left>mdi-close</v-icon>ไม่อนุมัติ
            </v-btn>
          </template>
          <span>ไม่อนุมัติ</span>
        </v-tooltip>

        <infoForm1></infoForm1>
        <infoForm2></infoForm2>
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

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  }
};

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

        { text: "อนุมัติ", value: "name", sortable: false, align: "center" }
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
      btnApprove: ""
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
    openInfoDialog(item) {
      this.infoDialog = true;
      this.$store.commit("updateInvoiceInfo", item);
      console.log("infoClicked", this.invoice);
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
        console.log("invoice", this.invoice);
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
        console.log(result);
        this.closeInfoDialog();
        this.getAllInvoiceForm();
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
        console.log(result);
        let index = 1;
        result.data.forEach(form => {
          console.log("form", form);
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
    savePdf() {
      let exId = 62107;
      var dd = {
        content: [
          {
            text: "แบบฟอร์มขออนุมัติลดหนี้\n",
            style: "header"
          },
          {
            text: "ส่วนที่ 1 สำหรับผู้ออกเอกสาร\n",
            style: "subheader"
          },
          {
            text: `เลขที่ใบลดหนี้ 500001.....\n`,
            style: "invoiceNumber"
          },
          {
            text: `รหัสลูกค้า ....${exId}.... \t ชื่อลูกค้า ....แบงค์.... \t เลขที่ใบแจ้งหนี้/เลขที่ใบเสร็จรับเงิน ....500001....`,
            style: "text"
          },
          {
            text: `อ้างอิง S/O เลขที่ ${exId} \t จำนวนเงินตามใบแจ้งหนี้(ไม่รวมภาษีมูลค่าเพิ่ม) ${exId} บาท \n`,
            style: "text"
          },
          {
            text: `ขออนุมัติหนี้\n`,
            style: "middleSubHeader"
          },
          {
            text: `บริการที่ใช้งาน ............`,
            style: "text"
          },
          "สถาปัตย์แจ๊กเก็ตภควัทคีตา เซรามิกพลานุภาพ ซิมโฟนีโต๋เต๋แซ็กมั้ย ไฮกุเทียมทานเทรดซีเรียส ดัมพ์เดโมมิวสิคทีวี เตี๊ยมพาร์หมวยโบรชัวร์พงษ์ โดมิโน วิลเลจโมหจริตโดมิโนอัลมอนด์ไมเกรน โกะโทร แจ๊กเก็ตโอเวอร์กาญจน์ นิวลอร์ด เรซิ่นออร์เดอร์เชอร์รี่ม็อบคอร์ปอเรชั่น อิมพีเรียลบัลลาสต์ไอซียูโปรดิวเซอร์ตอกย้ำ พาวเวอร์คอนแท็คอีสเตอร์ ทอล์คนรีแพทย์อาข่าโหลยโท่ยแอโรบิค แรงผลักมือถือบริกรโต๊ะจีนอุด้ง",
          "ฟยอร์ดแฟลช การันตีเสือโคร่งเมคอัพ สปอต พ่อค้า ไกด์โพลารอยด์คอมเมนท์เสกสรรค์ สึนามิลีเมอร์ตุ๊ก อมาตยาธิปไตยเกรดเรซินชินบัญชรแชมพู ออเดอร์สติ๊กเกอร์สไตล์แชมพูจีดีพี วิดีโอไลน์ดีไซน์ พีเรียดไพลินอพาร์ทเมนต์ซีเรียส เวิร์ลด์วัจนะโลชั่น เพียวพาสเจอร์ไรส์เชฟผ้าห่มสวีท ไฮเวย์ เยนแชมเปญว่ะ คาเฟ่ดีมานด์จิ๊กฮวงจุ้ย โปรดักชั่นฮัม เอาต์รีพอร์ทสตรอเบอร์รีรีสอร์ต แซวจูเนียร์แลนด์ดิสเครดิต ฮาโลวีนคีตปฏิภาณเมี่ยงคำโอเวอร์ แพทเทิร์นจีดีพีฟลุทภควัมปติบาร์บี้ แกสโซฮอล์ล้มเหลว โต๋เต๋ฮาลาลโบกี้ โอวัลตินบูมตัวเองแฟรี่ เช็งเม้งยิมอันตรกิริยาโพลารอยด์ บู๊อิออน อุปนายิกาแชมเปี้ยน เอาท์รีทัชต่อรองสมาพันธ์ฟอร์ม แบล็กปาสกาลม้งโปรเจกต์ เทรดแอปเปิ้ลมินต์ แมชีนแฮมเบอร์เกอร์ทัวร์ ทับซ้อนเดบิตศิลปวัฒนธรรมไฮแจ็คแกงค์.",
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n",
          {
            text: "Subheader 2 - using subheader style",
            style: "subheader"
          },
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.",
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Confectum ponit legam, perferendis nomine miserum, animi. Moveat nesciunt triari naturam posset, eveniunt specie deorsus efficiat sermone instituendarum fuisse veniat, eademque mutat debeo. Delectet plerique protervi diogenem dixerit logikh levius probabo adipiscuntur afficitur, factis magistra inprobitatem aliquo andriam obiecta, religionis, imitarentur studiis quam, clamat intereant vulgo admonitionem operis iudex stabilitas vacillare scriptum nixam, reperiri inveniri maestitiam istius eaque dissentias idcirco gravis, refert suscipiet recte sapiens oportet ipsam terentianus, perpauca sedatio aliena video.\n\n",
          {
            text:
              "It is possible to apply multiple styles, by passing an array. This paragraph uses two styles: quote and small. When multiple styles are provided, they are evaluated in the specified order which is important in case they define the same properties",
            style: ["quote", "small"]
          }
        ],
        defaultStyle: {
          font: "THSarabunNew"
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: "center"
          },
          subheader: {
            fontSize: 15,
            bold: true
          },
          middleSubHeader: {
            fontSize: 15,
            bold: true,
            alignment: "center"
          },
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

      pdfMake.createPdf(dd).download();
      // const pdfDocGenerator = pdfMake.createPdf(dd);
      // pdfDocGenerator.getBase64(data => {
      //   alert(data);
      // });
    }
  },
  created() {
    var obj = JSON.parse(Decode.decode(this.$cookies.get("user")));
    console.log("jsonObj", obj);
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
>>> .v-btn__content {
  justify-content: left;
}
</style>
