import React, {useState} from "react";
import {Form, FormGroup, Input} from 'reactstrap'
import Button from 'react-bootstrap/Button'

const ForgotPassword = () => {
    const [userEmail, setUserEmail] = useState("");

    function submitForm(event) {
        event.preventDefault();
        let theUserEmail = userEmail;
        resetFormValues();
    }
    function resetFormValues() {
        setUserEmail("");
    }

    return (
        <div className="loginPage">
            <div  className="form-div">
                <Form id="input" onSubmit={submitForm}>
                    <FormGroup>
                        <h2><center>Forgot Password?</center></h2>
                        <p>
                            <center>
                                Please enter your email and we will send you a password recovery link
                           </center>
                        </p>
                        <Input type="form" placeholder="Email" value={userEmail} onChange={e => setUserEmail(e.target.value)}/>
                        <br></br>
                        <Button className="btn-lg btn-dark btn-block" type="submit">Send me the link!</Button>
                    </FormGroup>
                </Form>
                <div className="text-center">
                    <a href="/" exact>Log In</a>
                    <span className="p-2">|</span>
                    <a href="/register">Register</a>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;