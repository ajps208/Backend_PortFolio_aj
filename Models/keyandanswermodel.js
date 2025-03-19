const mongoose = require("mongoose");
const keyandanswerModel = new mongoose.Schema({
  keys: [{ type: String, required: true }],
  answer: { type: String, required: true },
  synonyms: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const keyandanswers = mongoose.model("keyandanswers", keyandanswerModel);
module.exports = keyandanswers;
