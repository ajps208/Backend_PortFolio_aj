const mongoose = require("mongoose");
const QuestionsModel = new mongoose.Schema({
    question: { type: String, required: true },
});

const questions = mongoose.model("questions", QuestionsModel);
module.exports = questions;
