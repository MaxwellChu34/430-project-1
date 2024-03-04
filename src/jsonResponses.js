/*The following Javascript was borrowed from IGM-RichMedia-at-RIT/body-parse-example-done/src/jsonResponses.js and /head-request-example-done/src/jsonResponses.js. Additions were made so that there are two separate json objects and the GET function having a filter.*/

const questions = {};
const answers = {};
const headers = { 'Content-Type': 'application/json' };

//respondJSON is responsible for handling all physical JSON data
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

//respondJSONMeta is responsible for handling all meta JSON data
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, headers);
  response.end();
};

//addQuestions updates each question
const addQuestions = (request, response, body) => {
  const responseJSON = { message: 'All questions need to be filled out please.' };
  if (!body.q1 || !body.q2 || !body.q3 || !body.q4 || !body.q5) { //If there is no question in the input, a '400' code is returned
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  let responseCode = 204; //The current responseCode is 204, or updated
  if (!questions[body.name]) { //If there is nothing in the body, it is now 201 (created)
    responseCode = 201;
    questions[body.name] = {};
  } //Each of the questions is stored respectively in 'questions'
  questions[body.name].q1 = body.q1;
  questions[body.name].q2 = body.q2;
  questions[body.name].q3 = body.q3;
  questions[body.name].q4 = body.q4;
  questions[body.name].q5 = body.q5;
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

//addAnswers works almost exactly like addQuestions but with only one exception
const addAnswers = (request, response, body) => {
  const responseJSON = { message: 'All answers need to be filled out please.' };
  if (!body.a1 || !body.a2 || !body.a3 || !body.a4 || !body.a5) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  let responseCode = 204;
  if (!answers[body.name]) {
    responseCode = 201;
    answers[body.name] = {};
    answers[body.name].a1 = [];
    answers[body.name].a2 = [];
    answers[body.name].a3 = [];
    answers[body.name].a4 = [];
    answers[body.name].a5 = [];
  } //Instead of updated 'answers' each time, it adds onto 'answers' as an array
  answers[body.name].a1.push(body.a1);
  answers[body.name].a2.push(body.a2);
  answers[body.name].a3.push(body.a3);
  answers[body.name].a4.push(body.a4);
  answers[body.name].a5.push(body.a5);
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

//getData is responsible for gathering data for both 'questions' and 'answers'
const getData = (request, response, filter) => {
  let responseJSON; //The filter parameter determines which one to take
  if (filter === 'question') {
    responseJSON = { questions };
  } else if (filter === 'answer') {
    responseJSON = { answers };
  }
  return respondJSON(request, response, 200, responseJSON);
};

//getQuestionsMeta is the HEAD method for /getQuestions
const getQuestionsMeta = (request, response) => respondJSONMeta(request, response, 200);

//getAnswersMeta is the HEAD method for /getAnswers
const getAnswersMeta = (request, response) => respondJSONMeta(request, response, 200);

//notFound is called if the user inputs any url besides the ones found in the GET method in server.js
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  respondJSON(request, response, 404, responseJSON);
};

//notFoundMeta is the HEAD method for /notFound
const notFoundMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

module.exports = {
  addQuestions,
  addAnswers,
  getData,
  getQuestionsMeta,
  getAnswersMeta,
  notFound,
  notFoundMeta,
};
