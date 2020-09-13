const { Schema } = require("mongoose");

const mongoose = require('mongoose');

projectScheme = Schema({
    projectname: {type:String, required:true, unique:true, dropDups: true},
    users: {type:Array, required:true},
    cost: {type:Number, required: true},
    funding: {type:Number, required:true},
    data: {type:Object, required: false}
})

const project = mongoose.model("Project", projectScheme);

module.exports = project;