import React, {Component} from "react";
import axios from "axios";
import {Redirect} from "react-router-dom";
import Nav from "./nav.component";
import {connect} from "react-redux";
import {Table, Container} from "reactstrap";

const Project = (props) =>(
    <tr>
        <td>{props.project.projectname}</td>
        <td>{props.project.users.length}</td>
        <td>{props.project.cost}</td>
        <td>{props.project.funding}</td>
        <td>
            < button onClick={props.addProject}>Join</button>
        </td>
    </tr>
)

class SearchPage extends Component{
    constructor(props){
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.search = this.search.bind(this);
        this.addProject=this.addProject.bind(this);
        
        this.state=({
            username: this.props.username,
            token: this.props.token,
            value: '',
            loadedproject: '',
            joined: false
        })

    }
    
    onValueChange(e){
        this.setState({
            value: e.target.value
        })
    }

    search(e){
        e.preventDefault();
        axios.get("http://localhost:5000/project/find/" + this.state.value)
        
        .then(res => {
            if(res.data.length > 0){
                if(!(res.data[0].users).includes(this.state.username)){
                    this.setState({
                        loadedproject: res.data[0]
                    })
                }
                
            }
            
            
        });
    }

    projectList(){
        if(this.state.loadedproject !== ""){
            return <Project addProject={this.addProject} project={this.state.loadedproject} username={this.state.username}/>;
        }
        
    }

    addProject(){

        const project = {
            projectname: this.state.loadedproject.projectname,
            cost: this.state.loadedproject.cost,
            funding: this.state.loadedproject.funding,
            new_user: this.state.username
        }
        const config = {
            headers : {
                "auth-token" : this.state.token
            }
        }
        
        axios.post("http://localhost:5000/project/update/"+ project.projectname, project, config)
        .then(() => {
            this.setState({
                joined:true
            })
        }
        )  
        

        axios.post("http://localhost:5000/user/update/" + this.state.username, {
            username: this.state.username,
            projects: this.state.loadedproject.projectname
        }, config)
        .then(res=>console.log(res))
        .catch(err => console.log(err))
        
    }

    render(){
        if(this.state.joined){
            return (<Redirect to={{pathname: "/project/views/"+ this.state.username}}/>);
        }
        return(
            <div>
                <div><Nav link="search" username={this.state.username}></Nav></div>
                <input onChange={this.onValueChange} type="text"></input>
                <button type="submit" onClick={this.search}>Search</button>
                <Container className="col-5 projects-container">
                    <Table>
                        <thead className="thead-light">
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
            </div>
        )
    }

}

function mapStateToProps(state){
    return{username: state.username, token: state.token}
};
  
 export default connect(mapStateToProps)(SearchPage);