const questions = require("../Models/QuestionModel");

exports.getQuestions = async (req, res) => {
    try {
        const questionsData = await questions.find();
        res.json(questionsData);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Failed to fetch questions" });
    }
}