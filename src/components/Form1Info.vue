<template>
  <v-form>
    <v-card class="ma-3">
      <v-container>
        <v-flex xs12 md2>
          <v-text-field
            v-model="invoice.invoiceNumber"
            label="เลขที่ใบลดหนี้"
            disabled
          ></v-text-field>
        </v-flex>
        <v-layout justify-space-between>
          <v-flex xs12 md2>
            <v-text-field v-model="invoice.customerId" disabled label="รหัสลูกค้า"></v-text-field>
          </v-flex>

          <v-flex xs12 md3>
            <v-text-field
              v-model="invoice.customerName"
              disabled
              label="ชื่อลูกค้า"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field
              v-model="invoice.invoiceSlip"
              disabled
              label="เลขที่ใบแจ้งหนี้/เลขที่ใบเสร็จรับเงิน"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout justify-space-between>
          <v-flex xs12 md4>
            <v-text-field v-model="invoice.soNumber" label="อ้างอิง S/O เลขที่" disabled required></v-text-field>
          </v-flex>
          <v-flex xs12 md7>
            <v-text-field
              v-model="invoice.invoiceAmount"
              label="จำนวนเงินตามใบแจ้งหนี้ (ไม่รวมภาษีมูลค้าเพิ่ม)"
              disabled
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-form>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["dialog", "invoice"])
  }
};
</script>