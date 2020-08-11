import React, { useEffect, useState } from "react";
import Guidelines from "./Guidelines";

const Account = (props) => {
  localStorage.removeItem("map_location");
    const [pins, setPins] = useState([]);
    const [comments, setComments] = useState([]);
    const usernameToken = localStorage.getItem("token");
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [currentUsername, setCurrentUsername] = useState("");
    
    const domain = `${window.location.origin === "http://localhost:3000" ? "http://localhost:5000" : window.location.origin}`;
    const createHistory = require("history").createBrowserHistory;
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
              setPins(data.pins);
              setComments(data.comments);
            })
    }, []);

    //fetch username of current user
    fetch(`${domain}/api/sendid`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({usernameToken: usernameToken}),
    })
      .then((res) => res.json())
      .then((data) => data.username)
      .then( (username) => {
            setCurrentUsername(username);
          }
      );
    
    const goToPin = (coordinates) => {
      //props.setUserLocation([coordinates.lat, coordinates.long]);
      localStorage.setItem("map_location", JSON.stringify(coordinates));
      let history = createHistory();
      history.push("/map");
      let pathUrl = window.location.href;
      window.location.href = pathUrl;
    }

    var pinsArr;
    console.log(pins);
    if (pins && pins.length > 0) {
      pinsArr = pins.filter((obj) => obj).map(pin => 
        <div class="row mx-auto newsarticle" onClick={(e) => goToPin(pin.coordinates)}>
            <div class="col my-auto">
                <h3>{pin.address === "" ? "Address Not Found" : pin.address}</h3>
                <p>
                  <b>Info: </b>{`${pin.protestInfo === "" ? "None" : pin.protestInfo}`}<br/>
                  <b>Peaceful: </b>{`${pin.isViolent === true ? "No" : "Yes"}`} <br/>
                  <b>Latitude: </b>{pin.coordinates.lat} <br/>
                  <b>Longitude: </b>{pin.coordinates.long}
                </p> 
            </div>
        </div>
      );
    }
    
    console.log(currentUsername);
    var commentArr;
    if (comments && comments.length > 0) {
      commentArr = comments.filter((obj) => obj).map(comment =>
      <div class="row mx-auto newsarticle">
              <div class="col my-auto">
                  <h3>{comment.content}</h3>
                  <p>
                    <b>Date: </b>{comment.date.replace(/T(.*)/g, '')}<br/>
                    <b>Likes: </b>{comment.likes}<br/>
                    <b>Dislikes: </b>{comment.dislikes}<br/>
                  </p> 
              </div>
          </div>
      );
    }
    
    return (
        <div>
          <div class="spacer"></div>
          <div class="spacer"></div>
          <div class="row"><h2 class="mx-auto protestlabel">{currentUsername}'s Account</h2></div>
          <div class="row">
            <div class="col acct_col">
                <h3 class="acct_heading protestlabel">Protest History</h3>
                <div>{pinsArr}</div>
            </div>
            
            <div class="col acct_col">
                <div><h3 class="acct_heading protestlabel">Comment History</h3></div> 
                <div>{commentArr}</div>
            </div>
            
          </div>
          <button id="footer" className= "mx-auto submit-protest" onClick={handleShow}>Read Guidelines</button>
          <Guidelines show={show} setShow={setShow}/>
        </div>
    );
}

export default Account;