const express   = require('express'),
    app         = express(),
    nunjucks    = require('nunjucks');

// Define port to run server on
var port = process.env.PORT || 8084;

// Configure Nunjucks
var views = process.env.NODE_PATH ? process.env.NODE_PATH + '/src/views' : 'src/views';
nunjucks.configure(views, {
    autoescape: true,
    cache: false,
    express: app
});
// Set Nunjucks as rendering engine for pages with .njk suffix
app.engine('njk', nunjucks.render) ;
app.set('view engine', 'njk');

// Respond to all GET requests by rendering relevant page using Nunjucks
app.get('/:page', function(req, res) {
    res.render(req.params.page, {name: 'blued'});
});

// Start server
app.listen(port);
console.log('Listening on port %s...', port);
