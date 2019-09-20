<template>
  <div>
    <!-- <v-btn color="success" round @click="downloadPDF">
        <v-icon left>save_alt</v-icon> ดาวน์โหลดไฟล์เอกสาร PDF
      </v-btn>
      <v-btn color="warning" round @click="gen2pdfwrap">
        Gen PDF 2 wrapper
    </v-btn>-->
    <!-- test PDF wrapper -->
    <!-- <div id="html-2-pdfwrapper">
        <QuotationTitle/>
        <QuotationHeader/>

    </div>-->

    <!-- Quatation Page -->
    <v-btn
      color="green darken-1"
      dark
      absolute
      bottom
      right
      fixed
      fab
      style="margin-bottom: 65px;"
      @click="printpo"
      v-if="printvisible"
    >
      <v-icon>print</v-icon>
    </v-btn>
    <div ref="quotation_content">
      <div class="page">
        <div v-if="orderType === 'quotation'">
          <QuotationTitle />
        </div>
        <div v-else-if="orderType === 'purchase'">
          <QuotationTitlePurchase />
        </div>

        <QuotationHeader />
        <table class="mt-2">
          <tr bgcolor="#66BB6A">
            <th class="header" style="width:45%">รายการสินค้า</th>
            <th class="header">
              ราคาสินค้า
              <br />(รวมภาษี)
            </th>
            <th class="header">
              ราคาสินค้า
              <br />(ไม่รวมภาษี)
            </th>
            <th class="header">ส่วนลด %</th>
            <th class="header">
              ส่วนลด
              <br />(บาท)
            </th>
            <th class="header">จำนวน</th>
            <th class="header">
              ราคาหักส่วนลด
              <br />(ไม่รวมภาษี)
            </th>
            <th class="header">ราคาสุทธิ</th>
          </tr>
          <tr v-for="(item, index) in firstdata.data" :key="index">
            <td
              class="content"
              style="padding: 7px; padding-top: 20px; padding-bottom: 20px; line-height: 200%;"
            >
              <!-- <div class="setcenter centerdiv"> -->
              <img contain xheight="40px" class="itemset" :src="item.image" />
              <!-- </div> -->
              <br />
              <b class="content">{{ item.name }}</b>
              <br />
              รหัสสินค้า : {{ item.sku }}
              <br />
              <!-- <v-layout align-center justify-center row fill-height>
                  <v-img contain max-width="17" :src="require('@/assets/correct.png')"/>
                  <span class="content" style="color:#43A047">สินค้าพร้อมส่ง</span>
                  <v-spacer></v-spacer>
              </v-layout>-->
            </td>
            <td class="content" align="center">{{ item.price_vat }}</td>
            <td class="content" align="center">{{ item.price_no_vat}}</td>
            <td class="content" align="center">{{ item.discount_percent}}</td>
            <td class="content" align="center">{{ item.discount}}</td>
            <td class="content" align="center">{{ item.quantity}}</td>
            <td class="content" align="center">{{ item.price_no_vat_discount}}</td>
            <td class="content" align="center">{{ item.net_price}}</td>
          </tr>
          <tr v-if="firstdata.count === true">
            <td
              class="noborderBottom footer"
              align="left"
              style="padding: 7px; padding-top: 5px; padding-bottom:5px; "
            >
              หมายเหตุ (Remarks)
              <br />
              <br />
            </td>
            <td class="content" colspan="5" align="left" style="padding: 7px;">
              <span class="content">ราคาสินค้ายกเว้นภาษี (Excluding vat)</span>
              <br />
              <span class="content">จำนวนภาษีมูลค่าเพิ่ม (Value Added Tax) 7%</span>
              <br />
              <span class="content">ค่าขนส่ง (Delivery Charge)</span>
              <br />
            </td>
            <td class="content" colspan="2" align="right" style="padding: 7px;">
              <span class="content">{{ cartdata.total_price }}</span>
              <br />
              <span class="content">{{ cartdata.vat_cost }}</span>
              <br />
              <span class="content">{{ cartdata.total_shipping }}</span>
              <br />
            </td>
          </tr>
          <tr v-if="firstdata.count === true">
            <td class="content" colspan="6" align="left" style="padding: 7px;">
              <v-layout row wrap>
                <v-flex xs6>
                  <span class="content">จำนวนเงินรวมทั้งสิ้น (Grand Total)</span>
                </v-flex>
                <v-flex xs6 class="text-xs-right">
                  <span class="content">{{sumTotalsText}}</span>
                </v-flex>
              </v-layout>
            </td>
            <td class="content" colspan="2" align="right" style="padding: 7px;">
              <span class="content">{{ cartdata.net_price }}</span>
              <br />
            </td>
          </tr>
        </table>
        <br />
        <QuotationFooter v-if="firstdata.count === true" />
      </div>
      <div v-if="firstdata.count===false">
        <div
          class="page"
          v-for="page in Math.ceil(middledata.data.length / itemperpage)"
          :key="page"
        >
          <table>
            <tr bgcolor="#66BB6A">
              <th class="header" style="width:45%">รายการสินค้า</th>
              <th class="header">
                ราคาสินค้า
                <br />(รวมภาษี)
              </th>
              <th class="header">
                ราคาสินค้า
                <br />(ไม่รวมภาษี)
              </th>
              <th class="header">ส่วนลด %</th>
              <th class="header">
                ส่วนลด
                <br />(บาท)
              </th>
              <th class="header">จำนวน</th>
              <th class="header">
                ราคาหักส่วนลด
                <br />(ไม่รวมภาษี)
              </th>
              <th class="header">ราคาสุทธิ</th>
            </tr>
            <tr v-for="(item, index) in pagearray(page, middledata.data)" :key="index">
              <td
                class="content"
                style="padding: 7px; padding-top: 20px; padding-bottom: 20px; line-height: 200%;"
              >
                <img contain xheight="40px" class="itemset" :src="item.image" />
                <br />
                <b class="content">{{ item.name }}</b>
                <br />
                รหัสสินค้า : {{ item.sku }}
                <br />
              </td>
              <td class="content" align="center">{{ item.price_vat }}</td>
              <td class="content" align="center">{{ item.price_no_vat}}</td>
              <td class="content" align="center">{{ item.discount_percent}}</td>
              <td class="content" align="center">{{ item.discount}}</td>
              <td class="content" align="center">{{ item.quantity}}</td>
              <td class="content" align="center">{{ item.price_no_vat_discount}}</td>
              <td class="content" align="center">{{ item.net_price}}</td>
            </tr>
            <tr
              v-if="(middledata.count === true && Math.ceil(middledata.data.length / itemperpage) == page)"
            >
              <td
                class="noborderBottom footer"
                align="left"
                style="padding: 7px; padding-top: 5px; padding-bottom:5px; "
              >
                หมายเหตุ (Remarks)
                <br />
                <br />
              </td>
              <td class="content" colspan="5" align="left" style="padding: 7px;">
                <span class="content">ราคาสินค้ายกเว้นภาษี (Excluding vat)</span>
                <br />
                <span class="content">จำนวนภาษีมูลค่าเพิ่ม (Value Added Tax) 7%</span>
                <br />
                <span class="content">ค่าขนส่ง (Delivery Charge)</span>
                <br />
              </td>
              <td class="content" colspan="2" align="right" style="padding: 7px;">
                <span class="content">{{ cartdata.total_price }}</span>
                <br />
                <span class="content">{{ cartdata.vat_cost }}</span>
                <br />
                <span class="content">{{ cartdata.total_shipping }}</span>
                <br />
              </td>
            </tr>
            <tr
              v-if="(middledata.count === true && Math.ceil(middledata.data.length / itemperpage) == page)"
            >
              <td class="content" colspan="6" align="left" style="padding: 7px;">
                <v-layout row wrap>
                  <v-flex xs6>
                    <span class="content">จำนวนเงินรวมทั้งสิ้น (Grand Total)</span>
                  </v-flex>
                  <v-flex xs6 class="text-xs-right">
                    <span class="content">{{sumTotalsText}}</span>
                  </v-flex>
                </v-layout>
              </td>
              <td class="content" colspan="2" align="right" style="padding: 7px;">
                <span class="content">{{ cartdata.net_price }}</span>
                <br />
              </td>
            </tr>
          </table>
          <br />
          <QuotationFooter
            v-if="(middledata.count === true && Math.ceil(middledata.data.length / itemperpage) == page)"
          />
        </div>
      </div>
      <div class="page" v-if="checkStatus === true">
        <div v-if="firstdata.count === false">
          <table v-if="middledata.count === false">
            <tr>
              <td
                class="noborderBottom footer"
                align="left"
                style="padding: 7px; padding-top: 5px; padding-bottom:5px; width:45%"
              >
                หมายเหตุ (Remarks)
                <br />
                <br />
              </td>
              <td class="content2" colspan="5" align="left" style="padding: 7px;width:38%">
                <span class="content2">ราคาสินค้ายกเว้นภาษี (Excluding vat)</span>
                <br />
                <span class="content2">จำนวนภาษีมูลค่าเพิ่ม (Value Added Tax) 7%</span>
                <br />
                <span class="content2">ค่าขนส่ง (Delivery Charge)</span>
                <br />
              </td>
              <td class="content2" colspan="2" align="right" style="padding: 7px;">
                <span class="content2">{{ cartdata.total_price }}</span>
                <br />
                <span class="content2">{{ cartdata.vat_cost }}</span>
                <br />
                <span class="content2">{{ cartdata.total_shipping }}</span>
                <br />
              </td>
            </tr>
            <tr v-if="middledata.count === false">
              <td class="content" colspan="6" align="left" style="padding: 7px;">
                <v-layout row wrap>
                  <v-flex xs6>
                    <span class="content">จำนวนเงินรวมทั้งสิ้น (Grand Total)</span>
                  </v-flex>
                  <v-flex xs6 class="text-xs-right">
                    <span class="content">{{sumTotalsText}}</span>
                  </v-flex>
                </v-layout>
              </td>
              <td class="content" colspan="2" align="right" style="padding: 7px;">
                <span class="content">{{ cartdata.net_price }}</span>
                <br />
              </td>
            </tr>
          </table>
          <br />
          <QuotationFooter v-if="middledata.count === false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JSPDF from "jspdf";
import html2canvas from "html2canvas";
import QuotationTitle from "../components/Quotation/QuotationTitle";
import QuotationTitlePurchase from "../components/Quotation/QuotationTitle_purchase";
import QuotationHeader from "../components/Quotation/QuotationHeader";
import QuotationFooter from "../components/Quotation/QuotationFooter";
import QuotationBody from "../components/Quotation/QuotationBody";
import { Decode } from "@/services";
export default {
  data() {
    return {
      checkStatus: false,
      amount: 1,
      totals: 0,
      totalsNoVat: 0,
      totalsAmount: 0,
      base64Img: null,
      margins: {
        top: 70,
        bottom: 40,
        left: 30,
        width: 550
      },
      itemperpage: 7,
      itempagelenght: 0,
      printvisible: true,
      address_detail: null
      // itemsCart: [
      //   {
      //     sku: 'ABC10001',
      //     name: 'โต๊ะไม้ยาวสีน้ำตาลอ่อน',
      //     image: '/static/img/itemtest2.jpg',
      //     price_vat: '1500.00',
      //     price_no_vat: '1395.42',
      //     discount_percent: '0',
      //     discount: '0.00',
      //     quantity: 1,
      //     price_no_vat_discount: '1395.42',
      //     net_price: '1310.01'
      //   }
      // ]
    };
  },
  components: {
    QuotationTitle,
    QuotationTitlePurchase,
    QuotationHeader,
    QuotationFooter,
    QuotationBody
  },
  methods: {
    printpo() {
      setTimeout(() => {
        window.print();
      }, 500);
      this.printvisible = false;
      setTimeout(() => {
        this.printvisible = true;
      }, 2000);
    },
    downloadPDF() {
      const Doc = new JSPDF();
      var canvasElement = document.createElement("canvas");
      html2canvas(this.$refs.quotation_content, { canvas: canvasElement }).then(
        function(canvas) {
          const img = canvas.toDataURL("image/png");
          Doc.addImage(img, "JPEG", 10, 10);
          Doc.save("quotation_001.pdf");
        }
      );
    },
    gen2pdfwrap() {
      let pages = document.getElementsByClassName("page");
      const Doc = new JSPDF("p", "pt", "a4");
      for (let index = 0; index < pages.length; index++) {
        // console.log(pages[index].offsetHeight)
        // console.log(pages[index].offsetWidth)
        var canvasElement = document.createElement("canvas");
        html2canvas(pages[index], { canvas: canvasElement }).then(function(
          canvas
        ) {
          const img = canvas.toDataURL("image/png");
          Doc.addPage(pages[index].offsetWidth, pages[index].offsetHeight);
          Doc.addImage(img, "PNG", 10, 10);
        });
      }
      // pages.forEach(page => {
      //   console.log(page.offsetHeight)
      //   console.log(page.offsetWidth)
      //   var canvasElement = document.createElement('canvas')
      //   html2canvas(page, { canvas: canvasElement }).then(function (canvas) {
      //     const img = canvas.toDataURL('image/png')
      //     Doc.addPage(page.offsetWidth, page.offsetHeight)
      //     Doc.addImage(img, 'PNG', 10, 10)
      //   })
      // })
      setTimeout(() => {
        Doc.save("quotation_001.pdf");
      }, 2000);

      // var pdf = new JSPDF('p', 'pt', 'a4')
      // pdf.setFontSize(18)
      // pdf.fromHTML(document.getElementById('html-2-pdfwrapper'), 30, 70, { width: 550 }, 40)
      // var iframe = document.createElement('iframe')
      // iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:650px; padding:20px;')
      // document.body.appendChild(iframe)
      // iframe.src = pdf.output('datauristring')
    },
    pagearray(page, array) {
      let pagearr = [];
      let startitemindex = page * this.itemperpage - this.itemperpage;
      for (let index = 0; index < this.itemperpage; index++) {
        pagearr.push(array[startitemindex + index]);
      }
      return pagearr.filter(v => !!v);
    },
    addCommas(nStr) {
      nStr += "";
      var x = nStr.split(".");
      var x1 = x[0];
      var x2 = x.length > 1 ? "." + x[1] : "";
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
      }
      return x1 + x2;
    },
    getAddressBillTo() {
      var auth = {
        headers: {
          Authorization: this.myInfo.token_type + " " + this.myInfo.access_token
        }
      };
      var data = {
        address_id: this.bill_to
      };
      this.axios
        .post(process.env.API + "/address_detail", data, auth)
        .then(response => {
          this.address_detail = response.data.data;
          // console.log('AddressBIlllllllllll', this.address_bill)
          // this.getApprove()
        });
    },
    getAddressShipTo() {
      var auth = {
        headers: {
          Authorization: this.myInfo.token_type + " " + this.myInfo.access_token
        }
      };
      var data = {
        address_id: this.ship_to
      };
      this.axios
        .post(process.env.API + "/address_detail", data, auth)
        .then(response => {
          this.address_ship = response.data.data;
          // console.log('AddressShipppppppppp', this.address_ship)
          // this.getApprove()
        });
    }
  },
  computed: {
    firstdata() {
      var dataItem = {};
      dataItem.data = this.itemsCart.filter((item, index) => index <= 2);
      if (this.itemsCart.length === 3 || this.itemsCart.length === 2) {
        dataItem.count = false;
        this.checkStatus = true;
      }
      if (this.itemsCart.length === 1) {
        // if (this.itemsCart.length === 1) {
        dataItem.count = true;
      } else {
        dataItem.count = false;
      }
      // console.log('234567890', dataItem)
      return dataItem;
    },
    middledata() {
      var midData = {};
      midData.data = this.itemsCart.filter(
        (item, index) => index !== 0 && index !== 1 && index !== 2
      );
      if (this.itemsCart.length - 3 === 0 || this.itemsCart.length - 2 === 0) {
        this.checkStatus = true;
        midData.count = false;
      } else if ((this.itemsCart.length - 3) % 8 < 7) {
        midData.count = true;
      } else {
        midData.count = false;
        this.checkStatus = true;
      }
      // console.log('8888888888888', midData)
      return midData;
    },
    sumTotals() {
      for (var i = 0; i < this.itemsCart.length; i++) {
        this.totals = this.totals + parseFloat(this.itemsCart[i].net_price);
      }
      this.totals = this.totals.toFixed(2);
      this.totals = this.addCommas(this.totals);
      return this.totals;
    },
    sumTotalsNoVat() {
      for (var i = 0; i < this.itemsCart.length; i++) {
        this.totalsNoVat =
          this.totalsNoVat +
          parseFloat(this.itemsCart[i].price_no_vat_discount);
        // console.log(this.totalsNoVat)
      }
      // console.log(this.totalsNoVat)
      return this.totalsNoVat;
    },
    sumAmount() {
      this.totalsAmount = 0;
      for (var i = 0; i < this.itemsCart.length; i++) {
        this.totalsAmount =
          this.totalsAmount + parseInt(this.itemsCart[i].quantity);
      }
      return this.totalsAmounteqr;
    },
    sumTotalsText() {
      // console.log('เข้าฟังก์ชัน')
      var strTotals = this.cartdata.net_price.toString().split(".");
      let integer = strTotals[0].replace(",", "");
      let float = strTotals[1];
      var level = ["บาท", "", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
      var ones = [
        "",
        "หนึ่ง",
        "สอง",
        "สาม",
        "สี่",
        "ห้า",
        "หก",
        "เจ็ด",
        "แปด",
        "เก้า"
      ];
      var tens = [
        "",
        "สิบ",
        "ยี่สิบ",
        "สามสิบ",
        "สี่สิบ",
        "ห้าสิบ",
        "หกสิบ",
        "เจ็ดสิบ",
        "แปดสิบ",
        "เก้าสิบ"
      ];
      var textTotals = "";
      let intarr = [...integer].reverse();
      intarr.forEach((number, index) => {
        switch (index) {
          case 0:
            if (Number(number) === 1) {
              textTotals = "เอ็ด" + textTotals;
            } else {
              textTotals = ones[Number(number)] + textTotals;
            }
            break;
          case 1:
            textTotals = tens[Number(number)] + textTotals;
            break;
          default:
            textTotals = ones[Number(number)] + level[index] + textTotals;
            break;
        }
      });
      if (float !== "00") {
        textTotals = textTotals + "บาท";
        let floatarr = [...float].reverse();
        let temptext = "";
        let temptextOne = "";
        floatarr.forEach((number, index) => {
          switch (index) {
            case 0:
              temptextOne = ones[Number(number)];
              break;
            case 1:
              if (Number(number) === 1) {
                temptextOne = "เอ็ด";
                temptext = temptext + temptextOne;
              } else {
                temptext = temptext + temptextOne;
              }
              temptext = tens[Number(number)] + temptext;
              break;
            default:
              temptext = ones[Number(number)] + level[index] + temptext;
              break;
          }
        });
        textTotals = textTotals + temptext + "สตางค์";
      } else {
        textTotals = textTotals + "บาทถ้วน";
      }
      return textTotals;
    },
    orderType() {
      return localStorage.typeOrder;
    },
    itemsCart() {
      // console.log('JSON.parse(localStorage.cartdata).item_list', JSON.parse(localStorage.cartdata).item_list)
      return JSON.parse(localStorage.cartdata).item_list;
    },
    purchaser_detail() {
      return JSON.parse(localStorage.purchaser_detail);
    },
    // address_detail () {
    //   return JSON.parse(localStorage.address_detail)
    // },
    cartdata() {
      // console.log('cartData', JSON.parse(localStorage.cartdata))
      return JSON.parse(localStorage.cartdata);
    }
  },
  mounted() {
    // setTimeout(() => {
    //   window.print()
    // }, 2000)
    // console.log(this.purchaser_detail)
    // console.log(this.address_detail)
    // console.log(this.itemsCart)
    // console.log(this.$cookies.get('dataUser'))
  },
  created() {
    var getData = JSON.parse(
      JSON.parse(Decode.decode(localStorage.getItem("cost_center")))
    );
    this.cost_center_id = getData.cost_center_id;
    this.index = getData.index;
    // console.log('-------------->', this.$refs)
    // console.log('-------<>>>>>>>', this.cartdata.net_price.toString().split('.'))
    // console.log(this.index)
    // if (this.$cookies.isKey('eproInfo')) {
    //   this.myInfo = JSON.parse(JSON.parse(Decode.decode(this.$cookies.get('eproInfo'))))
    //   // this.getPurchaserInfo()
    //   // this.getPurchaserInfos()
    // } else {
    //   this.myInfo = ''
    //   window.location = process.env.WEB_CENTER
    // }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Sarabun&display=swap');
/* body {
  margin: 0;
  padding: 0;
  background-color: #FAFAFA;
  font: 12pt "Tahoma";
} */

* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.page {
  width: 21cm;
  height: 29.7cm;
  padding: 1cm;
  margin: 1cm auto;
  border: 1px #D3D3D3 solid;
  border-radius: 5px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

/* .subpage {
  padding: 0.2cm;
  border: 5px red solid;
  height: 256mm;
  outline: 0.2cm #FFEAEA solid;
} */

@page {
  size: A4;
  margin: 0;
}
@media print {
  /* .page {
    margin: 0;
    border: initial;
    border-radius: initial;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    margin-bottom: -5px;
  } */
    .page {
    margin: 0;
    box-shadow: 0;
  }
   * {-webkit-print-color-adjust:exact;}
}

/* .page-break {
  page-break-after: always;
  page-break-inside: avoid;
  clear:both;
}
.page-break-before {
  page-break-before: always;
  page-break-inside: avoid;
  clear:both;
} */
#html-2-pdfwrapper {
  position: absolute;
  left: 20px;
  top: 50px;
  bottom: 0;
  overflow: auto;
  width: 600px;
}
table, td, th {
  border: 1px solid black;
}

td.noborderRight {
  border-right: 0px solid;
}

td.noborderLeft {
  border-left: 0px solid;
}

td.noborderBottom {
  border-bottom: 0px solid;
}

td.noborderTop {
  border-top: 0px solid;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  height: 50px;
  font-size: 12px !important;
}

.product_image {
  margin-bottom: -8px;
  /* width: 40px;
  height: 40px; */
}

.paddingRight {
  padd
.content {
  font-family: 'Sarabun' !important;
  font-size: 12px !important;
}
.footer {
  font-family: 'Sarabun';
  font-size: 14px;
}
.paddingTop {
  padding-top: 10px;
}
.paddingBottom {
  padding-bottom: 5px;
}

.itemset {
  max-height: 30px;
  max-width: 40px;
}
.content2 {
  font-family: 'Sarabun' !important;
  font-size: 12px !important;
}
/* table, td, th {
  border: 1px solid black;
}

td.noborderRight {
  border-right: 0px solid;
}

td.noborderLeft {
  border-left: 0px solid;
}

td.noborderBottom {
  border-bottom: 0px solid;
}

td.noborderTop {
  border-top: 0px solid;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  height: 50px;
  font-size: 12px !important;
}

.product_image {
  width: 40px;
  height: 40px;
}

.paddingRight {
  padding-right: 7px;
}

.header {
  font-family: 'Sarabun' !important;
  font-size: 14px !important;
  font-weight: bold;
  line-height: 1.2 !important;
}
.content {
  font-family: 'Sarabun' !important;
  font-size: 12px !important;
}
.footer {
  font-family: 'Sarabun' !important;
  font-size: 14px !important;
}
.paddingTop {
  padding-top: 10px;
}
.paddingBottom {
  padding-bottom: 5px;
} */

</style>
