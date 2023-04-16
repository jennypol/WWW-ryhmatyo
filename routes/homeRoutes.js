const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.index);
router.get("/news", homeController.news);
router.get("/stories", homeController.stories);

module.exports = router;
