import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import axios from 'axios';
import "../styles/login.css";
import logo from "../imgs/logo.png";
import {Add} from "../actions";
import {connect} from "react-redux";
import {Button, Jumbotron, Container, Row, Col, Input} from "reactstrap";

class LoginPage extends Component{
    constructor(props){
        super(props);

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeID = this.onChangeID.bind(this);
        this.AddUser = this.AddUser.bind(this);
        
        
        this.state = {
            _id: 0,
            username: '',
            id: "0000",
            username_valid: "form-control is-invalid",
            id_valid: "form-control is-valid",
            token: "",
            isAuthenticated: false,
        };
        
    }

    Button(){
        var valid = (!this.state.username_valid.includes("invalid") && !this.state.id_valid.includes("invalid"));
        if(!valid){
            return( 
            <div>
            <Link to={"#"}><Button className="btn-dark">Go!</Button></Link>
            </div>)
        }
        else{
            return (
            <div>
            <Button onClick={this.AddUser} className="btn-dark">Go!</Button>
            </div>
            )
        }
    }
    
    onChangeName(val){
        this.setState({
            username_valid: (val.target.value.length === 0)? "form-control is-invalid":"form-control is-valid",
            username: val.target.value
        })
    }
    
    onChangeID(val){
        this.setState({
            id_valid: (val.target.value.length === 4)? "form-control is-valid":"form-control is-invalid",
            id: val.target.value
        })
    }

    AddUser(){
        const currentState = {
            id: this.state.id,
            username: this.state.username + this.state.id.toString(),
        }
        var new_id;
        if(currentState.id.length ===4 && currentState.username.length>0){
            axios.post("http://localhost:5000/user/add/", currentState)
                .then(res => {
                    new_id = res.data;
                    localStorage.clear();
                    sessionStorage.clear();
                    this.props.addInfo(this.state.username+this.state.id, new_id);
                    this.setState({
                        token: new_id,
                        isAuthenticated: true
                    })
                })
            .catch(err => console.log(err));
            }
    }

    render(){
    if(this.state.isAuthenticated){
        return<Redirect to={{pathname: "/project/views/"+ (this.state.username + this.state.id.toString())}}/>
    } 
    return(
        <Jumbotron className="vertical-center"> 
        <Container className="menu">
         <img className="logo" alt="None" src={logo}/>
            <br></br>
            <Container className="input-fields">
                <Row>
                    <Col>
                        <label>Username</label>
                        <Input className={this.state.username_valid} type="text" maxLength="15" value={this.state.username} placeholder="John" onChange={this.onChangeName}></Input>    
                    </Col>
                    <Col>
                        <label>4-Digit Tag</label>
                        <Input className={this.state.id_valid} type="number" value={this.state.id} placeholder = "1111" onChange={this.onChangeID}></Input>
                    </Col>
                </Row>
            </Container>
            <Row>
                <Col>
                    {this.Button()}
                </Col>
            </Row>
        </Container>
       </Jumbotron>
    );
}
}

const mapDispatchToProps = (dispatch) => {
    return{
        addInfo: (username, token) => {
            dispatch(Add(username, token))
        }
    }
}

export default connect(null, mapDispatchToProps)(LoginPage);