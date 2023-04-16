const mongoose = require("mongoose"),
{ Schema } = mongoose,
passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new Schema({
    name: {type: String, trim: true},
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        min: [18, "You must be 18 or older to create an account"],
    }
}, {
    timestamps: true
})   

userSchema.plugin(passportLocalMongoose, {
    usernameField: "userName"
  });
  
module.exports = mongoose.model("User", userSchema);