import React from "react";
import {
    Redirect
  } from "react-router-dom";

const Logout = (props) => {
    localStorage.setItem('token', "null");
    props.setLoggedIn(false);
    
    return (
        <Redirect from="/logout" to="/"/>
    )
    
}

export default Logout;