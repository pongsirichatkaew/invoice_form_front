<template>
  <v-form ref="form2" v-model="valid" lazy-validation>
    <v-card class="ma-3">
      <v-container>
        <v-text-field
          v-model="invoice.service"
          :disabled="disabled"
          label="บริการที่ใช้งาน"
          :rules="serviceRules"
        ></v-text-field>

        <v-layout justify-space-between>
          <v-flex xs12 md2>
            <v-text-field label="ตั้งแต่รอบบริการ" disabled></v-text-field>
          </v-flex>

          <v-flex xs12 md4>
            <v-select
              v-model="invoice.sinceServiceYear"
              :items="itemsYear"
              :disabled="disabled"
              :rules="[v => !!v || 'Year is required']"
              label="พ.ศ."
              required
            ></v-select>
          </v-flex>

          <v-flex xs12 md4>
            <v-select
              v-model="invoice.sinceServiceMonth"
              :items="itemsMonth"
              :disabled="disabled"
              :rules="[v => !!v || 'Month is required']"
              label="เดือน"
              required
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout justify-space-between>
          <v-flex xs12 md2>
            <v-text-field label="ถึงรอบบริการ" disabled></v-text-field>
          </v-flex>

          <v-flex xs12 md4>
            <v-select
              v-model="invoice.toServiceYear"
              :items="itemsYear"
              :disabled="disabled"
              :rules="[v => !!v || 'Year is required']"
              label="พ.ศ."
              required
            ></v-select>
          </v-flex>

          <v-flex xs12 md4>
            <v-select
              v-model="invoice.toServiceMonth"
              :items="itemsMonth"
              :disabled="disabled"
              :rules="[v => !!v || 'Month is required']"
              label="เดือน"
              required
            ></v-select>
          </v-flex>
        </v-layout>

        <v-layout align-center justify-space-between>
          <v-flex>
            <v-checkbox
              v-model="income"
              hide-details
              :disabled="disabled"
              class="shrink mr-2"
              label="กรณีเปลี่ยนแปลงรายได้"
            ></v-checkbox>
          </v-flex>

          <v-flex>
            <v-checkbox
              v-model="notIncome"
              hide-details
              :disabled="disabled"
              class="shrink mr-2"
              label="กรณีไม่เปลี่ยนแปลงรายได้"
            ></v-checkbox>
          </v-flex>

          <v-flex>
            <v-layout align-center>
              <v-checkbox
                :disabled="disabled"
                v-model="invoice.otherIncome"
                hide-details
                class="shrink mr-2"
                label
              ></v-checkbox>
              <v-text-field
                :disabled="!otherIncome"
                label="อื่นๆ"
                v-model="invoice.invoiceOtherDescription"
              ></v-text-field>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-container>
          <v-layout align-center>
            <v-checkbox
              :disabled="!invoice.income||disabled"
              v-model="invoice.invoiceFull"
              hide-details
              class="shrink mr-2"
              label
            ></v-checkbox>
            <v-text-field
              v-model="invoice.invoiceFullAmount"
              :disabled="!income||disabled"
              label="ลดหนี้เต็มจำนวน จำนวน(บาท) (ไม่รวม VAT)"
            ></v-text-field>
          </v-layout>
          <v-layout align-center>
            <v-checkbox
              :disabled="!invoice.income||disabled||invoicePartial"
              v-model="invoice.invoicePartial"
              hide-details
              class="shrink mr-2"
            ></v-checkbox>
            <v-text-field
              v-model="invoice.invoicePartialAmount"
              :disabled="!income||disabled||invoiceFull"
              label="ลดหนี้บางส่วน จำนวน(บาท) (ไม่รวม VAT)"
            ></v-text-field>
          </v-layout>
        </v-container>

        <v-textarea
          name="input-7-1"
          label="สาเหตุการลดหนี้"
          v-model="invoice.invoiceDescription"
          :rules="invoiceDescriptionRules"
          :disabled="disabled"
          hint="บอกเหตุผลที่ต้องการ"
        ></v-textarea>
        <v-btn
          color="primary"
          @click="checkForm2Valid"
          :disabled="disabledBtn"
          v-if="e1==2"
        >Continue</v-btn>
      </v-container>
    </v-card>
  </v-form>
</template>


<script>
import { mapState } from "vuex";
import { close } from "fs";

export default {
  data() {
    return {
      valid: true,
      disabled: false,
      disabledBtn: false,
      itemsYear: [],
      itemsMonth: [],
      itemsMonthFrom: [],
      itemsMonthTo: [],
      serviceRules: [v => !!v || "Service is required"],
      invoiceDescriptionRules: [v => !!v || "กรุณาบอกเหตุผล"]
    };
  },
  computed: {
    ...mapState(["dialog", "invoice", "updateDialog"]),

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
        this.disabled = false;
      }
    },
    valid(value) {
      if (value) {
        this.disabledBtn = false;
      }
    },
    income(value) {
      if (value) {
        this.income = true;
        this.notIncome = false;
        this.otherIncome = false;
      }
    },
    notIncome(value) {
      if (value) {
        this.income = false;
        this.notIncome = true;
        this.otherIncome = false;
      }
    },
    otherIncome(value) {
      if (value) {
        this.income = false;
        this.notIncome = false;
        this.otherIncome = true;
      }
    },
    invoiceFull(value) {
      if (value) {
        this.invoiceFull = true;
        this.invoicePartial = false;
        this.$store.commit("updatInvoicePartialAmount", "");
      }
    },
    invoicePartial(value) {
      if (value) {
        this.invoiceFull = false;
        this.invoicePartial = true;
        this.$store.commit("updatInvoiceFullAmount", "");
      }
    },
    dialog(value) {
      if (!value) {
        this.$refs.form2.resetValidation();
      }
    }
  },
  methods: {
    setMonth() {
      let currentTime = new Date();
      let month = this.checkMonth(currentTime.getMonth());
      console.log("month", month);
      this.invoice.sinceServiceMonth = `${month}`;
      this.itemsMonth.push("มกราคม");
      this.itemsMonth.push("กุมภาพันธ์");
      this.itemsMonth.push("มีนาคม");
      this.itemsMonth.push("เมษายน");
      this.itemsMonth.push("พฤษภาคม");
      this.itemsMonth.push("มิถุนายน");
      this.itemsMonth.push("กรกฏาคม");
      this.itemsMonth.push("สิงหาคม");
      this.itemsMonth.push("กันยายน");
      this.itemsMonth.push("ตุลาคม");
      this.itemsMonth.push("พฤศจิกายน");
      this.itemsMonth.push("ธันวาคม");
    },
    setYear() {
      let currentTime = new Date();
      let year = currentTime.getFullYear() + 543;

      this.invoice.sinceServiceYear = `${year}`;
      for (let index = -10; index < 10; index++) {
        let nYear = year + index;
        this.itemsYear.push(`${nYear}`);
      }
    },
    checkForm2Valid() {
      if (this.$refs.form2.validate()) {
        this.e1 = 3;
      } else {
        this.disabledBtn = true;
      }
    },
    checkMonth(index) {
      switch (index) {
        case 0:
          return "มกราคม";
          break;
        case 1:
          return "กุมภาพันธ์";
          break;
        case 2:
          return "มีนาคม";
          break;
        case 3:
          return "เมษายน";
          break;
        case 4:
          return "พฤษภาคม";
          break;
        case 5:
          return "มิถุนายน";
          break;
        case 6:
          return "กรกฏาคม";
          break;
        case 7:
          return "สิงหาคม";
          break;
        case 8:
          return "กันยายน";
          break;
        case 9:
          return "ตุลาคม";
          break;
        case 10:
          return "พฤศจิกายน";
          break;
        case 11:
          return "ธันวาคม";
          break;
        default:
          return "";
      }
    }
  },
  created() {
    this.setYear();
    this.setMonth();
  }
};
</script>