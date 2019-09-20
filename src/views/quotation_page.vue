<template>
  <div>
    <div class="page">
      <form-part-one></form-part-one>

      <table
        class="bright bleft bbot"
        style="width:100%"
        v-for="(prop,index) in firstdata"
        :key="index"
      >
        <tr class="f">
          <td colspan="2" class="p5">เลขที่ใบแจ้งหนี้ {{prop.invoiceSlip}}</td>
        </tr>
        <tr class="f">
          <td colspan="1" class="p5">อ้างอิง S/O เลขที่ {{prop.soNumber}}</td>
          <td colspan="1" style="width:50%">จำนวนเงิน {{prop.invoiceAmount}}</td>
        </tr>
        <tr class="f">
          <td colspan="2" class="p5">
            บริการที่ใช้งาน {{prop.service}}
            <br />
          </td>
        </tr>

        <tr class="f">
          <td colspan="2" class="p5">
            ตั้งแต่รอบบริการ {{prop.from_date}}
            ถึงวันที่ {{prop.to_date}}
          </td>
        </tr>
      </table>
      <form-part-five v-if="firstdata.length<=8"></form-part-five>

      <form-part-two v-if="firstdata.length<=6"></form-part-two>
      <form-part-three v-if="firstdata.length<=4"></form-part-three>
      <form-part-four v-if="firstdata.length<=2"></form-part-four>
    </div>

    <div>
      <div
        v-if="(firstdata.length>8||firstdata.length>6 || firstdata.length>4 ||firstdata.length>2)&&myPage==0"
        class="page"
      >
        <form-part-five v-if="firstdata.length>8"></form-part-five>

        <form-part-two v-if="firstdata.length>6 "></form-part-two>
        <form-part-three v-if="firstdata.length>4 "></form-part-three>
        <form-part-four v-if="firstdata.length>2 "></form-part-four>
      </div>
    </div>
    <div>
      <div class="page" v-for="page in Math.ceil(middledata.length / itemperpage)" :key="page">
        <table
          class="bright bleft btop bbot"
          style="width:100%"
          v-for="(prop,index) in pagearray(page, middledata)"
          :key="index"
        >
          <tr class="f btop">
            <td colspan="2">เลขที่ใบแจ้งหนี้{{prop.index}} {{prop.invoiceNumber}}</td>
          </tr>
          <tr class="f">
            <td colspan="1">อ้างอิง S/O เลขที่ {{prop.SO}}</td>
            <td colspan="1" style="width:50%">จำนวนเงิน {{prop.amount}}</td>
          </tr>
          <tr class="f">
            <td colspan="1" class="btop">
              บริการ {{prop.service}}
              <br />
            </td>
            <td colspan="1" class="btop bleft">
              ตั้งแต่เริ่ม {{prop.date1}}
              <br />
              ถึงวันที่ {{prop.date2}}
            </td>
          </tr>
        </table>
        
        <form-part-five v-if="formPartFive&&page===myPage"></form-part-five>

        <form-part-two v-if="formPartTwo&&page===myPage"></form-part-two>
        <form-part-three v-if="formPartThree&&page===myPage"></form-part-three>
        <form-part-four v-if="formPartFour&&page===myPage"></form-part-four>
      </div>
    </div>
    <div>
      <div
        v-if="(!formPartFive||!formPartTwo || !formPartThree || !formPartFour) && myPage>0"
        class="page"
      >
        <form-part-five v-if="!formPartFive"></form-part-five>

        <form-part-two v-if="!formPartTwo"></form-part-two>
        <form-part-three v-if="!formPartThree"></form-part-three>
        <form-part-four v-if="!formPartFour"></form-part-four>
      </div>
    </div>
  </div>
</template>

<script>
import { Decode } from "../services";
import FormPartOne from "../components/FormPartOne.vue";
import FormPartFive from "../components/FormPartFive.vue";
import FormPartTwo from "../components/FormPartTwo.vue";
import FormPartThree from "../components/FormPartThree.vue";
import FormPartFour from "../components/FormPartFour.vue";
export default {
  components: {
    FormPartOne,
    FormPartTwo,
    FormPartThree,
    FormPartFour,
    FormPartFive
  },
  data() {
    return {
      itemperpage: 13,
      prop: {
        invoiceNumber: "1",
        SO: "2",
        amount: "3",
        service: "4",
        date1: "5",
        date2: "6"
      },
      props: [],
      count: 0,
      myPage: 0,
      formPartTwo: false,
      formPartThree: false,
      formPartFour: false,
      formPartFive: false,

      volume: 1,
      item: {}
    };
  },
  methods: {
    pagearray(page, array) {
      let pagearr = [];
      let startitemindex = page * this.itemperpage - this.itemperpage;
      for (let index = 0; index < this.itemperpage; index++) {
        pagearr.push(array[startitemindex + index]);
      }
      console.log(page, pagearr);
      return pagearr.filter(v => !!v);
    }
  },
  computed: {
    firstdata() {
      var dataItem = {};
      dataItem = this.props.filter((item, index) => {
        if (index <= 8) {
          return item;
        }
      });

      return dataItem;
    },
    middledata() {
      var midData = [];
      midData = this.props.filter((item, index) => {
        if (index > 8) {
          return item;
        }
      });
      return midData;
    }
  },
  watch: {
    middledata(value) {
      console.log("value", this.itemperpage - (value.length % 13));
      this.myPage = Math.ceil(this.middledata.length / this.itemperpage);

      console.log("page", this.myPage);
      let modulusPage = this.itemperpage - (value.length % 13); // 13-12 =13
      console.log("modu2", modulusPage);
      if (modulusPage >= 2 && modulusPage <= 12) {
        this.formPartFive = true;
        modulusPage = modulusPage - 2;
        if (modulusPage >= 2 && modulusPage <= 12) {
          this.formPartTwo = true;
          modulusPage = modulusPage - 2;
          console.log("modu3", modulusPage);
          if (modulusPage >= 2) {
            this.formPartThree = true;
            modulusPage = modulusPage - 2;
            console.log("modu4", modulusPage);

            if (modulusPage >= 2) {
              this.formPartFour = true;
            }
          }
        }
      }
    }
  },
  created() {
    var moment = require("moment");

    this.item = this.$cookies.get("item");
    if (this.item === null) {
      console.log('itemnull')
      this.item = JSON.parse(
        JSON.parse(Decode.decode(localStorage.getItem("item")))
      );
    }
    console.log("item", this.item);
    this.props = this.item.invoice;
    this.props.forEach(prop => {
      var from_date = moment(prop.from_date).locale("th");
      var to_date = moment(prop.to_date).locale("th");
      prop.from_date = from_date.format("LL");
      prop.to_date = to_date.format("LL");
    });
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Sarabun&display=swap");

* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.ctd {
  border: 1px solid black;
  border-collapse: collapse;
}
.page {
  width: 21cm;
  height: 29.7cm;
  padding: 1cm;
  margin: 1cm auto;
  border: 1px #d3d3d3 solid;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.p5 {
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 5px;
}

.f {
  font-size: 12px;
}

.fcenter {
  text-align: center;
  font-size: 12px;
}

.ball {
  border: 1px solid black;
  border-collapse: collapse;
}

.btop {
  border-top: 1px solid black;
  border-collapse: collapse;
}

#bbot,
.bbot {
  border-bottom: 1px solid black;
  border-collapse: collapse;
}

.bleft {
  border-left: 1px solid black;
  border-collapse: collapse;
}

.bright {
  border-right: 1px solid black;
  border-collapse: collapse;
}

@page {
  size: A4;
  margin: 0;
}
@media print {
  .page {
    margin: 0;
    box-shadow: 0;
  }
  * {
    -webkit-print-color-adjust: exact;
  }
}

#html-2-pdfwrapper {
  position: absolute;
  left: 20px;
  top: 50px;
  bottom: 0;
  overflow: auto;
  width: 600px;
}

.header {
  font-family: "Sarabun";
  font-size: 14px;
  font-weight: bold;
  line-height: 1.2;
}
</style>
