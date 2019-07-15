import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //All the property
    e1: 1,
    dialog: false,
    updateDialog: false,

    invoice: {
      invoiceNumber: "",
      customerId: "",
      customerName: "",
      invoiceSlip: "",
      soNumber: "",
      invoiceAmount: "",
      service: "",
      sinceServiceYear: "",
      sinceServiceMonth: "",
      toServiceYear: "",
      toServiceMonth: "",
      income: true,
      notIncome: false,
      otherIncome: false,
      invoiceOtherDescription: "",
      invoiceFull: true,
      invoicePartial: false,
      invoiceDescription: "",
      invoiceFullAmount: "",
      invoicePartialAmount: "",
      status: ""
    }
  },
  getters: {
    e1: state => {
      return state.e1;
    },
    income: state => {
      return state.invoice.income;
    },
    notIncome: state => {
      return state.invoice.notIncome;
    },
    otherIncome: state => {
      return state.invoice.otherIncome;
    },
    invoiceFull: state => {
      return state.invoice.invoiceFull;
    },
    invoicePartial: state => {
      return state.invoice.invoicePartial;
    }
  },
  mutations: {
    updateE1: (state, payload) => {
      state.e1 = payload;
    },
    updateIncome: (state, payload) => {
      state.invoice.income = payload;
    },
    updateNotIncome: (state, payload) => {
      state.invoice.notIncome = payload;
    },
    updateOtherIncome: (state, payload) => {
      state.invoice.otherIncome = payload;
    },
    updatInvoiceFull: (state, payload) => {
      state.invoice.invoiceFull = payload;
    },
    updatInvoiceFullAmount: (state, payload) => {
      state.invoice.invoiceFullAmount = payload;
    },
    updatInvoicePartial: (state, payload) => {
      state.invoice.invoicePartial = payload;
    },
    updatInvoicePartialAmount: (state, payload) => {
      state.invoice.invoicePartialAmount = payload;
    },
    updateDialog: (state, payload) => {
      state.dialog = payload;
    },
    updateUpdatedialog: (state, payload) => {
      state.updateDialog = payload;
    },

    clearFormData: state => {
      state.e1 = 1;

      state.invoice.invoiceNumber = "";
      state.invoice.customerId = "";
      state.invoice.customerName = "";
      state.invoice.invoiceSlip = "";
      state.invoice.soNumber = "";
      state.invoice.invoiceAmount = "";

      state.invoice.service = "";
      state.invoice.sinceServiceYear = "";
      state.invoice.sinceServiceMonth = "";
      state.invoice.toServiceYear = "";
      state.invoice.toServiceMonth = "";

      state.invoice.income = true;
      state.invoice.notIncome = false;
      state.otherIncome = false;
      state.invoice.invoiceOtherDescription = "";
      state.invoice.invoiceFull = true;
      state.invoice.invoicePartial = false;
      state.invoice.invoiceDescription = "";
      state.invoice.invoiceFullAmount = "";
      state.invoice.invoicePartialAmount = "";
      state.invoice.status = "";
    },
    updateInvoiceInfo: (state, payload) => {
      state.invoice.invoiceNumber = payload.invoiceNumber;
      state.invoice.customerId = payload.customerId;
      state.invoice.customerName = payload.customerName;
      state.invoice.invoiceSlip = payload.invoiceSlip;
      state.invoice.soNumber = payload.soNumber;
      state.invoice.invoiceAmount = payload.invoiceAmount;

      state.invoice.service = payload.service;
      state.invoice.sinceServiceYear = payload.sinceServiceYear;
      state.invoice.sinceServiceMonth = payload.sinceServiceMonth;
      state.invoice.toServiceYear = payload.toServiceYear;
      state.invoice.toServiceMonth = payload.toServiceMonth;

      state.invoice.income = payload.income;
      state.invoice.notIncome = payload.notIncome;
      state.invoice.otherIncome = payload.otherIncome;
      state.invoice.invoiceOtherDescription = payload.invoiceOtherDescription;
      state.invoice.invoiceFull = payload.invoiceFull;
      state.invoice.invoicePartial = payload.invoicePartial;
      state.invoice.invoiceDescription = payload.invoiceDescription;
      state.invoice.invoiceFullAmount = payload.invoiceFullAmount;
      state.invoice.invoicePartialAmount = payload.invoicePartialAmount;
      state.invoice.status = payload.status;
    }
  },
  actions: {
    updateE1: ({ commit }, payload) => {
      commit("updateE1", payload);
    },
    updateIncome: ({ commit }, payload) => {
      commit("updateIncome", payload);
    },
    updateNotIncome: ({ commit }, payload) => {
      commit("updateNotIncome", payload);
    },
    updateOtherIncome: ({ commit }, payload) => {
      commit("updateOtherIncome", payload);
    },
    updatInvoiceFull: ({ commit }, payload) => {
      commit("updatInvoiceFull", payload);
    },
    updatInvoicePartial: ({ commit }, payload) => {
      commit("updatInvoicePartial", payload);
    }
  }
});
