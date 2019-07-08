<template>
  <v-app class="background">
    <v-container>
      <h1 class="mt-3 mb-3" style="color: white;">This is Form Page</h1>
      <v-card>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">Name of step 1</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">Name of step 2</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Name of step 3</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-container>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-layout justify-space-between>
                    <v-flex xs12 md2>
                      <v-text-field label="รหัสลูกค้า" required></v-text-field>
                    </v-flex>

                    <v-flex xs12 md3>
                      <v-text-field label="ชื่อลูกค้า" required></v-text-field>
                    </v-flex>

                    <v-flex xs12 md6>
                      <v-text-field label="เลขที่ใบแจ้งหนี้/เลขที่ใบเสร็จรับเงิน"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout justify-space-between>
                    <v-flex xs12 md4>
                      <v-text-field label="อ้างอิง S/O เลขที่" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 md7>
                      <v-text-field label="จำนวนเงินตามใบแจ้งหนี้ (ไม่รวมภาษีมูลค้าเพิ่ม)" required></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-text-field label="บริการที่ใช้งาน" required></v-text-field>

                  <v-layout justify-space-between>
                    <v-flex xs12 md2>
                      <v-text-field label="ตั้งแต่รอบบริการ" disabled></v-text-field>
                    </v-flex>

                    <v-flex xs12 md4>
                      <v-select
                        v-model="select"
                        :items="itemsYear"
                        :rules="[v => !!v || 'Year is required']"
                        label="พ.ศ."
                        required
                      ></v-select>
                    </v-flex>

                    <v-flex xs12 md4>
                      <v-select
                        v-model="select"
                        :items="itemsMonth"
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
                        v-model="select"
                        :items="itemsYear"
                        :rules="[v => !!v || 'Year is required']"
                        label="พ.ศ."
                        required
                      ></v-select>
                    </v-flex>

                    <v-flex xs12 md4>
                      <v-select
                        v-model="select"
                        :items="itemsMonth"
                        :rules="[v => !!v || 'Month is required']"
                        label="เดือน"
                        required
                      ></v-select>
                    </v-flex>
                  </v-layout>

                  <v-layout>
                    <v-flex xs1 md1>
                      <v-checkbox v-model="enabled" hide-details class="shrink mr-2"></v-checkbox>
                    </v-flex>

                    <v-flex xs12 md4>
                      <v-text-field :disabled="!enabled" label="การเปลี่ยนแปลงรายได้"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-container>
                    <v-layout align-center>
                      <v-checkbox v-model="enabled" hide-details class="shrink mr-2"></v-checkbox>
                      <v-text-field :disabled="!enabled" label="การเปลี่ยนแปลงรายได้"></v-text-field>
                    </v-layout>
                    <v-layout align-center>
                      <v-checkbox v-model="enabled" hide-details class="shrink mr-2"></v-checkbox>
                      <v-text-field :disabled="!enabled" label="การเปลี่ยนแปลงรายได้"></v-text-field>
                    </v-layout>
                  </v-container>
                </v-form>
              </v-container>
              <v-btn color="primary" @click="e1 = 2">Continue</v-btn>

              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card class="mb-5" color="grey lighten-1" height="200px"></v-card>

              <v-btn color="primary" @click="e1 = 3">Continue</v-btn>

              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-5" color="grey lighten-1" height="200px"></v-card>

              <v-btn color="primary" @click="e1 = 1">Continue</v-btn>

              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import Swal from "sweetalert2";

export default {
  data() {
    return { e1: 0, itemsYear: [], itemsMonth: [] };
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
      for (let index = -10; index < 10; index++) {
        let nYear = year + index;
        this.itemsYear.push(nYear);
      }
    }
  },
  created() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: "success",
      title: "Signed in successfully"
    });

    this.setYear();
    this.setMonth();
  }
};
</script>

<style scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 33%;
  background-image: -webkit-linear-gradient(80deg, #96c93d, #00b09b);
}
</style>

