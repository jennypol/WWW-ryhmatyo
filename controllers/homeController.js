module.exports = {
    logRequestPaths: (req, res, next) => {
      console.log(`request made to: ${req.url}`);
      next();
    },
    sendReqParam: (req, res) => {
      let veg = req.params.vegetable;
      res.send(`This is the page for ${veg}`);
    },
    respondWithName: (req, res) => {
      res.render("index");
    },
    index: (req, res) => {
      res.render("index");
    },
    news: (req, res) => {
      res.render("news");
    },
    stories: (req, res) => {
      res.render("stories");
    },
    contact: (req, res) => {
        res.render("contact");
    },
    thanks: (req, res) => {
      res.render("thanks");
    }
  };
  