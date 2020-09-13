const router = require("express").Router();
const verify = require("./verifyToken");
let projectModel = require("../models/project.model.js");


//Creates New Project
router.route("/add").all(verify).post((req, res) => {
    const projectname = req.body.projectname;
    const users = req.body.users;
    const cost = req.body.cost;
    const funding = req.body.funding;
    const data = req.body.data;
    const newProject = projectModel({
        projectname, users, cost, funding, data
    })
    newProject.save()
    .then(() => res.json("Project Created"))
    .catch(err => console.log(err));

})

//Get Projects
router.route("/").get((req, res)=>{
    projectModel.find()
    .then(projectList => res.json(projectList))
    .catch(err => console.log(err));
})

//Get Project by Name
router.route("/find/:projectname").get((req, res)=>{
    projectModel.find({projectname: req.params.projectname})
    .then(proj => res.json(proj))
})

//Add User to Project
router.route("/update/:projectname").all(verify).post((req, res)=>{
    projectModel.findOne({projectname: req.params.projectname})
    .then(project => {
        project.users.push(req.body.new_user)
        project.save()
        .then(()=>res.json("Project Updated"))
        .catch(err => console.log(err))
    }).catch(err => console.log(err))
})

//Delete User frpom project
router.route("/deleteUser/:projectname").post((req, res)=>{
    projectModel.findOne({projectname: req.params.projectname})
    .then(project => {
        position = project.users.indexOf(req.body.username)
        project.users.splice(position, position+1);
        project.save()
        .then(()=>res.json("Project Updated"))
        .catch(err => console.log(err))
    }).catch(err => console.log(err))
})
//Add Pitch-In data to project
router.route("/data/:projectname").all(verify).post((req, res) => {
    projectModel.findOne({projectname: req.params.projectname})
    .then(project => {
        const user = req.body.username;
        const amount = req.body.amount;
        const anonymous = req.body.anon;
        const completed = req.body.completed;
        if(project.data == null){
            project.data = {};
        }
        project.data[user] = {
            "amount": amount,
            "anon": anonymous,
            "completed": completed
        }
        project.markModified('data');
        project.save()
        .then(()=>res.json(project))
        .catch(err => console.log(err))
    }).catch(err => console.log(err))
})

//Delete funding from Project
router.route("/deleteFunding/:projectname").all(verify).post((req, res) => {
    projectModel.findOne({projectname: req.params.projectname})
    .then(project => {
        delete project.data[req.body.username];
        project.markModified("data");
        project.save()
        .then(() => res.json(project))
        .catch(err => console.log(err))
    }).catch(err => console.log(err))
})

//Update funding from project
router.route("/updateFunds/:projectname").all(verify).post((req, res)=>{ 
    projectModel.findOne({projectname: req.params.projectname})
    .then(project => {
        var total = 0;
        if(project.data != null){
            Object.keys(project.data).forEach((key, index) => {
                total+=project.data[key].amount;
            })
        }
        project.funding = total;
        project.save()
        .then(() => res.json(project))
        .catch(err => console.log(err));
    }).catch(err => console.log(err))
})

module.exports=router;