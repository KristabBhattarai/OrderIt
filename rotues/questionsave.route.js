const sanitize = require("mongo-sanitize");

const Question = require("../models/Questions");

const questionsave = async (serverid, module, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10) => {
  try {
    /*
      serverid: "saiodg9owh9f8hdsoif"
      module: "order"
      q1: "What is the first step in the order process?"
      q2: "What is the second step in the order process?"
      q3: "What is the third step in the order process?"
      q4: "What is the fourth step in the order process?"
      q5: "What is the fifth step in the order process?"
    */
    const serverId = sanitize(serverid);
    const moduleName = sanitize(module);
    const question1 = sanitize(q1);
    const question2 = sanitize(q2);
    const question3 = sanitize(q3);
    const question4 = sanitize(q4);
    const question5 = sanitize(q5);
    const question6 = sanitize(q6);
    const question7 = sanitize(q7);
    const question8 = sanitize(q8);
    const question9 = sanitize(q9);
    const question10 = sanitize(q10);


    const questionsArray = [
      question1, // what is the first step in the order process?
      question2, // what is the second step in the order process?
      question3, // undefined || ""
      question4, // undefined || ""
      question5, //what is the fifth step in the order process?
      question6,
      question7,
      question8,
      question9,
      question10,
    ];

    let questions = [];

    for (let i = 1; i <= questionsArray.length; i++) {
      if (questionsArray[i - 1] === undefined || questionsArray[i - 1] === "") {
        continue;
      }

      questions.push({
        qno: i,
        question: questionsArray[i - 1].toString(),
        module: moduleName.toString(),
      });
    }

    //check if server exists
    const servers = await Question.find({});

    for (let serverNo = 0; serverNo < servers.length; serverNo++) {
      if (servers[serverNo].serverId === serverId) {
        //server exists
        //update the questions array
        const savedQuestions = servers[serverNo].questions;

        for (let i = 0; i < questions.length; i++) {
          const question = questions[i];
          const qno = question.qno;
          const module = question.module;
          const questionText = question.question;

          const questionExists = savedQuestions.find((savedQuestion) => {
            return savedQuestion.qno === qno && savedQuestion.module === module;
          });

          if (
            questionExists !== undefined &&
            questionExists.qno === qno &&
            questionExists.module === module
          ) {
            //update the question text
            questionExists.question = questionText;
          } else {
            savedQuestions.push(question);
          }
        }
        servers[serverNo].questions = savedQuestions;
        await servers[serverNo].save();

        return;
      }
    }

    //server does not exist
    //create a new server

    const question = new Question({
      serverId: serverId,
      questions: questions,
    });

    await question.save();
  } catch (error) {}
};

module.exports = questionsave;
