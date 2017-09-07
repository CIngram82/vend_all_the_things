const express = require('express');
const server = express();
const bodyparse = require('body-parser');
const routes = require('./routes');

server.use(bodyparse.urlencoded({
  extended: false
}));

server.listen(3000, function() {
  console.log('Vending the API');
});

// Set up routes
routes(server);
