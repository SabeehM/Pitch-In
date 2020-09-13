import {Component} from "react";
import React from "react";

let popupStyles = {
    width: '500px',
    maxWidth: "100%",
    margin: "0 auto",
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    zIndex: "999",
    backgroundColor: "#000",
    padding: "10px 20px 40px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column"
};

let popupCloseButtonStyles = {
    marginBottom: "15px",
    padding: "3px 8px",
    cursor: "pointer",
    borderRadius: "50%",
    border: "none",
    width: "30px",
    height: "30px",
    fontWeight: "bold",
    alignSelf: "flex-end"
};

export default class PopUp extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            close: false
        }
    }

    
    

    render(){
        if(this.props.open && !this.state.close){
            return(
                <div style={popupStyles}>
                    <button onClick={() => this.props.close()} style={popupCloseButtonStyles}>X</button>
                    {this.props.children}
                </div>
            )
        }
        else{
            return null;
        }
    }
}