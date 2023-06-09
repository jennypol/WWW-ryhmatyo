const express = require("express");
const app = express();
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const passport = require("passport");
const homeController = require("./controllers/homeController");
const usersController = require("./controllers/userController");
const contactController = require("./controllers/contactController");
const errorController = require("./controllers/errorController");
Contact = require("./models/contact");
const router = express.Router();
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/travel_db");
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use('/', router); 
app.use('/signin', router);
app.use('/contact', router);
app.use('/news', router);
app.use('/stories', router);

router.use(express.static("public"));
router.use(layouts);
router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);
router.use(express.json());
router.use(cookieParser("secret_passcode"));
router.use(layouts);
router.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

router.use(passport.initialize());
router.use(passport.session());
let User = require("./models/user");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(connectFlash());

router.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});


router.use(homeController.logRequestPaths);
router.get("/", homeController.index);
router.get("/news", homeController.news);
router.get("/stories", homeController.stories);

router.get("/contact", contactController.contact);
router.get("/thanks", contactController.thanks);
router.post("/contact/create", contactController.create, contactController.redirectView);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView
);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);

router.use(errorController.logErrors);
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

module.exports = router;
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
