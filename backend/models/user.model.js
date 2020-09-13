const { Schema } = require("mongoose");

const mongoose = require('mongoose');

userScheme = Schema({
    username: {type:String, required:true, unique: false},
    projects: {type: Array, required: true}
})

const UserModel = mongoose.model("User", userScheme);

module.exports = UserModel;