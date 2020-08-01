import React, { useState } from "react";
import { Form, FormGroup, Input } from "reactstrap";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import bcrypt from 'bcryptjs';

let fontColor = "red";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordEmptyError, setPasswordEmptyError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  

  let history = useHistory();

  function submitForm(event) {
    event.preventDefault();
    let newAccount = {};
    newAccount.userName = userName;
    newAccount.password = password;
    newAccount.confirmPassword = confirmPassword;

    const isValid = validateForm(event);
    if (isValid) {
      resetFormValues();
      //Add an id to newAccount here as well
      //Do something with the newAccount object
      fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.error)
          {
            fontColor = "red";
            setUsernameError(data.error);
          }
          else
          {
            fontColor = "green";
            setUsernameError(data.success);
          }
        });
    }
  }
  function resetFormValues() {
    setUserName("");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordEmptyError("");
    setUsernameError("");
  }

  //validateForm
  function validateForm(event) {
    let passwordErrorr = "";
    let passwordEmptyErrorr = "";
    let usernameErrorr = "";
    //if username is blank
    if (!userName) {
      usernameErrorr = "Username cannot be blank";
    }
    //if password is blank
    if (!password) {
      passwordEmptyErrorr = "Password cannot be blank";
    }
    //if passwords do not match
    if (password !== confirmPassword) {
      passwordErrorr = "Passwords do not match";
    }

    

    if (passwordErrorr || usernameErrorr || passwordEmptyErrorr) {
      setUsernameError(usernameErrorr);
      setPasswordError(passwordErrorr);
      setPasswordEmptyError(passwordEmptyErrorr);
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
              <center>Create Account</center>
            </h2>
            <Input
              type="form"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <div style={{ color: fontColor }}>
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
              <center>{passwordEmptyError}</center>
            </div>
            <br></br>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div style={{ color: "red" }}>
              <center>{passwordError}</center>
            </div>
            <br></br>
            <Button className="btn-lg btn-dark btn-block" type="submit">
              Register
            </Button>
          </FormGroup>
        </Form>
        <div className="text-center">
          <span className="p-2">Already have an account?</span>
          <a href="/" exact>
            <b>Log In</b>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
