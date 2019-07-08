<template>
  <v-form>
    <v-card class="ma-3">
      <v-container>
        <v-text-field v-model="invoice.service" disabled label="บริการที่ใช้งาน"></v-text-field>

        <v-layout justify-space-between>
          <v-flex xs12 md2>
            <v-text-field label="ตั้งแต่รอบบริการ" disabled></v-text-field>
          </v-flex>

          <v-flex xs12 md4>
            <v-select v-model="invoice.sinceServiceYear" :items="itemsYear" disabled label="พ.ศ."></v-select>
          </v-flex>

          <v-flex xs12 md4>
            <v-select :value="invoice.sinceServiceMonth" :items="itemsMonth" disabled label="เดือน" required></v-select>
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
              disabled
              :rules="[v => !!v || 'Year is required']"
              label="พ.ศ."
              required
            ></v-select>
          </v-flex>

          <v-flex xs12 md4>
            <v-select
              v-model="invoice.toServiceMonth"
              :items="itemsMonth"
              disabled
              :rules="[v => !!v || 'Month is required']"
              label="เดือน"
              required
            ></v-select>
          </v-flex>
        </v-layout>

        <v-layout align-center justify-space-between>
          <v-flex>
            <v-checkbox hide-details disabled class="shrink mr-2" label="กรณีเปลี่ยนแปลงรายได้"></v-checkbox>
          </v-flex>

          <v-flex>
            <v-checkbox hide-details disabled class="shrink mr-2" label="กรณีไม่เปลี่ยนแปลงรายได้"></v-checkbox>
          </v-flex>

          <v-flex>
            <v-layout align-center>
              <v-checkbox disabled hide-details class="shrink mr-2" label></v-checkbox>
              <v-text-field disabled label="อื่นๆ"></v-text-field>
            </v-layout>
          </v-flex>
        </v-layout>

        <v-container>
          <v-layout align-center>
            <v-checkbox disabled hide-details class="shrink mr-2" label></v-checkbox>
            <v-text-field disabled label="ลดหนี้เต็มจำนวน จำนวน(บาท) (ไม่รวม VAT)"></v-text-field>
          </v-layout>
          <v-layout align-center>
            <v-checkbox disabled hide-details class="shrink mr-2"></v-checkbox>
            <v-text-field disabled label="ลดหนี้บางส่วน จำนวน(บาท) (ไม่รวม VAT)"></v-text-field>
          </v-layout>
        </v-container>

        <v-textarea
          name="input-7-1"
          label="สาเหตุการลดหนี้"
          disabled
          value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
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
      a: 2556,
      itemsYear: [],
      itemsMonth: [],
      select: ""
    };
  },
  computed: {
    ...mapState(["invoice", "simpleYear"])
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
        this.itemsYear.push(nYear);
      }
      console.log(this.itemsYear);
    }
  }
};
</script>