const http = require('http');
const url = require('url');
const querystring = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
    const body = [];
    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });
    request.on('data', (chunk) => {
        body.push(chunk);
    });
    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        const bodyParams = querystring.parse(bodyString);
        handler(request,response, bodyParams);
    });
};

const handlePost = (request, response, parsedUrl) => {
    if(parsedUrl.pathname === '/createFormat') {
        parseBody(request, response, jsonHandler.addUser);
    }
};

const handleHead = (request, response) => {
    jsonHandler.notFoundMeta(request, response);
};

const handleGet = (request, response, parsedUrl) => {
    if(parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
    } else if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
    } else {
        jsonHandler.notFound(request, response);
    }
};

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);
    if(request.method === 'POST') {
        handlePost(request, response, parsedUrl);
    } else if(request.method === 'HEAD') {
        handleHead(request, response, parsedUrl);
    } else {
        handleGet(request, response, parsedUrl);
    }
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
}); 