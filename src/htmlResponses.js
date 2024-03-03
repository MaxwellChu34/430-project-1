const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const form = fs.readFileSync(`${__dirname}/../client/client2.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getForm = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(form);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(css);
  response.end();
};

module.exports = {
  getIndex,
  getForm,
  getCSS,
};
