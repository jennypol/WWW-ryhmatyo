const express = require("express");
const app = express();
const homeRoutes = require('./routes/homeRoutes'); //added

const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const passport = require("passport");
const homeController = require("./controllers/homeController");

const router = express.Router();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use('/', homeRoutes); //modified

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

//vaihda nämä kaksi router.use ja router.get kun reitit on määritelty.
router.use(homeController.logRequestPaths);
router.get("/", homeController.index);
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
