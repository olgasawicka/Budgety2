import { UIController } from "./UIController";
import { budgetController } from "./budgetController";
import { DOMStrings } from "./domStrings";

const ctrlAddItem = () => {
  const budgetyItem = {
    year: document.querySelector(DOMStrings.inputYear).value,
    month: document.querySelector(DOMStrings.inputMonth).value,
    type: document.querySelector(DOMStrings.inputType).value,
    description: document.querySelector(DOMStrings.inputDescription).value,
    value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
  };

  if (
    budgetyItem.description !== "" &&
    !isNaN(budgetyItem.value) &&
    budgetyItem.value > 0
  ) {
    budgetController.addItem(budgetyItem);

    UIController.clearFields();
  }
};
export default ctrlAddItem;
