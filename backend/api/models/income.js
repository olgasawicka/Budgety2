const mongoose = require("mongoose");

const incomeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  year: { type: Number, required: true },
  month: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: Number, required: true },
});

module.exports = mongoose.model("Income", incomeSchema);
