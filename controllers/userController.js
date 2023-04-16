const { check, validationResult } = require('express-validator');
const User = require("../models/user"),
    passport = require("passport"),
    getUserParams = body => {
    return {
      name: body.name,
      email: body.email,
      userName: body.userName,
      password: body.password,
      age: body.age
    };
};
module.exports = {
    index: (req, res, next) => {
      User.find()
        .then(users => {
          res.locals.users = users;
          next();
        })
        .catch(error => {
          console.log(`Error fetching users: ${error.message}`);
          next(error);
        });
    },
    indexView: (req, res) => {
      res.render("users/index");
    },
    new: (req, res) => {
      res.render("users/new");
    },
    create: (req, res, next) => {
      if (req.skip) return next();
      let newUser = new User(getUserParams(req.body));
      User.register(newUser, req.body.password, (error, user) => {
        if (user) {
          req.flash("success", `${user.userName}'s account created successfully!`);
          res.locals.redirect = "/users";
          next();
        } else {
          req.flash("error", `Failed to create user account because: ${error.message}.`);
          res.locals.redirect = "/users/new";
          next();
        }
      }); 
    },
    redirectView: (req, res, next) => {
      let redirectPath = res.locals.redirect;
      if (redirectPath !== undefined) res.redirect(redirectPath);
      else next();
    },
    delete: (req, res, next) => {
      let userId = req.params.id;
      User.findByIdAndRemove(userId)
        .then(() => {
          res.locals.redirect = "/users";
          next();
        })
        .catch(error => {
          console.log(`Error deleting user by ID: ${error.message}`);
          req.flash("error", `Failed to delete user account because: ${error.message}.`);
          next();
        });
    },
    login: (req, res) => {
      res.render("users/login");
    },
    authenticate: passport.authenticate("local",  {
      failureRedirect: "/users/login",
      failureFlash: "Failed to login.",
      successRedirect: "/",
      successFlash: "Logged in!"
    }),
    validate: (req, res, next) => {
        req.normalizeEmail()
          .trim().escape()
          .check("email", "Email is invalid").isEmail();
        req.check("userName", "Username can't be empty").notEmpty().trim().escape();
        req.check("password", "Password can't be empty").notEmpty().trim().escape();
        req
          .check("age", "invalid age")
          .notEmpty()
          .isInt()
          .equals(req.body.age);
          
        req.validationResult().then(error => {
            if (!error.isEmpty()) {
              let messages = error.array().map(e => e.msg);
              req.skip = true;
              req.flash("error", messages.join(" and "));
              res.locals.redirect = "/users/new";
              next();
            } else {
              next();
            }
        });  
    },
    logout: (req, res, next) => {
      req.logout(function(err) {
        if(err) {return next(err);
        }else{
          req.flash("success", "You have been logged out!");
          res.locals.redirect = "/";
          next();
        }
      });
    }     
};      