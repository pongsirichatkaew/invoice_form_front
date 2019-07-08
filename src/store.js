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
      invoiceFull: true,
      invoicePartial: false,
      invoiceDescription: "",
      invoiceFullAmount:"",
      invoicePartialAmount:"",
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
    }
  },
  mutations: {
    //method
    //commit('increment')

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
    }
  }
});
