import React, {Component} from "react";
import Axios from "axios";
import {Link, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {Container, Row, Col, Button, FormGroup, Form, Input} from "reactstrap";


class PitchIn extends Component{
    constructor(props){
        super(props);
        this.addFund = this.addFund.bind(this);
        this.addAnon = this.addAnon.bind(this);
        this.addPitchIn= this.addPitchIn.bind(this);
        this.addCompletion = this.addCompletion.bind(this);
        this.state=({
            username: this.props.username,
            project: props.location.state.project,
            anonymous: false,
            fund: 0,
            completed: false,
            token: this.props.token,
            updated: false
        })
}


addPitchIn(){
    const config = {
        headers : {
            "auth-token" : this.state.token
        }
    }
    Axios.post("http://localhost:5000/project/data/"+this.state.project.projectname, {
        "username": this.state.username,
        "amount": Number(this.state.fund),
        "anon": this.state.anonymous,
        "completed": this.state.completed,
    }, config).then(() => {
        Axios.post("http://localhost:5000/project/updateFunds/"+this.state.project.projectname, {}, config)
            .then(res => {
                this.setState({
                    project: res.data,
                    updated: true
                })
            })
        }
        )
    
}

addFund(e){
    this.setState({
        fund: e.target.value
    })

}

addAnon(){
    this.setState({
        anonymous: (!this.state.anonymous)
    })

}

addCompletion(){
    this.setState({
        completed: (!this.state.completed)
    })
}



//value ={this.state.description} onChange={this.onChangeDescription}
//value ={this.state.cost} onChange={this.onChangeCost}
render(){
    if(this.state.updated){
        return (<Redirect to={{pathname: "/project/view/" + this.state.project._id, state: {project: this.state.project}}}/>)               
    }
    return(
        <div>
            <Container className="forms-container">
            <h3 id="header">Pitch In! / Overwrite</h3>
            <Form>
                <FormGroup>
                    <label>Amount</label>
                    <Input type="number" value={this.state.fund} className="form-control" onChange={this.addFund}/>
                </FormGroup>
                <FormGroup>
                    <div className="checkbox">
                        <label>Anonymity?</label>
                            <div>
                            <Input type="checkbox" data-toggle="toggle" onClick={this.addAnon}/>
                        </div>
                    </div>
                    <FormGroup>
                    <div className="checkbox">
                        <label>Completed?</label>
                            <div>
                            <Input type="checkbox" data-toggle="toggle" onClick={this.addCompletion}/>
                        </div>
                    </div>
                </FormGroup>
                </FormGroup>
            </Form>
            </Container>
            <Container className="float-bottom buttons-container">
                <Row>
                    <Col>
                        <Link to={{pathname: "/project/view/" + this.state.project._id, state: {project: this.state.project}}}><Button className="btn-dark">Back</Button></Link>
                    </Col>
                    <Col>
                        <Button onClick={this.addPitchIn} className="btn-dark">Pitch In!</Button>              
                    </Col>
                </Row>    
            </Container>
     </div>
    )
}
}

function mapStateToProps(state){
    return{username: state.username, token: state.token}
};
  
 export default connect(mapStateToProps)(PitchIn);