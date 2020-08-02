import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
  } from "react-router-dom";

//Import page components
import map from "../Map";
import News from "../News";
import Discussion from "../Reports/Discussion";
import Account from "../Account";
import Logout from "../Logout";

//Import other components
import { NavigationBar } from "../NavBar";
import { Layout } from "../Layout";

const HomePage = (props) => {
  const setLoggedIn = props.setLoggedIn;

  console.log("props", props);

  return (
    <React.Fragment>
        <NavigationBar />
        <Layout>
          <Router>
            <Switch>
              <Route path="/map" exact component={map} />
              <Redirect exact from="/" to="/map"/>
              <Route path="/news" component={News} />
              <Route path="/reports" component={Discussion} />
              <Route path="/account" component={Account} />
              <Route 
                    path="/logout" exact 
                    render={(props) => (
                      <Logout {...props} setLoggedIn={setLoggedIn}/>
                    )}
              />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
  )
    
}

export default HomePage;