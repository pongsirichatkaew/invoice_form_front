<template>
  <v-form lazy-validation>
    <v-card class="ma-3">
      <v-app-bar flat color="primary">
        <v-toolbar-title style="color:white">ส่วนที่ 1 สำหรับผู้ออกเอกสาร</v-toolbar-title>
      </v-app-bar>
      <v-container>
        <v-layout justify-end align-end row wrap>
          <v-flex xs12 md3>
            <v-text-field
              class="pl-3 pr-3"
              v-model="my_invoice.invoiceDoc"
              label="เลขที่เอกสาร"
              disabled
              required
            ></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout justify-space-between row wrap>
          <v-flex xs12 md3>
            <v-text-field
              class="pl-3 pr-3"
              v-model="my_invoice.invoiceNumber"
              label="เลขที่ใบลดหนี้"
              disabled
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md3>
            <v-text-field
              class="pl-3 pr-3"
              v-model="my_invoice.customerId"
              disabled
              label="รหัสลูกค้า"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md3>
            <v-text-field
              class="pl-3 pr-3"
              v-model="my_invoice.customerName"
              disabled
              label="ชื่อลูกค้า"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout justify-space-between></v-layout>
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
    ...mapState(["dialog", "invoice", "my_invoice"])
  }
};
</script>