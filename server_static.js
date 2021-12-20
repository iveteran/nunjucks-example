const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');

app = express()
app.use(morgan('tiny')) // logger

var dist = process.env.NODE_PATH ? process.env.NODE_PATH + '/dist' : 'dist';
app.use(express.static(dist))

// Define port to run server on
var port = process.env.PORT || 8084;

// Start server
app.listen(port);
console.log('Listening on port %s...', port);
