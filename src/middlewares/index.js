const express = require('express');
const tokenMiddleware = require('@middlewares/tokenMiddleware');

module.exports = function applyMiddlewares(app) {
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(tokenMiddleware.verifyAuthIdToken);
};
