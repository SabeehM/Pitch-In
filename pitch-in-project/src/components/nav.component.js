import React, {Component} from "react";
import {Link, NavLink} from "react-router-dom";
import "../styles/navbar.css";
import {connect} from "react-redux";
import {Delete} from "../actions";
import {Navbar, NavbarBrand, NavItem, Nav} from "reactstrap";


class Navigation extends Component{
    constructor(props){
        super(props);
        this.state={
            projectname: "",
            id: "",
            username: props.username,
            link: props.link
        }
    }

    resetInfo(){
        localStorage.clear()
        this.props.removeInfo();
    }

    render(){
        return(
            <div>
                <Navbar expand="lg">
                <NavbarBrand onClick={() => this.resetInfo()}href="/">Pitch In!</NavbarBrand>
                    <Nav className="mr-auto">
                        <NavItem>
                        <NavLink style={{color: this.state.link==="view"? "blue" : "black"}} 
                        to={{pathname: "/project/views/"+this.state.username}} className="nav-link">View Projects</NavLink>
                        </NavItem>
                        <NavItem>
                        <NavLink style={{color: this.state.link==="create"? "blue" : "black"}} 
                        className="nav-link" to={{pathname: "/project/create/" + this.state.username}}>Create Project</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink style={{color: this.state.link==="search"? "blue" : "black"}} 
                            className="nav-link" to={{pathname: "/project/search/" + this.state.username}}>Search Projects</NavLink>
                        </NavItem>
                    </Nav>
                </Navbar>
                
            </div>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return{
        removeInfo: () => {
            dispatch(Delete())
        }
    }
}

export default connect(null, mapDispatchToProps)(Navigation);