<template>
  <div>
    <div v-for="(item,index) in my_invoice.invoice" :key="index">
      <v-form ref="form2" v-model="valid" lazy-validation>
        <v-card class="ma-3">
          <v-app-bar flat color="primary">
            <v-toolbar-title style="color:white">แบบฟอร์มขออนุมัติลดหนี้ #{{index+1}}</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-btn v-if="!disabled" dark text icon @click="deleteCount(index)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn v-if="!disabled" icon text color="white" dark @click="addInvoice()">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-app-bar>

          <v-container>
            <v-layout justify-space-between row wrap>
              <v-flex xs12 md6>
                <v-text-field
                  class="pl-3 pr-3"
                  v-model="item.invoiceSlip"
                  :rules="invoiceSlipRules"
                  :disabled="disabled"
                  label="เลขที่ใบแจ้งหนี้/เลขที่ใบเสร็จรับเงิน"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  class="pl-3 pr-3"
                  v-model="item.soNumber"
                  :rules="soNumberRules"
                  label="อ้างอิง S/O เลขที่"
                  :disabled="disabled"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  class="pl-3 pr-3"
                  v-model="item.invoiceAmount"
                  :rules="invoiceAmountRules"
                  label="จำนวนเงินตามใบแจ้งหนี้ (ไม่รวมภาษีมูลค้าเพิ่ม)"
                  :disabled="disabled"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  class="pl-3 pr-3"
                  v-model="item.service"
                  :disabled="disabled"
                  label="บริการที่ใช้งาน"
                  :rules="serviceRules"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-menu
                  v-model="menu[my_invoice.invoice.indexOf(item)]"
                  attach
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="100px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="item.from_date"
                      class="pl-3 pr-3"
                      label="ตั้งแต่รอบบริการ"
                      :disabled="disabled"
                      :rules="dateRules"
                      append-icon="mdi-calendar-blank"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="item.from_date"
                    @input="menu[my_invoice.invoice.indexOf(item)] = false"
                    no-title
                    scrollable
                  >
                    <div class="flex-grow-1"></div>
                    <!-- <v-btn text color="primary" @click="menu = false">Cancel</v-btn> -->
                    <!-- <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn> -->
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md6>
                <v-menu
                  v-model="menuClose[my_invoice.invoice.indexOf(item)]"
                  attach
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="100px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="item.to_date"
                      class="pl-3 pr-3"
                      label="ถึงรอบบริการ"
                      :disabled="disabled"
                      :rules="dateRules"
                      append-icon="mdi-calendar-blank"
                      readonly
                      v-on="on"
                      @click="checkTo(item,index)"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :min="min_date"
                    v-model="item.to_date"
                    @input="menuClose[my_invoice.invoice.indexOf(item)] = false"
                    no-title
                    scrollable
                  >
                    <div class="flex-grow-1"></div>
                  </v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-form>
    </div>
    <div>
      <v-form ref="form3" v-model="valid1" lazy-validation>
        <v-card class="ma-3">
          <v-container>
            <v-layout align-center justify-space-between row wrap>
              <v-flex xs12 md4>
                <v-checkbox
                  class="ml-2"
                  v-model="income"
                  hide-details
                  :disabled="disabled"
                  label="กรณีเปลี่ยนแปลงรายได้"
                ></v-checkbox>
              </v-flex>

              <v-flex xs12 md4>
                <v-checkbox
                  class="ml-2"
                  v-model="notIncome"
                  hide-details
                  :disabled="disabled"
                  label="กรณีไม่เปลี่ยนแปลงรายได้"
                ></v-checkbox>
              </v-flex>
              <v-flex xs12 md4>
                <v-layout align-center>
                  <v-checkbox
                    class="ml-2"
                    :disabled="disabled"
                    v-model="otherIncome"
                    hide-details
                    label
                  ></v-checkbox>
                  <v-text-field
                    class="pr-3"
                    :disabled="!otherIncome||e1==3"
                    :rules="invoiceOtherDescriptionRules"
                    label="อื่นๆ"
                    v-model="my_invoice.invoiceOtherDescription"
                  ></v-text-field>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-container v-if="income">
              <v-layout align-center>
                <v-checkbox
                  v-model="my_invoice.invoiceFull"
                  hide-details
                  class="shrink mr-2"
                  :disabled="e1==3"
                  label
                ></v-checkbox>
                <v-text-field
                  v-model="my_invoice.invoiceFullAmount"
                  :rules="invoiceFullAmountRules"
                  :disabled="!income||disabled||invoicePartial"
                  label="ลดหนี้เต็มจำนวน จำนวน(บาท) (ไม่รวม VAT)"
                ></v-text-field>
              </v-layout>
              <v-layout align-center>
                <v-checkbox
                  v-model="my_invoice.invoicePartial"
                  hide-details
                  class="shrink mr-2"
                  :disabled="e1==3"
                ></v-checkbox>
                <v-text-field
                  v-model="my_invoice.invoicePartialAmount"
                  :rules="invoicePartialAmountRules"
                  :disabled="!income||disabled||invoiceFull"
                  label="ลดหนี้บางส่วน จำนวน(บาท) (ไม่รวม VAT)"
                ></v-text-field>
              </v-layout>
            </v-container>

            <v-textarea
              name="input-7-1"
              label="สาเหตุการลดหนี้"
              v-model="my_invoice.invoiceDescription"
              :rules="invoiceDescriptionRules"
              :disabled="disabled"
              hint="บอกเหตุผลที่ต้องการ"
            ></v-textarea>
          </v-container>
        </v-card>
      </v-form>
    </div>
  </div>
</template>


<script>
import { mapState, mapActions } from "vuex";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      valid: true,
      valid1: true,
      disabled: false,
      disabledBtn: false,
      menu: [],
      menuClose: [],
      itemsYear: [],
      itemsMonth: [],
      itemsMonthFrom: [],
      itemsMonthTo: [],
      serviceRules: [v => !!v || "กรุณาใส่บริการที่ใช้งาน"],
      dateRules: [v => !!v || "กรุณาใส่รอบบริการ"],

      invoiceDescriptionRules: [v => !!v || "กรุณาบอกเหตุผล"],

      invoiceSlipRules: [v => !!v || "Invoice Slip is required"],
      soNumberRules: [v => !!v || "S/O Number is required"],
      invoiceAmountRules: [
        v => !!v || "S/O Number is required",
        v =>
          /^\-{0,1}(?:[0-9]+){0,1}(?:\.[0-9]+){0,1}$/i.test(v) ||
          "Only number is allowed"
      ],
      invoicePartialAmountRules: [],
      invoiceOtherDescriptionRules: [],
      invoiceFullAmountRules: [
        v => !!v || "กรุณาใส่ตัวเลข",
        v =>
          /^\-{0,1}(?:[0-9]+){0,1}(?:\.[0-9]+){0,1}$/i.test(v) ||
          "กรุณาใส่ตัวเลขจำนวนเต็มบวกเท่านั้น"
      ],
      min_date: "",
      max_date: "",
      test: true
    };
  },
  computed: {
    ...mapState(["dialog", "infoDialog", "updateDialog", "my_invoice"]),
    e1: {
      get() {
        return this.$store.getters.e1;
      },
      set(value) {
        this.$store.dispatch("updateE1", value);
      }
    },
    income: {
      get() {
        return this.$store.getters.income;
      },
      set(value) {
        this.$store.dispatch("updateIncome", value);
      }
    },
    notIncome: {
      get() {
        return this.$store.getters.notIncome;
      },
      set(value) {
        this.$store.dispatch("updateNotIncome", value);
      }
    },
    otherIncome: {
      get() {
        return this.$store.getters.otherIncome;
      },
      set(value) {
        this.$store.dispatch("updateOtherIncome", value);
      }
    },
    invoiceFull: {
      get() {
        return this.$store.getters.invoiceFull;
      },
      set(value) {
        this.$store.dispatch("updatInvoiceFull", value);
      }
    },
    invoicePartial: {
      get() {
        return this.$store.getters.invoicePartial;
      },
      set(value) {
        this.$store.dispatch("updatInvoicePartial", value);
      }
    }
  },
  watch: {
    e1(value) {
      if (value === 3) {
        this.disabled = true;
      } else {
        for (let ref in this.$refs.form2) {
          this.$refs.form2[ref].resetValidation();
        }
        this.$refs.form3.resetValidation();
        this.disabled = false;
      }
    },
    valid(value) {
      if (value) {
        this.disabledBtn = false;
      }
    },
    dialog(value) {
      if (!value) {
        for (let ref in this.$refs.form2) {
          console.log("ref", this.$refs.form2[ref].resetValidation());
        }
        this.$refs.form3.resetValidation();
      }
    },
    infoDialog(value) {
      if (!value) {
        for (let ref in this.$refs.form2) {
          console.log("ref", this.$refs.form2[ref].resetValidation());
        }
        this.$refs.form3.resetValidation();
      }
    },

    income(value) {
      if (value) {
        this.income = true;
        this.notIncome = false;
        this.otherIncome = false;
        this.invoiceOtherDescriptionRules = [];
        this.my_invoice.invoiceOtherDescription = "";
      }
    },
    notIncome(value) {
      if (value) {
        this.income = false;
        this.notIncome = true;
        this.otherIncome = false;
        this.$store.commit("updatInvoicePartialAmount", "");
        this.$store.commit("updatInvoiceFullAmount", "");

        this.invoiceOtherDescriptionRules = [];
        this.my_invoice.invoiceOtherDescription = "";
      }
    },
    otherIncome(value) {
      if (value) {
        this.income = false;
        this.notIncome = false;
        this.otherIncome = true;
        this.$store.commit("updatInvoicePartialAmount", "");
        this.$store.commit("updatInvoiceFullAmount", "");
        this.invoiceOtherDescriptionRules = [
          v => !!v || "กรุณาใส่ข้อมูลเพิ่มเติม"
        ];
      }
    },
    invoiceFull(value) {
      if (value) {
        this.invoiceFull = true;
        this.invoicePartial = false;
        this.$store.commit("updatInvoicePartialAmount", "");
        this.invoiceFullAmountRules = [
          v => !!v || "AmountNumber is required",
          v =>
            /^\-{0,1}(?:[0-9]+){0,1}(?:\.[0-9]+){0,1}$/i.test(v) ||
            "Only number is allowed"
        ];
        this.invoicePartialAmountRules = [];
      }
    },
    invoicePartial(value) {
      if (value) {
        this.invoiceFull = false;
        this.invoicePartial = true;
        this.$store.commit("updatInvoiceFullAmount", "");
        this.invoicePartialAmountRules = [
          v => !!v || "Amount Number is required",
          v =>
            /^\-{0,1}(?:[0-9]+){0,1}(?:\.[0-9]+){0,1}$/i.test(v) ||
            "Only number is allowed"
        ];
        this.invoiceFullAmountRules = [];
      }
    }
  },
  methods: {
    ...mapActions(["addMyinvoice"]),
    check(item, index) {
      console.log("item", this.my_invoice.invoice[index]);
      // this.my_invoice.invoice[index].menuStart = true;
      // item.menuStart = true;
    },
    checkTo(item, index) {
      console.log("item", this.my_invoice.invoice[index]);
      // this.my_invoice.invoice[index].menuStop = true;
      // item.menuStart = true;
    },
    addInvoice() {
      this.my_invoice.invoice.push({
        invoiceSlip: "",
        soNumber: "",
        invoiceAmount: "",
        service: "",
        from_date: "",
        to_date: "",
        menuStart: false,
        menuStop: false
      });
    },
    deleteCount(index) {
      if (this.my_invoice.invoice.length > 1) {
        this.my_invoice.invoice.splice(index, 1);
        console.log(this.my_invoice.invoice);
      }
    },
    checkForm2Valid() {
      let valid = true;
      for (let ref in this.$refs.form2) {
        console.log("re", ref);
        console.log("ref", this.$refs.form2[ref]);
        console.log("ref", this.$refs.form2[ref].validate());
        if (!this.$refs.form2[ref].validate()) {
          valid = false;
        }
      }
      console.log(this.$refs.form3.validate());
      if (this.$refs.form3.validate() && valid) {
        if (!this.income && !this.notIncome && !this.otherIncome) {
          Swal.fire({
            type: "error",
            text: "กรุณาเลือกการเปลี่ยนแปลงรายได้อย่างน้อย 1 หัวข้อ"
          });
        } else if (this.income) {
          if (!this.invoiceFull && !this.invoicePartial) {
            Swal.fire({
              type: "error",
              text: "เลือกกรณีเปลี่ยนแปลงรายได้อย่างน้อย 1 ข้อ"
            });
          } else {
            this.e1 = 3;
          }
        } else {
          this.e1 = 3;
        }
      }
    },
    dd() {}
  },
  created() {}
};
</script>