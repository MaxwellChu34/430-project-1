/*The following Javascript was borrowed from IGM-RichMedia-at-RIT/body-parse/example-done/src/server.js. Additions were made so that the server can receive HEAD requests as well.*/

const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//parseBody breaks down what is being posted to a json object
const parseBody = (request, response, handler) => {
  const body = [];
  request.on('error', (err) => { //If there's an error, this function ends abruptly
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });
  request.on('data', (chunk) => { //Every time theres something new, it will push into an array
    body.push(chunk);
  });
  request.on('end', () => { //At the end of what is received, a new function is called with the parsed data
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);
    handler(request, response, bodyParams);
  });
};

//handlePost takes care of two POST methods, adding either data to questions or answers
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addQuestions') {
    parseBody(request, response, jsonHandler.addQuestions);
  } else if (parsedUrl.pathname === '/addAnswers') {
    parseBody(request, response, jsonHandler.addAnswers);
  }
};

//handleHead takes care of all HEAD methods, sending '200' response codes for getting questions or answers and '400' for anything else
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getQuestions') {
    jsonHandler.getQuestionsMeta(request, response);
  } else if (parsedUrl.pathname === '/getAnswers') {
    jsonHandler.getAnswersMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

//handleGet takes care of all GET methods
//This includes html and css pages
//JSON data is received if the page wants questions and/or answers
//Each of these pathnames can be put in the URL, anything else will result in notFound
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/createdForm') {
    htmlHandler.getForm(request, response);
  } else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getQuestions') {
    jsonHandler.getData(request, response, 'question');
  } else if (parsedUrl.pathname === '/getAnswers') {
    jsonHandler.getData(request, response, 'answer');
  } else {
    jsonHandler.notFound(request, response);
  }
};

//onRequest determines if the method is POST, HEAD, or GET
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

//createServer starts the server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
