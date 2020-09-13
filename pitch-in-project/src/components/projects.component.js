import React, {Component} from "react";
import axios from 'axios';
import {Link, Redirect} from "react-router-dom";
import "../styles/projects.css";
import Nav from "./nav.component.js";
import LoadScreen from "./loading-component.js"
import {connect} from "react-redux"
import {Container, Table} from "reactstrap";

const Project = (props) =>(
    <tr>
        <td>{props.project.projectname}</td>
        <td>{props.project.users.length}</td>
        <td>{props.project.cost}</td>
        <td>{props.project.funding}</td>
        <td>
            <Link to={{pathname: "/project/view/" + props.project._id, state: {project: props.project}}}>View</Link>
            <br></br>
            <a href={""} onClick={() => {props.leaveProject(props.project)}}>Leave</a>
        </td>
    </tr>
)

class Projects extends Component{
    constructor(props){
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.leaveProject = this.leaveProject.bind(this);

        this.state=({
            username: this.props.username,
            token: this.props.token,
            projects: [],
            error: false,
            loading: true
        })
    }

    
    componentDidMount(){ 
        var a = axios.get("http://localhost:5000/user/find/" + this.state.username)
        .then(res => {
            if(res.data.length > 0){
                var projectNames = res.data[0].projects;
                return projectNames;
            }
        })
        return a.then((result) => {
            if(this.props.match.params.id !== this.state.username){
                this.setState({
                    error: true
                })
            }
            if(result){
                for(let x = 0; x<result.length; x++){
                    axios.get("http://localhost:5000/project/find/" + result[x])
                    .then(res => {
                        if(res.data.length >0){
                            var joined = this.state.projects.concat(res.data[0])
                            this.setState({
                                projects: joined,
                                loading: false
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        console.log("Project may not be found")
                    });
                }
                if(result.length === 0){
                    this.setState({
                        loading: false
                    })
                }
            }
        })
        
    }

    componentDidCatch(err, info){
        this.setState({
            error: true
        })
    }   

    leaveProject(project){
        axios.post("http://localhost:5000/user/removeProject", {
            projectname: project.projectname,
            username: this.state.username
        }).then(res => console.log(res))
        .catch(err => console.log(err))

        axios.post("http://localhost:5000/project/deleteUser/" + project.projectname, {
            username: this.state.username
        }).then(res => console.log(res))
        .catch(err => console.log(err))
    }

    projectList(){
        return this.state.projects.map(currentProject =>{
            return <Project token={this.state.token} key={currentProject._id} leaveProject={this.leaveProject} project={currentProject} username={this.state.username}/>;
        })
    }

    render(){
        if(this.state.loading){
            return(<LoadScreen/>)
        }
        else if(this.state.error){
            return(<Redirect to="/"/>)
        }
        return(
            <div>
            <div><Nav link="view" username={this.props.username}></Nav></div>
            <Container fluid>
                <h1>{this.state.username.slice(0,-4)+ " #" + this.state.username.slice(-4)}'s Projects</h1>
                <Container className="col-12 float-left projects-container">
                    <Table dark={true} className="table-container">
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Users</th>
                                <th>Cost</th>
                                <th>Funding</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.projectList()}
                        </tbody>
                    </Table>
                </Container>
            </Container>
            </div>
            
        )

    }

}

function mapStateToProps(state){
    return{username: state.username, token: state.token}
};
  
 export default connect(mapStateToProps)(Projects);