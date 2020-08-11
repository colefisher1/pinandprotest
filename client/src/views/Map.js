import React, { useState, useEffect, Fragment, useContext } from "react";

import {Map, Marker, Popup, TileLayer } from "react-leaflet";
import LeafletSearch from "react-leaflet-search";
import L from 'leaflet';
import Guidelines from "./Guidelines";

//Currently, Florida is loaded in upon first entering the app
//we need to change this so the user's selected state is loaded in from his/her account schema
const florida = [27.6648, -81.5158];

const ProtestMap = (props) => {
  
  const [addProtestBox, setAddProtestBox] = useState(false);
  const [peaceful, setPeaceful] = useState(true);
  const [protestAddress, setProtestAddress] = useState("");
  //const [userLocation, setUserLocation] = useState(props.userLocation);
  const [protestList, setProtestList] = useState([]);
  const [creatingProtest, setCreatingProtest] = useState(null);
  const [filters, setFilters] = useState([]);
  
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  
  console.log(localStorage.getItem("map_location"));

  let locationData, location, zoomConstant;
  if(localStorage.getItem("map_location")) {
    locationData = JSON.parse(localStorage.getItem("map_location"));
    location = [locationData.lat, locationData.long];
    zoomConstant = 18;

  }
  else {
    location = florida;
    zoomConstant = 7;
  }
  const [userLocation, setUserLocation] = useState(location);
  const [zoomAmount, setZoomAmount] = useState(zoomConstant);
  const [currentUserId, setCurrentUserId] = useState("");
  const [protestInfo, setProtestInfo] = useState("");

  const usernameToken = localStorage.getItem("token");

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

  const yellowPin = new L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png', 
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

    //fetch user id of current user
    fetch(`${domain}/api/sendid`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({usernameToken: usernameToken}),
    })
      .then((res) => res.json())
      .then((data) => data._id)
      .then( (id) => {
              setCurrentUserId(id);
          }
      );

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
      address: protestAddress,
      coordinates: {
        lat: creatingProtest.lat,
        long: creatingProtest.lng,
      },
      token,
      protestInfo
    };

    console.log(newProtest);
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
    localStorage.removeItem("map_location");
    setCreatingProtest(null);
    setAddProtestBox(false);
    setCreatingProtest(e.latlng);
    setAddProtestBox(true);
    
    const proxyUrl = "https://cors-anywhere.herokuapp.com/"
    fetch(`${proxyUrl}http://open.mapquestapi.com/geocoding/v1/reverse?key=p3ngfpqJsUmii1sppAGgAAe9YgCdqoHY
    &location=${e.latlng.lat},${e.latlng.lng}`)
      .then(response => {
          return response.json();
      })
      .then(data => {
          //Store fetched data into an array and set state
          console.log(data);
          let street = data.results[0].locations[0].street;
          let city = data.results[0].locations[0].adminArea5;
          let state = data.results[0].locations[0].adminArea3;
          let address = "";  
          if(street !== ""){address += street + ", ";}
          if(city !== ""){address += city + ", ";}
          if(state !== ""){address += state;}

          setProtestAddress(address);
      });
    
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
    localStorage.removeItem("map_location");
    
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
        setUserLocation(florida);
        setZoomAmount(7);
      });
  
  };

  const renderCreateProtest = () => {
    const locationClone = { ...creatingProtest };
    const popupLocation = {
      lat: locationClone.lat,
      lng: locationClone.lng,
    };
    return (
      <Fragment>
        <Marker position={creatingProtest}></Marker>
        <Popup keepInView position={popupLocation}>
          <div
            //style={{ backgroundColor: "rgb(120,120,120)" }}
            className="add-protest-box"
          >
            <h4 class= "mx-auto protestlabel">Add Protest</h4>
            <span className="add-protest-box-span">
              <label class="form-check-label">Peaceful</label>
              <input
                checked={peaceful === true}
                type="checkbox"
                onChange={(e) => setPeaceful(true)}
              />
              <label class= "form-check-label">Non-Peaceful</label>
              <input
                type="checkbox"
                checked={peaceful === false}
                onChange={(e) => setPeaceful(false)}
              />
            </span>
            <textarea
              class="mx-auto text-box"
              value={protestInfo} 
              onChange={(e) => setProtestInfo(e.target.value)} 
              placeholder="Enter Protest Information (movement, mask requirement, # of protesters, etc.)"
            >
            </textarea>
            <button className= "mx-auto submit-protest" onClick={handleAddProtest}>Submit</button>
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
    if(protest.user.toString() === currentUserId){
      count = 1;
    }
    //let date = protest.date.replace(/T(.*)/g, '');
    let date = new Date(protest.date);
    let formattedDate = date.toLocaleString("en-US");
   // if(protest.address.containe=s)
    return (
      <Marker
        icon={protest.isViolent === true ? redPin : greenPin}
        position={[protest.coordinates.lat, protest.coordinates.long]}
      >
        <Popup>
          <span className="protest-span">
            <p>Reported at: {formattedDate}</p>
            <p>
              This protest is:{" "}
              {protest.isViolent ? "Not Peaceful" : "Peaceful"}
            </p>
            {(protest.address && !protest.address.includes("undefined")) && <p>Address: {protest.address}</p>}
              {protest.protestInfo && <p>{protest.protestInfo}</p>}
            {count==1 && <button className="deleteProtest" onClick={() => handleDeleteProtest(protest._id)}>
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
      <div class="spacer2"></div>
      <div class="row taskbar rounded-pill mx-auto">
          <div class="col-1"></div>
          <div class="col my-auto">
            <div class="row mx-auto">
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
        </div>
      <Map
        onClick={createProtest}
        class="container mapbox"
        center={userLocation}
        zoom={zoomAmount}
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