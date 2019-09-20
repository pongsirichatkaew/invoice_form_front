<template>
  <div>
    <table class="ctd" style="width:100%">
      <tr>
        <th
          class="p5"
          colspan="4"
          style="background-color:#BDBDBD;text-align:left;"
        >ส่วนที่ 2 สำหรับฝ่ายบริหารต้นทุน(ตรวจสอบต้นทุนที่เกิดขึ้นของบริการที่ขอลดหนี้)</th>
      </tr>
      <tr class="f">
        <td colspan="4">
          <input class="m5" type="checkbox" disabled />
          ต้นทุนบริการ
        </td>
      </tr>
      <tr class="f">
        <td colspan="2">
          <input class="m5" style="margin-left:5%" type="checkbox" disabled />
          มีค่าใช้จ่ายเกิดขึ้นแล้ว .................... บาท (ไม่รวม VAT)
          <br />
          <p
            class="p5"
            style="margin-left:5%"
          >ค่าใช้จ่ายสำหรับบริการ ..............................................</p>
        </td>
        <td colspan="1" style="width:50%">
          <input type="checkbox" disabled />
          ยังไม่มีค่าใช้จ่ายเกิดขึ้น .................... บาท (ไม่รวม VAT)
          <br />
          <p
            class="p5"
          >เนื่องจาก .....................................................................</p>
        </td>
        <td class="bright"></td>
      </tr>

      <tr class="f">
        <td colspan="4" style="padding-bottom:10px">
          <input class="m5" type="checkbox" disabled />
          อื่นๆ ..................................................................................................................................................................................................................
        </td>
      </tr>

      <tr class="fcenter">
        <td class="sign" colspan="2">ลงชื่อ ................................... ผู้ตรวจสอบข้อมูล</td>
        <td
          class="sign"
          colspan="2"
          style="width:33%"
        >ลงชื่อ ................................... หัวหน้าฝ่าย</td>
      </tr>
      <tr class="fcenter">
        <td
          class="sign"
          colspan="2"
          style="width:50%"
        >(&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;)</td>
        <td
          class="sign"
          colspan="2"
          style="width:50%"
        >(&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;)</td>
      </tr>
      <tr class="fcenter">
        <td
          class="sign"
          colspan="2"
          style="width:50%"
        >วันที่ .....................................................</td>
        <td
          class="sign"
          colspan="2"
          style="width:50%"
        >วันที่ .....................................................</td>
      </tr>
    </table>
  </div>
</template>

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
.m5 {
  margin-left: 5px;
  margin-top: 5px;
}
.p5 {
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 5px;
}
.sign {
  width: 33%;
  padding-right: 5px;
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