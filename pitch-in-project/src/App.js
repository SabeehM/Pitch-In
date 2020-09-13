import React, {Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Project from "./components/projects.component.js";
import LoginPage from "./components/login.component.js";
import projectView from "./components/project-view.component.js";
import projectCreate from "./components/project-create.component.js";
import projectSearch from "./components/project-search.component.js";
import pitchIn from "./components/pitch-in-component.js";
import Error from "./components/error-component.js";


class App extends Component{
  constructor(props){
    super(props);
    this.updateTokenUser = this.updateTokenUser.bind(this);
    this.state= {
      token: "",
      username: "",
      error: false
    }
  }
  
  componentDidCatch(err, info){
    this.setState({
      error: true
    })
  }

  updateTokenUser(token, username){
    this.setState({
      token: token,
      username: username
    })
    console.log(this.state)
  }

  

render(){
  return (
     
    <Router>
    <div className="App">
        <Switch>
        <Error>
        <Route path="/" exact component={LoginPage}/>
        <Route path="/project/search/:id" exact component ={projectSearch}/>
        <Route path="/project/views/:id" exact component={Project}/>
        <Route path="/project/view/:id" exact component={projectView}/>
        <Route path="/project/create/:id" exact component ={projectCreate}/>
        <Route path="/project/:id/add" exact component={pitchIn}/>
        </Error>
        </Switch>
     
    </div>
    </Router>
  );
  }
}

export default App;
