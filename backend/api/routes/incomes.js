const express = require("express");
const router = express.Router();
const IncomeController = require("../controllers/incomes");

const Income = require("../models/income");

router.get("/", IncomeController.incomes_get_all);

router.post("/", IncomeController.incomes_create_income);

router.get("/:incomeId", IncomeController.incomes_get_income);

router.patch("/:incomeId", IncomeController.incomes_update_income);

router.delete("/:incomeId", IncomeController.incomes_delete_income);

module.exports = router;
