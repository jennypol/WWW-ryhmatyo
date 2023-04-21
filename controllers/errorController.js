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
    res.render("error");
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

// set up a connection to your database
mongoose.connect('mongodb://localhost/my_database');

// add an error handler to the connection object
mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

// add Mongoose's built-in error handler middleware
mongoose.plugin((schema) => {
  schema.post('findOneAndDelete', (error, res, next) => {
    if (error) {
      console.error(`Mongoose error: ${error}`);
      next(error);
    }
  });
});
