<template>
  <div>
    <p style="text-align:center;font-weight:bold;">แบบฟอร์มขอนุมัติลดหนี้</p>
    <table class="ctd" style="width:100%">
      <tr class="ctd">
        <th
          class="ctd p5"
          colspan="4"
          style="background-color:#BDBDBD;text-align:left;"
        >ส่วนที่ 1 ข้อมูลของลูกค้า</th>
      </tr>
      <tr class="f">
        <td colspan="3"></td>
        <td
          class="bright p5"
          style="text-align:right;padding-right:5px"
        >เลขที่่เอกสาร {{item.invoiceDoc}}</td>
      </tr>
      <tr class="f">
        <td colspan="3"></td>
        <td
          class="bright p5"
          style="text-align:right;padding-right:5px"
        >เลขที่ใบลดหนี้ {{item.invoiceNumber}}</td>
      </tr>
      <tr class="f">
        <td colspan="2" class="p5">รหัสลูกค้า {{item.customerId}}</td>
        <td colspan="2" style="width:50%;">ชื่อลูกค้า {{item.customerName}}</td>
        <td></td>
      </tr>
      <tr>
        <th
          class="ctd p5"
          colspan="4"
          style="text-align:center;background-color:#BDBDBD"
        >ฟอร์มขออนุมัติลดหนี้</th>
      </tr>
    </table>
  </div>
</template>

<script>
import { Decode } from "../services";

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