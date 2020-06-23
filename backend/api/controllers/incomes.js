const mongoose = require("mongoose");

const Income = require("../models/income");

exports.incomes_get_all = (req, res, next) => {
  Income.find()
    .select("year month description value")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        incomes: docs.map((doc) => {
          return {
            _id: doc.id,
            year: doc.year,
            month: doc.month,
            description: doc.description,
            value: doc.value,
            request: {
              type: "GET",
              url: "localhost:4000/incomes/" + doc.id,
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

exports.incomes_create_income = (req, res, next) => {
  const income = new Income({
    _id: new mongoose.Types.ObjectId(),
    year: req.body.year,
    month: req.body.month,
    description: req.body.description,
    value: req.body.value,
  });
  income
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Income created",
        createdIncome: {
          _id: result._id,
          year: result.year,
          month: result.month,
          description: result.description,
          value: result.value,
          request: {
            type: "GET",
            url: "localhost:4000/incomes/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.incomes_get_income = (req, res, next) => {
  const id = req.params.incomeId;
  Income.findById(id)
    .select("_id year month description value")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
          income: doc,
          request: {
            type: "GET",
            url: "http://localhost:4000/incomes",
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

exports.incomes_update_income = (req, res, next) => {
  const id = req.params.incomeId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Income.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Income has been updated",
        request: {
          type: "GET",
          url: "localhost:4000/incomes/" + id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.incomes_delete_income = (req, res, next) => {
  const id = req.params.incomeId;
  Income.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Income deleted",
        request: {
          type: "POST",
          url: "http://localhost:4000/incomes",
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
