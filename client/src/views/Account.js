import React, { useEffect, useState } from "react";
import Guidelines from "./Guidelines";

const Account = () => {

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    
    const domain = `${window.location.origin === "http://localhost:3000" ? "http://localhost:5000" : window.location.origin}`;

    const token = localStorage.getItem("token");
    console.log(token);
    useEffect(() => {
        fetch(`${domain}/api/account`, {
            method: "PUT",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify({ token })
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
            })
    }, []);
    
    return (
        <div>
            <h3> Welcome to the Account Page</h3>
            <span class="guidelines-button" variant="primary" onClick={handleShow}>
                Read Guidelines
            </span>
            <Guidelines show={show} setShow={setShow}/>
        </div>
    )
}

export default Account;