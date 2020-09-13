const router = require("express").Router();
const joi = require('@hapi/joi');
const jwt = require("jsonwebtoken");
let user = require("../models/user.model.js");
const project = require("../models/project.model.js");
const verify = require("./verifyToken.js");

require("dotenv").config();


router.route("/add").post((req, res) => {
    user.find({username: req.body.username})
    .then(result => {
        if(result.length === 0){
            console.log("New User being Added")
            const username = req.body.username;
            const projects = [];
            const newUser = user({
                username, projects
            })
            newUser.save()
            .then((re) => {
                const token = jwt.sign({_id : re._id}, process.env.TOKEN_SECRET);
                res.header("auth-token", token).send(token);
            })
            .catch(err => console.log(err));
        }else{
            const token = jwt.sign({_id : result[0]._id}, process.env.TOKEN_SECRET);
            res.header("auth-token", token).send(token);
        }
    }).catch(err => console.log(err));
})

router.route("/").get((req, res)=>{
    user.find()
    .then(UserList => res.json(UserList))
    .catch(err => console.log(err));
})

router.route("/find/:username").get((req, res)=>{
    user.find({username: req.params.username})
    .then(user => res.json(user))
})


router.route("/update/:username").all(verify).post((req, res)=>{
    user.findOne({username: req.body.username})
    .then(User => {
        User.projects.push(req.body.projects)
        User.username = User.username;
        User.save()
        .then(()=>res.json("User Updated"))
        .catch(err => console.log(err))
    }).catch(err => console.log(err))
})

router.route("/removeProject").post((req, res)=>{
    user.findOne({username: req.body.username})
    .then(User => {
        position = User.projects.indexOf(req.body.projectname)
        User.projects.splice(position,1)
        User.save()
        .then(()=>res.json("User Updated"))
        .catch(err => console.log(err))
    }).catch(err => console.log(err))
})

module.exports=router;