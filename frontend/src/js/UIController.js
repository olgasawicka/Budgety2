import axios from "axios";
import { deleteItem } from "./axios";
import { DOMStrings } from "./domStrings";
import { formatNumber } from "./formatNumber";
import { displayDate } from "./displayDate";

export const UIController = (() => {
  const nodeListForEach = (nodeList, callback) => {
    for (var i = 0; i < nodeList.length; i++) {
      callback(nodeList[i], i);
    }
  };

  let totalIncomes;
  let totalExpenses;
  let addedIncomeItems;
  let addedExpenseItems;
  let budget;

  const calcBudget = () => {
    budget = totalIncomes - totalExpenses;
    const budgetPlusMinus = budget > 0 ? "income" : "expense";

    document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
      budget,
      budgetPlusMinus
    );
    document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
      totalIncomes,
      "income"
    );
    document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(
      totalExpenses,
      "expense"
    );

    const percentage =
      totalIncomes > 0 ? Math.round((totalExpenses / totalIncomes) * 100) : 0;
    percentage > 0
      ? (document.querySelector(
          DOMStrings.percentageLabel
        ).textContent = `${percentage}%`)
      : (document.querySelector(DOMStrings.percentageLabel).textContent =
          "---");
  };

  const updatePercentages = () => {
    const incomePercentages = document.querySelectorAll(".incomes-list .item");
    const expensePercentages = document.querySelectorAll(
      ".expenses-list .item"
    );
    Array.from(incomePercentages).map((item) => {
      const itemId = item.getAttribute("data-id");
      const itemValue = addedIncomeItems.find(
        (element) => element._id === itemId
      );
      const newPercentage =
        totalIncomes > 0 ? (itemValue.value / totalIncomes) * 100 : 0;

      item.querySelector(".item__percentage").innerHTML =
        newPercentage > 0 ? `${newPercentage.toFixed(2)}%` : "---";
    });

    Array.from(expensePercentages).map((item) => {
      const itemId = item.getAttribute("data-id");
      const itemValue = addedExpenseItems.find(
        (element) => element._id === itemId
      );
      const newPercentage =
        totalIncomes > 0 ? (itemValue.value / totalIncomes) * 100 : 0;

      item.querySelector(".item__percentage").innerHTML =
        newPercentage > 0 ? `${newPercentage.toFixed(2)}%` : "---";
    });
  };

  const onItemDelete = () => {
    const deleteBtns = document.querySelectorAll(".item__delete");
    deleteBtns.forEach((btn) =>
      btn.addEventListener("click", async () => {
        const item = event.target.closest("li");
        const itemId = item.getAttribute("data-id");
        const itemList = event.target.closest("ul");
        const endpoint = itemList.getAttribute("id");
        await deleteItem(itemId, endpoint);

        item.parentNode && item.parentNode.removeChild(item);
        const refetchedData = await axios.get(
          `http://localhost:4000/${endpoint}`
        );

        if (endpoint === "incomes")
          totalIncomes = refetchedData.data.incomes.reduce((acc, currValue) => {
            return acc + currValue.value;
          }, 0);

        if (endpoint === "expenses")
          totalExpenses = refetchedData.data.expenses.reduce(
            (acc, currValue) => {
              return acc + currValue.value;
            },
            0
          );

        calcBudget();
        updatePercentages();

        if (refetchedData.data.count === 0) {
          endpoint === "incomes" &&
            document
              .querySelector(DOMStrings.incomesEmpty)
              .classList.add("show");
          endpoint === "expenses" &&
            document
              .querySelector(DOMStrings.expensesEmpty)
              .classList.add("show");
        }
      })
    );
  };

  const createListItem = (itemData, type) => {
    const percentage =
      totalIncomes > 0 ? (itemData.value / totalIncomes) * 100 : 0;

    const li = `<li class="item" data-id=${itemData._id}>
   <div class="item__description">${itemData.description}</div>
   <div class="item__value">${formatNumber(itemData.value, type)}</div>
   <div class="item__percentage">${
     percentage > 0 ? `${percentage.toFixed(2)}%` : "---"
   }</div>
   <div class="item__delete">
<img src="../images/delete.png" alt="delete icon"/>
   </div>
 </li>`;
    return li;
  };

  return {
    fetchData: async () => {
      const [incomes, expenses] = await axios.all([
        axios.get("http://localhost:4000/incomes"),
        axios.get("http://localhost:4000/expenses"),
      ]);

      if (incomes.data.incomes) {
        const incomesArr = incomes.data.incomes;
        totalIncomes = incomesArr.reduce((acc, currValue) => {
          return acc + currValue.value;
        }, 0);

        if (!incomesArr.length) {
          document.querySelector(DOMStrings.incomesEmpty).classList.add("show");
        } else {
          incomesArr.map((income) =>
            document
              .querySelector(DOMStrings.incomesList)
              .insertAdjacentHTML("beforeend", createListItem(income, "income"))
          );
          addedIncomeItems = incomesArr;
          onItemDelete();
        }
      }

      if (expenses.data.expenses) {
        const expensesArr = expenses.data.expenses;
        totalExpenses = expensesArr.reduce((acc, currValue) => {
          return acc + currValue.value;
        }, 0);

        if (!expensesArr.length) {
          document
            .querySelector(DOMStrings.expensesEmpty)
            .classList.add("show");
        } else {
          expensesArr.map((expense) =>
            document
              .querySelector(DOMStrings.expensesList)
              .insertAdjacentHTML(
                "beforeend",
                createListItem(expense, "expense")
              )
          );
          addedExpenseItems = expensesArr;
        }
      }
      calcBudget();
      onItemDelete();
    },

    refetchData: async (budgetyItemType) => {
      const refetchedData = await axios.get(
        `http://localhost:4000/${budgetyItemType}s`
      );

      if (budgetyItemType === "income") {
        const refetchedIncomes = refetchedData.data.incomes;
        let newItem;

        if (refetchedData.data.count === 1) {
          document
            .querySelector(DOMStrings.incomesEmpty)
            .classList.remove("show");
          newItem = refetchedIncomes[0];
          totalIncomes = newItem.value;
        }

        if (refetchedData.data.count > 1) {
          totalIncomes = refetchedIncomes.reduce((acc, currValue) => {
            return acc + currValue.value;
          }, 0);

          newItem = refetchedIncomes.filter(
            ({ _id: idOne }) =>
              !addedIncomeItems.some(({ _id: idTwo }) => idTwo === idOne)
          )[0];
        }
        document
          .querySelector(DOMStrings.incomesList)
          .insertAdjacentHTML("beforeend", createListItem(newItem, "income"));
        addedIncomeItems = refetchedIncomes;
      }

      if (budgetyItemType === "expense") {
        const refetchedExpenses = refetchedData.data.expenses;
        let newItem;

        if (refetchedData.data.count === 1) {
          document
            .querySelector(DOMStrings.expensesEmpty)
            .classList.remove("show");
          newItem = refetchedExpenses[0];
        }

        if (refetchedData.data.count > 1) {
          totalExpenses = refetchedExpenses.reduce((acc, currValue) => {
            return acc + currValue.value;
          }, 0);

          newItem = refetchedExpenses.filter(
            ({ _id: idOne }) =>
              !addedExpenseItems.some(({ _id: idTwo }) => idTwo === idOne)
          )[0];
        }

        document
          .querySelector(DOMStrings.expensesList)
          .insertAdjacentHTML("beforeend", createListItem(newItem, "expense"));

        addedExpenseItems = refetchedExpenses;
      }

      calcBudget();
      onItemDelete();
      updatePercentages();
    },

    changedAddBtnLabel: () => {
      const label = event.target.value;
      const form = document.querySelector(DOMStrings.form);
      label === "expense"
        ? form.classList.add("expense")
        : form.classList.remove("expense");
      document.querySelector(DOMStrings.addItemButtonLabel).innerHTML = label;
    },

    clearFields: () => {
      let fields, fieldsArr;

      fields = document.querySelectorAll(
        `${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`
      );
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((item) => {
        item.value = "";
      });

      fieldsArr[0].focus();
    },

    getDate: () => {
      document.querySelector(DOMStrings.dateLabel).textContent = `${
        displayDate().month
      } ${displayDate().year}`;
    },

    populateYearList: () => {
      const currentYear = new Date().getFullYear();
      for (let i = currentYear; i >= 2000; i--) {
        const option = `<option value=${i} ${
          i === currentYear ? "selected" : null
        }>${i}</option>`;
        document.querySelector(".year").insertAdjacentHTML("beforeend", option);
      }
    },

    populateMonthList: () => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      months.forEach((month) => {
        const currMonth = new Date().getMonth();
        const option = `<option value=${month} ${
          month === months[currMonth] ? "selected" : null
        }>${month}</option>`;
        document
          .querySelector(".month")
          .insertAdjacentHTML("beforeend", option);
      });
    },
  };
})();
