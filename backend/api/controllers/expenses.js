const mongoose = require("mongoose");
const Expense = require("../models/expense");

exports.expenses_get_all = (req, res, next) => {
  Expense.find()
    .select("year month description value")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        expenses: docs.map((doc) => {
          return {
            _id: doc.id,
            year: doc.year,
            month: doc.month,
            description: doc.description,
            value: doc.value,
            request: {
              type: "GET",
              url: "localhost:4000/expenses/" + doc.id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.expenses_create_expense = (req, res, next) => {
  const expense = new Expense({
    _id: new mongoose.Types.ObjectId(),
    year: req.body.year,
    month: req.body.month,
    description: req.body.description,
    value: req.body.value,
  });
  expense
    .save()
    .then((result) => {
      res.status(201).json({
        message: "New Expense created",
        createdExpense: {
          _id: result._id,
          year: result.year,
          month: result.month,
          description: result.description,
          value: result.value,
          request: {
            type: "GET",
            url: "localhost:4000/expenses/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.expenses_get_expense = (req, res, next) => {
  const id = req.params.expenseId;
  Expense.findById(id)
    .select("_id year month description value")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          expense: doc,
          request: {
            type: "GET",
            url: "http://localhost:4000/expenses",
          },
        });
      } else {
        res.status(404).json({ message: "No entry found!" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.expenses_update_expense = (req, res, next) => {
  const id = req.params.expenseId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Expense.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Expense has been updated",
        request: {
          type: "GET",
          url: "localhost:4000/expenses/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.expenses_delete_expense = (req, res, next) => {
  const id = req.params.expenseId;
  Expense.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Expense deleted",
        request: {
          type: "POST",
          url: "http://localhost:4000/expenses",
          body: {
            year: "String",
            month: "String",
            description: "String",
            value: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
