import "../scss/styles.scss";
import { budgetController } from "./budgetController";
import { UIController } from "./UIController";
import ctrlAddItem from "./ctrlAddItem";
import { DOMStrings } from "./domStrings";

const controller = ((budgetCtrl, UICtrl) => {
  let setupEventListeners = () => {
    document
      .querySelector(DOMStrings.addItemButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", (e) => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOMStrings.inputType)
      .addEventListener("change", UIController.changedAddBtnLabel);

  };

  return {
    init: async () => {
      await UIController.fetchData();
      UIController.getDate();
      UIController.populateYearList();
      UIController.populateMonthList();
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
