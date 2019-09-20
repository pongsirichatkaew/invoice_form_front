<template>
  <div>
    <table class="ctd" style="width:100%">
      <tr class="f">
        <td colspan="2">
          <input class="m5" type="checkbox" disabled v-model="item.income" />
          กรณีเปลี่ยนแปลงรายได้
        </td>
        <td colspan="2">
          <input class="m5" type="checkbox" disabled v-model="item.notIncome" />
          กรณีไม่เปลี่ยนแปลงรายได้
        </td>
      </tr>
      <tr class="f">
        <td colspan="4">
          <input
            class="m5"
            style="margin-left:5%"
            type="checkbox"
            disabled
            v-model="item.invoiceFull"
          />
          ลดหนี้เต็มจำนวน {{item.invoiceFullAmount}}
        </td>
      </tr>
      <tr class="f">
        <td colspan="4" class="bright">
          <input
            class="m5"
            style="margin-left:5%"
            type="checkbox"
            disabled
            v-model="item.invoicePartial"
          />
          ลดหนี้บางส่วน {{item.invoicePartialAmount}}
        </td>
      </tr>
      <tr class="f">
        <td colspan="4">
          <input class="m5" type="checkbox" disabled v-model="item.otherIncome" />
          อื่นๆ {{item.invoiceOtherDescription}}
        </td>
      </tr>
      <tr class="f">
        <td class="p5" style="padding-bottom:10px" colspan="4">
          สาเหตุการลดหนี้ {{item.invoiceDescription}}
          <!-- <br />................................................................................................................................................................................................................................
          <br />................................................................................................................................................................................................................................-->
        </td>
      </tr>
      <tr class="fcenter">
        <td colspan="1" style="width:33%">ลงชื่อ .................................... ผู้จัดทำ</td>
        <td colspan="1" style="width:33%">ลงชื่อ .................................... หัวหน้าฝ่าย</td>
        <td colspan="2" class="sign">ลงชื่อ ....................................... หัวหน้ากลุ่มงาน</td>
      </tr>
      <tr class="fcenter">
        <td colspan="1" class="sign">( {{item.employee.thainame}} {{item.employee.thlastname}})</td>
        <td
          class="sign"
          colspan="1"
          style="width:33%"
        >(&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;)</td>
        <td
          class="sign"
          colspan="2"
        >(&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;)</td>
      </tr>
      <tr class="fcenter">
        <td
          class="sign"
          colspan="1"
          style="width:33%"
        >วันที่ .....................................................</td>
        <td
          class="sign"
          colspan="1"
          style="width:33%"
        >วันที่ .....................................................</td>
        <td colspan="2" class="sign">วันที่ .....................................................</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { Decode } from "../services/";

export default {
  data() {
    return {
      item: {}
    };
  },
  computed: {},
  created() {
    this.item = this.$cookies.get("item");
    if (this.item === null) {
      console.log("itemnull");
      this.item = JSON.parse(
        JSON.parse(Decode.decode(localStorage.getItem("item")))
      );
    }
    if (this.item.notIncome || this.item.otherIncome) {
      this.item.invoiceFull = false;
    }
    console.log("item", this.item);
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

.sign {
  width: 33%;
  padding-right: 5px;
}

.m5 {
  margin-left: 5px;
  margin-top: 5px;
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