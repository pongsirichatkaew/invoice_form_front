import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //All the property
    e1: 1,
    dialog: false,
    infoDialog: false,
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
      status: "",
      comment: ""
    },
    props: [],
    my_invoice: {
      invoiceDoc: "",
      invoiceNumber: "",
      customerId: "",
      customerName: "",
      income: true,
      notIncome: false,
      otherIncome: false,
      invoiceOtherDescription: "",
      invoiceFull: true,
      invoicePartial: false,
      invoiceDescription: "",
      invoiceFullAmount: "",
      invoicePartialAmount: "",
      status: "",
      comment: "",
      invoice: [
        {
          invoiceSlip: "",
          soNumber: "",
          invoiceAmount: "",
          service: "",
          from_date: "",
          to_date: "",
          menuStart: false,
          menuStop: false
        }
      ]
    },
    lastInvoiceDoc: ""
  },
  getters: {
    e1: state => {
      return state.e1;
    },
    income: state => {
      if (state.my_invoice.income === 1 || state.my_invoice.income === true) {
        return true;
      }
      return false;
    },
    notIncome: state => {
      if (
        state.my_invoice.notIncome === 1 ||
        state.my_invoice.notIncome === true
      ) {
        return true;
      }
      return false;
    },
    otherIncome: state => {
      if (
        state.my_invoice.otherIncome === 1 ||
        state.my_invoice.otherIncome === true
      ) {
        return true;
      }
      return false;
    },
    invoiceFull: state => {
      if (
        state.my_invoice.invoiceFull === 1 ||
        state.my_invoice.invoiceFull === true
      ) {
        return true;
      }
      return false;
    },
    invoicePartial: state => {
      if (
        state.my_invoice.invoicePartial === 1 ||
        state.my_invoice.invoicePartial === true
      ) {
        return true;
      }
      return false;
    }
  },
  mutations: {
    updateE1: (state, payload) => {
      state.e1 = payload;
    },
    updateIncome: (state, payload) => {
      state.my_invoice.income = payload;
    },
    updateNotIncome: (state, payload) => {
      state.my_invoice.notIncome = payload;
    },
    updateOtherIncome: (state, payload) => {
      state.my_invoice.otherIncome = payload;
    },
    updatInvoiceFull: (state, payload) => {
      state.my_invoice.invoiceFull = payload;
    },
    updatInvoiceFullAmount: (state, payload) => {
      state.my_invoice.invoiceFullAmount = payload;
    },
    updatInvoicePartial: (state, payload) => {
      state.my_invoice.invoicePartial = payload;
    },
    updatInvoicePartialAmount: (state, payload) => {
      state.my_invoice.invoicePartialAmount = payload;
    },
    updateDialog: (state, payload) => {
      state.dialog = payload;
    },
    updateInfoDialog: (state, payload) => {
      state.infoDialog = payload;
    },
    updateUpdatedialog: (state, payload) => {
      state.updateDialog = payload;
    },
    updateLastInvoiceDoc: (state, payload) => {
      state.lastInvoiceDoc = payload;
    },
    clearFormData: state => {
      state.e1 = 1;
      state.lastInvoiceDoc = "";

      state.my_invoice.invoiceNumber = "";
      state.my_invoice.customerId = "";
      state.my_invoice.customerName = "";

      state.my_invoice.income = true;
      state.my_invoice.notIncome = false;
      state.my_invoice.otherIncome = false;
      state.my_invoice.invoiceOtherDescription = "";
      state.my_invoice.invoiceFull = true;
      state.my_invoice.invoicePartial = false;
      state.my_invoice.invoiceDescription = "";
      state.my_invoice.invoiceFullAmount = "";
      state.my_invoice.invoicePartialAmount = "";
      state.my_invoice.status = "";

      state.my_invoice.comment = "";
      state.my_invoice.invoice = [
        {
          invoiceSlip: "",
          soNumber: "",
          invoiceAmount: "",
          service: "",
          startDate: "",
          stopDate: ""
        }
      ];
    },
    updateInvoiceInfo: (state, payload) => {
      state.lastInvoiceDoc = payload.invoiceDoc;
      state.my_invoice.invoiceDoc = payload.invoiceDoc;

      state.my_invoice.invoiceNumber = payload.invoiceNumber;
      state.my_invoice.customerId = payload.customerId;
      state.my_invoice.customerName = payload.customerName;

      state.my_invoice.income = payload.income;
      state.my_invoice.notIncome = payload.notIncome;
      state.my_invoice.otherIncome = payload.otherIncome;
      state.my_invoice.invoiceOtherDescription =
        payload.invoiceOtherDescription;
      state.my_invoice.invoiceFull = payload.invoiceFull;
      state.my_invoice.invoicePartial = payload.invoicePartial;
      state.my_invoice.invoiceDescription = payload.invoiceDescription;
      state.my_invoice.invoiceFullAmount = payload.invoiceFullAmount;
      state.my_invoice.invoicePartialAmount = payload.invoicePartialAmount;
      state.my_invoice.status = payload.status;

      state.my_invoice.comment = payload.comment;
      state.my_invoice.invoice = payload.invoice;
    },
    updateProps: (state, payload) => {
      console.log("store", payload);
      console.log("store", state.my_invoice);
      state.my_invoice.invoice = payload;
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
    },
    addMyinvoice: ({ commit }, playload) => {
      commit("addMyinvoice", playload);
    }
  }
});
