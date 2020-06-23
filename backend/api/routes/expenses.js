const express = require("express");
const router = express.Router();
const ExpenseController = require("../controllers/expenses");

const Expense = require("../models/expense");

router.get("/", ExpenseController.expenses_get_all);

router.post("/", ExpenseController.expenses_create_expense);

router.get("/:expenseId", ExpenseController.expenses_get_expense);

router.patch("/:expenseId", ExpenseController.expenses_update_expense);

router.delete("/:expenseId", ExpenseController.expenses_delete_expense);

module.exports = router;
