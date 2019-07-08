<template>
  <v-app>
    <v-card-text>
      <v-toolbar flat color="white">
        <v-toolbar-title>FormApproved</v-toolbar-title>
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
import Form1 from "./Form1";
import Form2 from "./Form2";

import Form1Info from "./Form1Info";
import Form2Info from "./Form2Info";
import InfoForm from "./InfoForm";
import { mapState } from "vuex";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

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

  watch: {}
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
