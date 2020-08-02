import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { Form, FormGroup, Input } from "reactstrap";

const Login = (props) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  

  function submitForm(event) {
    event.preventDefault();
    let accountCredentials = {};
    accountCredentials.userName = userName;
    accountCredentials.password = password;

    const isValid = validateForm(event);

    const domain = `${window.location.origin === "http://localhost:3000" ? "http://localhost:5000" : window.location.origin}`;

    if (isValid) {
      resetFormValues();
      //Do something with credentials object

      fetch(`${domain}/api/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setLoginError(data.error);
          } else if (data.success) {
            console.log("data", data);
            //add login logic here e.g redirecting
            localStorage.setItem('token', data.token);
            props.setLoggedIn(true);
            setLoginError("");
          }
        });
    }
  }
  function resetFormValues() {
    setUserName("");
    setPassword("");
    setPasswordError("");
    setUsernameError("");
  }
  //validateForm
  function validateForm(event) {
    let passwordErrorr = "";
    let usernameErrorr = "";
    //if username is blank
    if (!userName) {
      usernameErrorr = "Username cannot be blank";
    }
    //if password is blank
    if (!password) {
      passwordErrorr = "Password cannot be blank";
    }

    if (passwordErrorr || usernameErrorr) {
      setUsernameError(usernameErrorr);
      setPasswordError(passwordErrorr);
      return false;
    }

    return true;
  }

  return (
    <div className="loginPage">
      <div className="form-div">
        <Form id="input" onSubmit={submitForm}>
          <FormGroup>
            <h2>
              <center>Protest Tracker</center>
            </h2>
            <Input
              type="form"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <div style={{ color: "red" }}>
              <center>{usernameError}</center>
            </div>
            <br></br>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div style={{ color: "red" }}>
              <center>{passwordError}</center>
            </div>
            <br></br>
            <Button className="btn-lg btn-dark btn-block" type="submit">
              Log In
            </Button>
            <div style={{ color: "red" }}>
              <center>{loginError}</center>
            </div>
          </FormGroup>
        </Form>
        <div className="text-center">
          <a href="/register">Register</a>
          <span className="p-2">|</span>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;