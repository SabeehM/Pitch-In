import React from "react";
import {Link} from "react-router-dom";
import logo from "../imgs/logo.png";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log(error)
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        
        return (
            <div>
                <Link to="/"><img alt="None" className="logo" src={logo}/></Link>
                <h1>Something went wrong!</h1>
            </div>
            );
      }
      return this.props.children; 
    }
  }