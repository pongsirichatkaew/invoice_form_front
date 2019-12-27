<template>
  <v-form ref="form1" v-model="valid" lazy-validation>
    <v-card class="ma-3">
      <v-app-bar flat color="primary">
        <v-toolbar-title style="color:white">ส่วนที่ 1 สำหรับผู้ออกเอกสาร</v-toolbar-title>
      </v-app-bar>
      <v-container>
        <v-layout justify-end align-end>
          <v-flex xs12 md3>
            <v-text-field v-model="lastInvoiceDoc" label="เลขที่เอกสาร" disabled required></v-text-field>
          </v-flex>
        </v-layout>

        <v-layout justify-space-between row wrap>
          <v-flex xs12 md3>
            <v-text-field
              class="pl-3 pr-3"
              v-model="my_invoice.invoiceNumber"
              :rules="invoiceNumberRules"
              label="เลขที่ใบลดหนี้"
              :disabled="disabled||updateDialog"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md3>
            <v-text-field
              class="pl-3 pr-3"
              v-model="my_invoice.customerId"
              :rules="customerIdRules"
              :disabled="disabled"
              label="รหัสลูกค้า"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md3>
            <v-text-field
              class="pl-3 pr-3"
              v-model="my_invoice.customerName"
              :rules="customerNameRules"
              :disabled="disabled"
              label="ชื่อลูกค้า"
              required
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
    return {
      valid: true,
      disabled: false,
      disabledBtn: false,
      invoiceNumberRules: [v => !!v || "กรุณาใส่เลขที่ใบลดหนี้"],
      customerIdRules: [v => !!v || "กรุณาใส่รหัสลูกค้า"],
      customerNameRules: [v => !!v || "กรุณาใส่ชื่อลูกค้า"],

      test: true,
      count: 0
    };
  },
  computed: {
    ...mapState([
      "dialog",
      "infoDialog",
      "updateDialog",
      "my_invoice",
      "lastInvoiceDoc"
    ]),
    e1: {
      get() {
        return this.$store.getters.e1;
      },
      set(value) {
        this.$store.dispatch("updateE1", value);
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
    infoDialog(value) {
      if (!value) {
        this.$refs.form1.resetValidation();
      }
    },
    dialog(value) {
      if (!value) {
        this.$refs.form1.resetValidation();
      }
    },
    updateDialog(value) {
      if (!value) {
        this.$refs.form1.resetValidation();
      }
    }
  },
  methods: {
    checkForm1Valid() {
      if (this.$refs.form1.validate()) {
        this.e1 = 2;
      }
    }
  }
};
</script>

<style scoped>
/* .v-card {
  border: 3px solid #000000;
  border-radius: 10px;
} */
</style>
