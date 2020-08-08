import React, { useState, useEffect, Fragment } from "react";

import {Map, Marker, Popup, TileLayer } from "react-leaflet";
import LeafletSearch from "react-leaflet-search";
import L from 'leaflet';
import Guidelines from "./Guidelines";


//Currently, Florida is loaded in upon first entering the app
//we need to change this so the user's selected state is loaded in from his/her account schema
const position = [27.6648, -81.5158];

const ProtestMap = (props) => {

  //const [visited, setVisited] = useState(false);
  const [viewGuide, setViewGuide] = useState(false);
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const popupModalValue = localStorage.getItem("popupModal");
    console.log("I got here, I am tired " + popupModalValue);
    if (!popupModalValue) {
      const timer = setTimeout(() => {
        localStorage.setItem("popupModal", "bla");
        setViewGuide(true);
        console.log("I got here, I am tiredddddddd");
      }, 2000);
  
      return () => clearTimeout(timer);
    }
  }, []);


  const [addProtestBox, setAddProtestBox] = useState(false);
  const [peaceful, setPeaceful] = useState(true);
  const [protestAddress, setProtestAddress] = useState("");
  const [userLocation, setUserLocation] = useState([27.6648, -81.5158]);
  const [protestList, setProtestList] = useState([]);
  const [creatingProtest, setCreatingProtest] = useState(null);
  const [filters, setFilters] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const [protestInfo, setProtestInfo] = useState("");


  const usernameToken = localStorage.getItem("token");
  //console.log("usernameToken: "+usernameToken);
  //let currentUsername = "";

  const greenPin = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', 
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const redPin = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', 
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const domain = `${window.location.origin === "http://localhost:3000" ? "http://localhost:5000" : window.location.origin}`;

  useEffect(() => {
    fetch(`${domain}/api/protests`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProtestList(data);
      });
  }, []);

 // useEffect(() => {
    fetch(`${domain}/api/reports`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({usernameToken: usernameToken}),
    })
      .then((res) => res.json())
      .then((data) => data._id)
      .then( (id) => {
              setCurrentUsername(id);
          }
      );
 // }, []);

  //current location user

  //   useEffect(() => {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setUserLocation([position.coords.latitude, position.coords.longitude]);
  //       },
  //       () => console.log("error getting position")
  //     );
  //   }, []);

  const handleAddProtest = () => {
    const token = localStorage.getItem("token");

    console.log("peaceful", peaceful);

    const newProtest = {
      peaceful,
      protestAddress,
      coordinates: {
        lat: creatingProtest.lat,
        long: creatingProtest.lng,
      },
      token,
      protestInfo
    };

    fetch(`${domain}/api/protest`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newProtest),
    })
      .then((res) => res.json())
      .then((data) => {
        setAddProtestBox(false);
        setProtestAddress("");
        setProtestInfo("");
        setPeaceful(true);
        setCreatingProtest(null);
        setProtestList([...protestList, data]);
      });
  };

  const createProtest = (e) => {
    setCreatingProtest(null);
    setAddProtestBox(false);
    setCreatingProtest(e.latlng);
    setAddProtestBox(true);
  };

  const handleFilter = (type) => {
    let newFilters;
    if (filters.includes(type)) {
      newFilters = filters.filter((f) => f !== type);
    } else {
        newFilters = [...filters, type];
    }
    setFilters(newFilters);
  };


  const handleDeleteProtest = (protestId) => {
    const route = `${domain}/api/protest/${protestId}`;
    const token = localStorage.getItem("token");
    console.log("token", token);
    fetch(route, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("remove", data);
        const newProtestList = protestList.filter(
          (protest) => protest._id !== protestId
        );
        setProtestList(newProtestList);
      });
  };

  const renderCreateProtest = () => {
    const locationClone = { ...creatingProtest };
    const popupLocation = {
      lat: locationClone.lat + 0.04,
      lng: locationClone.lng,
    };
    return (
      <Fragment>
        <Marker position={creatingProtest}></Marker>
        <Popup keepInView position={popupLocation}>
          <div
            style={{ backgroundColor: "rgb(120,120,120)" }}
            className="add-protest-box"
          >
            <span className="add-protest-box-span">
              <p>Peaceful</p>
              <input
                checked={peaceful === true}
                type="checkbox"
                onChange={(e) => setPeaceful(true)}
              />
            </span>
            <span className="add-protest-box-span">
              <p>Non-Peaceful</p>
              <input
                type="checkbox"
                checked={peaceful === false}
                onChange={(e) => setPeaceful(false)}
              />
            </span>
            <textarea
              value={protestInfo} 
              onChange={(e) => setProtestInfo(e.target.value)} 
              placeholder="Info about protest, example: you need to wear masks to assist, # of protesters"
            >
            </textarea>
            <button onClick={handleAddProtest}>Submit</button>
          </div>
        </Popup>
      </Fragment>
    );
  };

  const filterProtests = () => {
    if (filters.length > 0) {
      const includePeaceful = filters.includes("peaceful");
      const includeViolent = filters.includes("nonpeaceful");

      const newProtestList = protestList.filter((protest) => {
        let flag = false;
        if (includePeaceful && protest.isViolent === false) {
          flag = true;
        }
        if (includeViolent && protest.isViolent === true) {
            flag = true;
          }
          return flag;
        });
        console.log("newProtestList", newProtestList);
        return newProtestList;
      } else {
        return protestList;
    }
};

let count = 0;

const renderFilteredList = () => {
  return filterProtests().map((protest) => {
    //I am comparing ids here, not sure if these ids should be displayed in frontend, (is it safe? or should I compare usernames?)
    if(protest.user.toString() === currentUsername){
      count = 1;
    }
    //console.log(protest.peaceful);
    return (
      <Marker
        icon={protest.isViolent === true ? redPin : greenPin}
        position={[protest.coordinates.lat, protest.coordinates.long]}
      >
        <Popup>
          <span className="protest-span">
            <p>
              This protest is:{" "}
              {protest.isViolent ? "Not Peaceful" : "Peaceful"}
            </p>
              {protest.protestInfo && <p>{protest.protestInfo}</p>}
            {count==1 && <button onClick={() => handleDeleteProtest(protest._id)}>
              Delete Protest
            </button>}
          </span>
        </Popup>
      </Marker>
    );
  });
};

  return (
    <div style={{ height: "100%" }}>
      {viewGuide &&  <Guidelines show={show} setShow={setShow}/>}
      <div class="spacer2"></div>
      <div class="row taskbar rounded-pill mx-auto">
          <div class="col-1"></div>
          <div class="col">
            
            <div class="spacer"></div>
            <div class="halfspacer"></div>
            <div class="row">
              <label class="protestlabel">Filter by Protest Type:</label>
              <form onClick={(e) => e.stopPropagation()} action="">
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="checkbox-round peaceful"
                    id="peacefulCheck"
                    onClick={() => handleFilter("peaceful")}
                  ></input>
                  <label class="form-check-label" for="check1">
                    Peaceful
                  </label>
                </div>
                </form>
              <form onClick={(e) => e.stopPropagation()} action="">
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="checkbox-round nonpeaceful"
                    id="nonpeacefulCheck1"
                    onClick={() => handleFilter("nonpeaceful")}
                  ></input>
                  <label class="form-check-label" for="check2">
                    Non-peaceful
                  </label>
                </div>
                </form>
            </div>
            </div>
          <div class="col-3">
            <div class="halfspacer"></div>
            <button type="button" class="btn btn-block rounded-pill blue">
              Add Protest{" "}
            </button>
          </div>
          <div class="col-3">
            <div class="halfspacer"></div>
            <button type="button" class="btn btn-block rounded-pill blue">
              Delete Protest
            </button>
          </div>
        </div>
      <Map
        onClick={createProtest}
        class="container mapbox"
        center={userLocation}
        zoom={7}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {renderFilteredList()}

        {creatingProtest !== null && renderCreateProtest()}

        <LeafletSearch position="topleft" />

        
        <div class="spacer"></div>
      </Map>
    </div>
  );
};

export default ProtestMap;