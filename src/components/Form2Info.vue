<template>
  <v-form>
    <v-card class="ma-3">
      <v-container>
        <v-text-field v-model="invoice.service" disabled label="บริการที่ใช้งาน"></v-text-field>

        <v-layout justify-space-between>
          <v-flex xs12 md2>
            <p class="title mt-4">ตั้งแต่รอบบริการ</p>
          </v-flex>

          <v-flex xs12 md4>
            <v-select
              v-model="invoice.sinceServiceYear"
              :items="itemsYear"
              disabled
              label="พ.ศ."
              required
            ></v-select>
          </v-flex>

          <v-flex xs12 md4>
            <v-select
              v-model="invoice.sinceServiceMonth"
              :items="itemsMonth"
              disabled
              label="เดือน"
              required
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout justify-space-between>
          <v-flex xs12 md2>
            <p class="title mt-4">ถึงรอบบริการ</p>
          </v-flex>

          <v-flex xs12 md4>
            <v-select v-model="invoice.toServiceYear" :items="itemsYear" disabled label="พ.ศ."></v-select>
          </v-flex>

          <v-flex xs12 md4>
            <v-select
              v-model="invoice.toServiceMonth"
              :items="itemsMonth"
              disabled
              label="เดือน"
              required
            ></v-select>
          </v-flex>
        </v-layout>

        <v-layout align-center justify-space-between>
          <v-flex>
            <v-checkbox
              v-model="invoice.income"
              hide-details
              readonly
              class="shrink mr-2"
              label="กรณีเปลี่ยนแปลงรายได้"
            ></v-checkbox>
          </v-flex>

          <v-flex>
            <v-checkbox
              v-model="invoice.notIncome"
              hide-details
              readonly
              class="shrink mr-2"
              label="กรณีไม่เปลี่ยนแปลงรายได้"
            ></v-checkbox>
          </v-flex>

          <v-flex>
            <v-layout align-center>
              <v-checkbox v-model="invoice.otherIncome" readonly hide-details class="shrink mr-2"></v-checkbox>
              <v-text-field disabled label="อื่นๆ" v-model="invoice.invoiceOtherDescription"></v-text-field>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-container v-if="income">
          <v-layout align-center>
            <v-checkbox
              v-model="invoice.invoiceFull"
              readonly
              hide-details
              class="shrink mr-2"
              label
            ></v-checkbox>
            <v-text-field
              v-model="invoice.invoiceFullAmount"
              readonly
              label="ลดหนี้เต็มจำนวน จำนวน(บาท) (ไม่รวม VAT)"
            ></v-text-field>
          </v-layout>
          <v-layout align-center>
            <v-checkbox v-model="invoice.invoicePartial" disabled hide-details class="shrink mr-2"></v-checkbox>
            <v-text-field
              v-model="invoice.invoicePartialAmount"
              readonly
              label="ลดหนี้บางส่วน จำนวน(บาท) (ไม่รวม VAT)"
            ></v-text-field>
          </v-layout>
        </v-container>

        <v-textarea
          name="input-7-1"
          label="สาเหตุการลดหนี้"
          v-model="invoice.invoiceDescription"
          disabled
          hint="บอกเหตุผลที่ต้องการ"
        ></v-textarea>
      </v-container>
    </v-card>
  </v-form>
</template>


<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      itemsYear: [],
      itemsMonth: []
    };
  },
  computed: {
    ...mapState(["invoice", "simpleYear"]),
    income: {
      get() {
        return this.$store.getters.income;
      },
      set(value) {
        this.$store.dispatch("updateIncome", value);
      }
    }
  },
  created() {
    this.setMonth();
    this.setYear();
  },
  methods: {
    setMonth() {
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
      this.itemsMonth.push("พศจิกายน");
      this.itemsMonth.push("ธันวาคม");
    },
    setYear() {
      let currentTime = new Date();
      let year = currentTime.getFullYear() + 543;
      this.select = year;
      for (let index = -9; index < 10; index++) {
        let nYear = year + index;
        this.itemsYear.push(`${nYear}`);
      }
    }
  }
};
</script>