const sanitize = require("mongo-sanitize");

const Question = require("../models/Questions");

const getQuestions = async (serverId, moduleName, qno) => {
  try {
    /*
        serverId: 234234234234,
        moduleName: "order",
        qno: 1,
    */

    const server = sanitize(serverId);
    const name = sanitize(moduleName);
    const qNo = sanitize(parseInt(qno));

    const question = await Question.findOne({
      serverId: server,
    });

    //server not found
    if (question === null) {
      return;
    }

    //get questions array
    const questions = question.questions;
    let quest;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].module == name && questions[i].qno == qNo) {
        return (quest = questions[i].question);
      }
    }
    // console.log("In get file - " + quest);
  } catch (error) {}
};

module.exports = getQuestions;
