<template>
  <div>
    <table class="ctd" style="width:100%">
      <tr>
        <th
          class="p5"
          colspan="4"
          style="background-color:#BDBDBD;text-align:left;"
        >ส่วนที่ 4 สำหรับฝ่ายบริหาร(กรณีเปลี่ยนแปลงรายได้)</th>
      </tr>
      <td colspan="1" class="btop bleft">
        <p class="fcenter">ความคิดเห็นฝ่ายบริหาร</p>
        <tr class="f">
          <td>
            <input class="m5" type="checkbox" disabled/>
            อนุมัติ
          </td>
          <td>......................................................................</td>
        </tr>
        <tr class="f">
          <td>
            <input class="m5" type="checkbox" disabled />
            ขอเอกสารเพิ่มเติมเรื่อง
          </td>
          <td>......................................................................</td>
        </tr>
        <tr class="f">
          <td style="padding-bottom:10px">
            <input class="m5" type="checkbox" disabled />
            ไม่อนุมัติเนื่องจาก
          </td>
          <td>......................................................................</td>
        </tr>
        <tr class="fcenter">
          <td class="p5" colspan="2">ลงชื่อ .................................... รองกรรมการผู้จัดการ</td>
        </tr>
        <tr class="fcenter">
          <td
            class="p5"
            colspan="2"
          >(นายวัลล์ชัย เวชชีวะดำรงค์)</td>
        </tr>
        <tr class="fcenter">
          <td class="p5" colspan="2">วันที่ .....................................................</td>
        </tr>
      </td>
      <td class="bright"></td>
      <td colspan="1" class="btop bleft">
        <p class="fcenter">ความคิดเห็นฝ่ายบริหาร</p>
        <tr class="f">
          <td>
            <input class="m5" type="checkbox" disabled />
            อนุมัติ
          </td>
          <td>......................................................................</td>
        </tr>
        <tr class="f">
          <td>
            <input class="m5" type="checkbox" disabled />
            ขอเอกสารเพิ่มเติมเรื่อง
          </td>
          <td>......................................................................</td>
        </tr>
        <tr class="f">
          <td style="padding-bottom:10px">
            <input class="m5" type="checkbox" disabled />
            ไม่อนุมัติเนื่องจาก
          </td>
          <td>......................................................................</td>
        </tr>
        <tr class="fcenter">
          <td class="p5" colspan="2">ลงชื่อ .................................... กรรมการผู้จัดการ</td>
        </tr>
        <tr class="fcenter">
          <td
            class="p5"
            colspan="2"
          >(นางมรกต กุลธรรมโยธิน)</td>
        </tr>
        <tr class="fcenter">
          <td class="p5" colspan="2">วันที่ .....................................................</td>
        </tr>
      </td>
      <td class="bright"></td>
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