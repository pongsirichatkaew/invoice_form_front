<template>
  <v-form ref="form1" v-model="valid" lazy-validation>
    <v-card class="ma-3">
      <v-container>
        <v-flex xs12 md2>
          <v-text-field
            v-model="invoice.invoiceNumber"
            :rules="invoiceNumberRules"
            label="เลขที่ใบลดหนี้"
            :disabled="disabled||updateDialog"
            required
          ></v-text-field>
        </v-flex>
        <v-layout justify-space-between>
          <v-flex xs12 md2>
            <v-text-field
              v-model="invoice.customerId"
              :rules="customerIdRules"
              :disabled="disabled"
              label="รหัสลูกค้า"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md3>
            <v-text-field
              v-model="invoice.customerName"
              :rules="customerNameRules"
              :disabled="disabled"
              label="ชื่อลูกค้า"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md6>
            <v-text-field
              v-model="invoice.invoiceSlip"
              :rules="invoiceSlipRules"
              :disabled="disabled"
              label="เลขที่ใบแจ้งหนี้/เลขที่ใบเสร็จรับเงิน"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout justify-space-between>
          <v-flex xs12 md4>
            <v-text-field
              v-model="invoice.soNumber"
              :rules="soNumberRules"
              label="อ้างอิง S/O เลขที่"
              :disabled="disabled"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 md7>
            <v-text-field
              v-model="invoice.invoiceAmount"
              :rules="invoiceAmountRules"
              label="จำนวนเงินตามใบแจ้งหนี้ (ไม่รวมภาษีมูลค้าเพิ่ม)"
              :disabled="disabled"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn
          color="primary"
          @click="checkForm1Valid"
          :disabled="disabledBtn"
          v-if="e1==1"
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
      invoiceNumberRules: [v => !!v || "Invoice Number is required"],
      customerIdRules: [v => !!v || "CustomerIdRules is required"],
      customerNameRules: [v => !!v || "Customer Name is required"],
      invoiceSlipRules: [v => !!v || "Invoice Slip is required"],
      soNumberRules: [v => !!v || "S/O Number is required"],
      invoiceAmountRules: [
        v => !!v || "S/O Number is required",
        v => /^[0-9]+$/.test(v) || "Only number is allowed"
      ]
    };
  },
  computed: {
    ...mapState(["dialog", "updateDialog", "invoice"]),
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
        console.log("e1", value);
      } else {
        this.disabled = false;
      }
    },
    valid(value) {
      if (value) {
        console.log(value);
        this.disabledBtn = false;
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
        console.log("isForm1Validate", this.$refs.form1.validate());
        console.log(this.$store.state.invoice);
        this.e1 = 2;
      } else {
        this.disabledBtn = true;
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
