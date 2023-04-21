const Contact = require("../models/contact"),
    getContactParams = body => {
    return {
      name: {
         first: body.first,
         last: body.last
      },
      email: body.email,
      feedback: body.feedback
    };
};

module.exports ={
contact: (req, res) => {
    res.render("contact/contact");
},

create: (req, res, next) => {
    let newContact = new Contact(getContactParams(req.body));
    Contact.create(newContact)
    .then(contact => {
        res.locals.redirect = "/thanks";
        res.locals.contact = contact;
        next();
      })
      .catch(error => {
        console.log(`Error saving contact: ${error.message}`);
        next(error);
      });
},
thanks: (req, res) => {
  res.render("contact/thanks");
},
redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
}
}
