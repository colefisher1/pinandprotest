import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import ProtestMap from "./Map";

const Account = () => {
    const [pins, setPins] = useState([]);
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
              setPins(data);
            })
    }, []);
    
    const onDeleteClick = (event) => {
      event.preventDefault();
      //Remove pin from db here
    }
    if (pins && pins.length > 0) {
      const pinsArr = pins.map(pin => 
          <div class="row mx-auto newsarticle">
              <div class="col my-auto">
                  <h3>{pin.address}</h3>
                  <p>
                    <b>Peaceful: </b>{`${pin.isViolent === true ? "No" : "Yes"}`} <br/>
                    <b>Latitude: </b>{pin.coordinates.lat} <br/>
                    <b>Longitude: </b>{pin.coordinates.long}
                  </p> 
              
                  <div className="delete-button bottom-corner">
                    <i class="far fa-trash-alt" style={{marginRight: "5px"}}></i>
                    <span onClick={onDeleteClick}>Delete</span>
                  </div>
              </div>
          </div>
      );

      return (
          <div>
              <div class="spacer"></div>
              <div class="spacer"></div>
              <div class="row"><h2 class="mx-auto protestlabel">Account</h2></div>
              <div class="row">
                <div class="col acct_col">
                    <h3 class="acct_heading protestlabel">Protest History</h3>
                    <div>{pinsArr}</div>
                </div>
                
                <div class="col acct_col">
                    <div><h3 class="acct_heading protestlabel">Comment History</h3></div> 
                </div>
                
              </div>
              
          </div>
      );
  }
  else {
      return (
          <div></div>
      );
  }
}

export default Account;