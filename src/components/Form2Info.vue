<template>
  <div>
    <div v-for="(item,index) in my_invoice.invoice" :key="index">
      <v-form lazy-validation>
        <v-card class="ma-3">
          <v-app-bar flat color="primary">
            <v-toolbar-title style="color:white">แบบฟอร์มขออนุมัติลดหนี้ #{{index+1}}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-app-bar>

          <v-container>
            <v-layout justify-space-between row wrap>
              <v-flex xs12 md6>
                <v-text-field
                  class="pl-3 pr-3"
                  v-model="item.invoiceSlip"
                  disabled
                  label="เลขที่ใบแจ้งหนี้/เลขที่ใบเสร็จรับเงิน"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  disabled
                  class="pl-3 pr-3"
                  v-model="item.soNumber"
                  label="อ้างอิง S/O เลขที่"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  class="pl-3 pr-3"
                  v-model="item.invoiceAmount"
                  label="จำนวนเงินตามใบแจ้งหนี้ (ไม่รวมภาษีมูลค้าเพิ่ม)"
                  disabled
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  class="pl-3 pr-3"
                  v-model="item.service"
                  disabled
                  label="บริการที่ใช้งาน"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6>
                <v-menu
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
                      disabled
                      append-icon="mdi-calendar-blank"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="item.from_date" no-title scrollable>
                    <div class="flex-grow-1"></div>
                  </v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 md6>
                <v-menu
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
                      disabled
                      append-icon="mdi-calendar-blank"
                      readonly
                      v-on="on"
                      @click="checkTo(item,index)"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="item.to_date" no-title scrollable>
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
      <v-form lazy-validation>
        <v-card class="ma-3">
          <v-container>
            <v-layout align-center justify-space-between row wrap>
              <v-flex xs12 md4>
                <v-checkbox
                  v-model="income"
                  hide-details
                  disabled
                  class="ml-2"
                  label="กรณีเปลี่ยนแปลงรายได้"
                ></v-checkbox>
              </v-flex>

              <v-flex xs12 md4>
                <v-checkbox
                  v-model="notIncome"
                  hide-details
                  disabled
                  class="ml-2"
                  label="กรณีไม่เปลี่ยนแปลงรายได้"
                ></v-checkbox>
              </v-flex>
              <v-flex xs12 md4>
                <v-layout align-center>
                  <v-checkbox disabled v-model="otherIncome" hide-details class="ml-2" label></v-checkbox>
                  <v-text-field disabled label="อื่นๆ" v-model="my_invoice.invoiceOtherDescription"></v-text-field>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-container v-if="income">
              <v-layout align-center>
                <v-checkbox
                  v-model="my_invoice.invoiceFull"
                  hide-details
                  class="shrink mr-2"
                  disabled
                  label
                ></v-checkbox>
                <v-text-field
                  v-model="my_invoice.invoiceFullAmount"
                  disabled
                  label="ลดหนี้เต็มจำนวน จำนวน(บาท) (ไม่รวม VAT)"
                ></v-text-field>
              </v-layout>
              <v-layout align-center>
                <v-checkbox
                  v-model="my_invoice.invoicePartial"
                  hide-details
                  class="shrink mr-2"
                  disabled
                ></v-checkbox>
                <v-text-field
                  v-model="my_invoice.invoicePartialAmount"
                  disabled
                  label="ลดหนี้บางส่วน จำนวน(บาท) (ไม่รวม VAT)"
                ></v-text-field>
              </v-layout>
            </v-container>

            <v-textarea
              name="input-7-1"
              label="สาเหตุการลดหนี้"
              v-model="my_invoice.invoiceDescription"
              disabled
              hint="บอกเหตุผลที่ต้องการ"
            ></v-textarea>
          </v-container>
        </v-card>
      </v-form>
    </div>
  </div>
</template>


<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["my_invoice"]),
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
  }
};
</script>