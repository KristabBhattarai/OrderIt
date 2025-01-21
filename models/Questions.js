const mongoose = require("mongoose");

const QuestionModel = new mongoose.Schema({
  serverId: {
    type: String,
  },

  questions: [
    {
      qno: {
        type: Number,
      },
      question: {
        type: String,
        maxlength: 1000,
      },
      module: {
        type: String,
        maxlength: 1000,
      },
    },
  ],
});

module.exports = Question = mongoose.model("Question", QuestionModel);
