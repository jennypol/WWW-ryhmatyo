const mongoose = require("mongoose"),
{ Schema } = mongoose;

var contactSchema = new Schema({
    name: {
        first: {type: String, required: true}, 
        last: {type: String, required: true}
    },
    email: {type: String, required: true},
    feedback: {type: String, required: true}
})

module.exports = mongoose.model("Contact", contactSchema);