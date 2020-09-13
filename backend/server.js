const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established")
})

const userRouter = require("./routes/user.route.js");
const projectRouter = require('./routes/project.route.js');

app.use("/user", userRouter);
app.use("/project", projectRouter);

app.listen(port, () => {
    console.log('Server is running on port: 5000');
})
