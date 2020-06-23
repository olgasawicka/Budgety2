import { postData } from "./axios";
import { UIController } from "./UIController";

export const budgetController = (() => {
  return {
    addItem: async (budgetyItem) => {
      await postData(`${budgetyItem.type}s`, budgetyItem);
      await UIController.refetchData(budgetyItem.type);
    },

    deleteBudgetyItem: async (itemId, endpoint) => {
      await deleteItem(`${endpoint}s`, itemId);
      await UIController.refetchData(endpoint);
    }
  };
})();
