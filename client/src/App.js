import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Navbar } from "react-bootstrap";

//Import page components
import Login from "./views/Login";
import Register from "./views/Register";
import ForgotPassword from "./views/ForgotPassword";
import HomePage from "./views/Home/HomePage";


//This variable should probably be stored differently as a prop/state so it can be accessed
//and changed by the login/register pages. Backends take a look at this.
//You might also need change the address back to the root directory
//localhost.../ to see the login after setting this value to false

const App = (props) => {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("token") == 'null' ? false : true
  );
  console.log("type of token", typeof localStorage.getItem('token'));
  console.log("token", localStorage.getItem('token'));

  console.log(loggedIn);

  //If not logged in, display the login page
  if (loggedIn === false) {
    return (
      <React.Fragment>
        <Router>
          <Switch>
            <div className="row no-gutters">
              <div className="col">
                <div className="leftside">
                  <Navbar.Brand className="brand-nav">
                    <h2>
                      <b>Protest Tracker</b>
                    </h2>
                  </Navbar.Brand>
                  <h3 className="app-info">
                    <p>
                      Pin a{" "}
                      <span style={{ textDecoration: "underline" }}>
                        Protest
                      </span>
                      .
                    </p>
                    <p>
                      Find a{" "}
                      <span style={{ textDecoration: "underline" }}>
                        Protest
                      </span>
                      .
                    </p>
                    <p>
                      Inform others about{" "}
                      <span style={{ textDecoration: "underline" }}>
                        Protests
                      </span>
                      .
                    </p>
                    <p>Pin &amp; Protest.</p>
                  </h3>
                </div>
              </div>
              <div className="col">
                <div className="rightside d-flex justify-content-center align-items-center">
                  <div className="black-lives">
                    <p>
                      <h3>#BlackLivesMatter</h3>
                    </p>
                  </div>
                  {/* <Route path="/" exact component={Login} /> */}
                  <Route 
                    path="/" exact 
                    render={(props) => (
                      <Login {...props} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>
                    )}
                  />
                  <Route path="/register" component={Register} />
                  <Route path="/forgot-password" component={ForgotPassword} />
                </div>
              </div>
            </div>
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
  //If logged in, display the dashboard
  else {
    
    return (
      <HomePage {...props} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>
    );
  }
};

export default App;