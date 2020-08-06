import React, { useEffect } from "react";

const Account = () => {
    
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
            });
    }, []);
    

    
    return (
        <div>
            <h3> Welcome to the Account Page</h3>
        </div>
    )
}

export default Account;