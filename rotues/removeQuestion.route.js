const sanitize = require("mongo-sanitize");

const Question = require("../models/Questions");

const removeQuestion = async (serverId, module, qno) => {
  try {
    /*
        serverId: 234234234234
        qno: 1,
        module: "order",
    */

    const server = sanitize(serverId);
    const questionNumber = sanitize(parseInt(qno));
    const moduleName = sanitize(module);

    const question = await Question.findOne({
      serverId: server,
    });
    //server not found
    if (question === null) {
      return;
    }

    //get questions array
    const questions = question.questions;

    //get questions without the qno and moduleName
    const questionsWithoutQnoAndModuleName = questions.filter((question) => {
      return question.qno !== questionNumber || question.module !== moduleName;
    });

    //update the questions array
    question.questions = questionsWithoutQnoAndModuleName;

    //save the question
    await question.save();

    return;
  } catch (error) {}
};

module.exports = removeQuestion;
