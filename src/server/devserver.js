var express = require('express');
var app = express();

// app.use(express.logger('dev'));
app.use(function staticsPlaceholder(req, res, next) {
    next();
});
app.use(function middlewarePlaceholder(req, res, next) {
    next();
});
module.exports = app;

