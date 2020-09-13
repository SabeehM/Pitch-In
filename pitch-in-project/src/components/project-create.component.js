import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import axios from 'axios';
import "../styles/create.css";
import Nav from "./nav.component";
import {connect} from "react-redux";
import {Container, FormGroup, Form, Input, Button} from "reactstrap";

class CreatePage extends Component{
    constructor(props){
        super(props);
        
        this.onChangeProjectName = this.onChangeProjectName.bind(this);
       
        this.onChangeCost = this.onChangeCost.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
       
        this.state = {
            username: this.props.username,
            token: this.props.token,
            projectName: '',
            description: '',
            cost: 0,
            funding: 0,
            redirect: false,
            projectname_valid: "form-control is-invalid",
            cost_length: false,
            already_exists: false
        };
    }

 
    onChangeProjectName(e){
        this.setState({
            projectName: e.target.value,
            projectname_valid: (e.target.value.length > 0)? "form-control is-valid":"form-control is-invalid",
            already_exists: false
        })
    }
   
    onChangeCost(e){
        
        if(e.target.value.length < 10 ){
            this.setState({
                cost: e.target.value,
                cost_length: false
            })
        }else{
            this.setState({
                cost_length: true
            })
        }
        
    }

    onSubmit(e){
        e.preventDefault();
        const project = {
            projectname: this.state.projectName,
            cost: this.state.cost,
            funding: 0,
            users: [this.state.username],
            data: {}
        }

        const config = {
            headers : {
                "auth-token" : this.state.token
            }
        }

        

        if(this.state.projectName.length > 0){
            axios.get("http://localhost:5000/project/find/"+project.projectname)
            .then(res => {
                if(!res.data.length){

                    axios.post("http://localhost:5000/project/add", project, config)
                    .then((res) => {
                        this.setState({
                            redirect: true
                        })
                    })
    
                    axios.post("http://localhost:5000/user/update/" + this.state.username, {
                        username: this.state.username,
                        projects: this.state.projectName
                    }, config)
                    .then(res=>console.log(res))
                    
                    
                }else{
                    this.setState({
                        already_exists: true
                    })
                }
            })
            
            
        }
       
        

     
    }

    render(){
        if (this.state.redirect) return <Redirect onClick={() => window.location.reload()} to={{pathname: "/project/views/" + this.state.username, state: {username: this.state.username}}}></Redirect>
        else return(
            
            <div>
                 <Nav link="create" username={this.state.username}></Nav>
                <h3 id="header">Create a New Project</h3>
                <Container className="forms-container">

                <Form>
                    <FormGroup>
                        <label>Project Name</label>
                        <Input type="text" maxLength="30" className={this.state.projectname_valid} value ={this.state.projectName} onChange={this.onChangeProjectName}/>
                    </FormGroup>
                   
                    <FormGroup>
                        <label>Cost</label>
                        <Input type="number" maxLength="10" min="0" className="form-control" value ={this.state.cost} onChange={this.onChangeCost}/>
                    </FormGroup>
                    {this.state.already_exists && <div><h4>A project with this name already exists!</h4></div>}
                    {this.state.cost_length && <div>Too many Cost digits!</div>}
                    <Link onClick={this.onSubmit} to={{pathname: "/project/views/" + this.state.username}}><Button className="btn-dark">Create</Button></Link>
                </Form>   
                </Container>            
            </div>
            
        )
    }

}

function mapStateToProps(state){
    return{username: state.username, token: state.token}
};
  
 export default connect(mapStateToProps)(CreatePage);
