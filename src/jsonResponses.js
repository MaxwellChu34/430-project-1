const questions = {};

const respondJSON = (request, response, status, object) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
    response.end();
};

const respondJSONMeta = (request, response, status) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end();
};

/*
const getUsers = (request, response) => {
    const responseJSON = { questions, };
    respondJSON(request, response, 200, responseJSON);
};

const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);
*/
const createFormat = (request, response, body) => {
    const responseJSON = {message: 'All boxes should be filled out.',};
    if(!body.question1 || !body.question2 || !body.question3 || !body.question4 || !body.question5) {
        responseJSON.id = 'missingParams';
        return respondJSON(request, response, 400, responseJSON);
    }
    let responseCode = 204;
    if(!questions[body]) {
        responseCode = 201;
        questions[body] = {};
    }
    questions[body].question1 = body.question1;
    questions[body].question2 = body.question2;
    questions[body].question3 = body.question3;
    questions[body].question4 = body.question4;
    questions[body].question5 = body.question5;
    if(responseCode === 201) {
        responseJSON.message = 'Created Successfully';
        return respondJSON(request, response, responseCode, responseJSON);
    }
    return respondJSONMeta(request, response, responseCode);
};

/*
const updateUser = (request, response) => {
    const newUser = {createdAt: Date.now(),};
    questions[newUser.createdAt] = newUser;
    return respondJSON(request, response, 201, newUser);
};
*/
const notFound = (request, response) => {
    const responseJSON = {message: 'The page you are looking for was not found.', id: 'notFound',};
    respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
    //getUsers,
    //getUsersMeta,
    createFormat,
    //updateUser,
    notFound,
    notFoundMeta,
};