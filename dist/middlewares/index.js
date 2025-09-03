import express from 'express';
import tokenMiddleware from './authMiddleware';
export default function applyMiddlewares(app) {
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(tokenMiddleware.verifyAuthIdToken);
}
;
