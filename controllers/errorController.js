"use strict";

const httpStatus = require("http-status-codes");
const mongoose = require('mongoose');

module.exports = {
  logErrors: (error, req, res, next) => {
    console.error(error.stack);
    next(error);
  },

  pageNotFoundError: (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.send(`${errorCode} | The page does not exist!`);
  },

  internalServerError: (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occurred: ${error.stack}`);
    res.status(errorCode);
    res.send(`${errorCode} | Sorry, our application is experiencing a problem!`);
  },

  mongooseErrors: (error, req, res, next) => {
    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      res.status(httpStatus.BAD_REQUEST).json({ errors });
    } else {
      next(error);
    }
  }
};

