import React, {Component} from "react";
import Axios from "axios";
import {Link, Redirect} from "react-router-dom";
import Graph from "./chart-component.js";
import "../styles/projects.css";
import {connect} from "react-redux";
import LoadingScreen from "./loading-component.js"
import PopUp from "./popup-component.js"
import {Container, Row, Col, Button, Table} from "reactstrap";



const Funding = (props) =>{
    return(
    <tr>
        <td>{props.username}</td> 
        <td>{props.amount}</td>
        <td>{props.completion? "Funded" : "In Progress"}</td>
        <td>
            <a href={""} onClick={() => {props.leaveFund(props.projectname, props.username)}}>Delete</a>
        </td>
    </tr>
    )
}

class LoginPage extends Component{
    constructor(props){
        super(props);
      
        console.log(this.props)
        this.leaveFund= this.leaveFund.bind(this);
        this.uponClose = this.uponClose.bind(this);
        this.removeUser = this.removeUser.bind(this);

        this.state=({
            username: this.props.username,
            projectname: props.location.state.project.projectname,
            project: props.location.state.project,
            funding: 0,
            data: {},
            ready: false,
            token: this.props.token,
            modal: false,
            redirect: false
        })
}



async componentDidMount(){
    console.log("Mounting View")
    const config = {
        headers : {
            "auth-token" : this.state.token
        }
    }
    Axios.get("http://localhost:5000/project/find/" + this.state.projectname)
    .then(res => {
        this.setState({
            data: (res.data[0].data==null? {} : res.data[0].data)
        })
    })
   
    Axios.post("http://localhost:5000/project/updateFunds/"+this.state.projectname, {}, config)
    .then(res => {
        this.setState({
            project: res.data,
            ready: true
        })
    });
}


leaveFund(projectname, username){
    console.log(this.state)
    const config = {
        headers : {
            "auth-token" : this.state.token
        }
    }
    Axios.post("http://localhost:5000/project/deleteFunding/"+projectname, {
        username: username
    }, config).then(res => {
        console.log(res)
    });
}

loadFunding(){
    return Object.keys(this.state.data).map(users => {
        return <Funding username={users} 
            amount= {this.state.data[users].anon ?  "*" : this.state.data[users].amount}
            completion={this.state.data[users].completed}
            leaveFund={this.leaveFund}
            projectname = {this.state.projectname}
        />
        }
    )
}

getColor(){
    if(this.state.project.funding === this.state.project.cost){
        return "green";
    }
    else if(this.state.project.funding>this.state.project.cost){
        return "red";
    }
    return "black";
}

showGraph(){
    if(this.state.project.data != null){
    return <Graph key="graph" data={this.state.project.data} cost={this.state.project.cost}></Graph>
    }
    else return(<Graph key="graph" data={null} cost={this.state.project.cost}></Graph>);
}

getUsers(){
    var color;
    return Object.keys(this.state.project.users).map((index) => {
        color = "black";
        if(this.state.project.users[index] === this.state.username){
            color = "red"
        }
        return <div style={{"color":color}}>{this.state.project.users[index]}<br></br><Button  color="link" onClick={() => {this.removeUser(this.state.project.users[index])}}>Remove</Button ></div>;
    })
}
removeUser(user){
    console.log(this.state.project)
    Axios.post("http://localhost:5000/project/deleteUser/" + this.state.projectname, {
        username: user
    }).then(() => {
        Axios.get("http://localhost:5000/project/find/" + this.state.projectname)
        .then(res => {
            this.setState({
                project: res.data[0]
            })
        })
    })
    Axios.post("http://localhost:5000/user/removeProject", {
        username: user,
        projectname: this.state.projectname
    }).then(() => {
        if(user === this.state.username){
            this.setState({
                redirect: true
            })
        }
    })
}

uponClose(){
    this.setState({
        modal: false
    })
}

render(){
    if(this.state.redirect){
        return (<Redirect to={"/project/views/"+this.state.username}></Redirect>)
    }
    return(
        
        <div>
        {this.state.ready && 
        <div>
        <h1>{this.state.projectname}</h1>
        <h3>Goal : ${this.state.project.cost}</h3>
        <h3 style={{color:this.getColor()}}>Funding : ${this.state.project.funding}</h3>
        
        <button onClick={() => this.setState({modal: true})}>Enlisted Users</button>
        <PopUp close={this.uponClose} open={this.state.modal}>{this.getUsers()}</PopUp>
         
        <Container className="col-5 float-left projects-container">
        <Table>
            <thead className="thead-light">
                <tr>
                    <th>User Name</th>
                    <th>Amount</th>
                    <th>Progress</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {this.loadFunding()}
            </tbody>
        </Table>
        </Container>
        <Container className="col-sm-7 float-right">
            {(this.state.ready) && this.showGraph()}
        </Container>
        <Container className="fixed-bottom buttons-container">
            <Row>
                <Col className="back-btn">
                    <Link to={{pathname: "/project/views/" + this.state.username}}><button className="btn btn-dark">Back</button></Link>
                </Col>
                <Col className="pitch-in-btn">
                    <Link onClick={this.addFund} to={{pathname: "/project/" + this.props.match.params.id+ "/add", state: {project: this.state.project}}}><button className="btn btn-dark">Pitch-In! / Edit</button></Link>
                </Col>
            </Row>
        </Container>
        </div>
        }
        {!this.state.ready && 
        <div><LoadingScreen/></div>
        }
        </div>
    )
}
}

function mapStateToProps(state){
    return{username: state.username, token: state.token}
};
  
 export default connect(mapStateToProps)(LoginPage);