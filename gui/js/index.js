import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import { FiBox as HeaderIcon } from "react-icons/fi";
import { v4 as uuid } from "uuid";
import {
  GlobalStyle,
  Menu,
  Header,
  Page,
  Hamburger,
} from "./comp/UiComponents";
import { WifiPage } from "./comp/WifiPage";
import { ConfigPage } from "./comp/ConfigPage";
import { LockPage } from "./comp/LockPage";
import { PasswordPage } from "./comp/PasswordPage";
import { DashboardPage } from "./comp/DashboardPage";
import { FilePage } from "./comp/FilePage";
import { FirmwarePage } from "./comp/FirmwarePage";

import { bin2obj } from "./functions/configHelpers";

import Config from "./configuration.json";
import Dash from "./dashboard.json";

let loc;
if (Config.find((entry) => entry.name === "language")) {
  loc = require("./lang/" +
    Config.find((entry) => entry.name === "language").value +
    ".json");
} else {
  loc = require("./lang/en.json");
}

let url = "http://192.168.1.54";
if (process.env.NODE_ENV === "production") {
  url = window.location.origin;
}

if (process.env.NODE_ENV === "development") {
  require("preact/debug");
}

// const displayData = new Array();

function Root() {
  const [menu, setMenu] = useState(false);
  const [configData, setConfigData] = useState(new Object());
  const [binSize, setBinSize] = useState(0);
  const [socket, setSocket] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(url.replace("http://", "ws://").concat("/ws"));
    ws.addEventListener("message", wsMessage);

    setSocket(ws);
    fetchData();
  }, []);

  function wsMessage(event) {
    event.data.arrayBuffer().then((buffer) => {
      // const dv = new DataView(buffer, 0);
      // const timestamp = dv.getUint32(0, true);

      let dataIn = new Object();
      dataIn = bin2obj(buffer.slice(4, buffer.byteLength), Dash);
      // console.log(dataIn.length, Object.keys(dataIn).length === 0, Object.keys(dataIn).length);

      if (Object.keys(dataIn).length !== 0) {
        setData(dataIn);
        // console.log("updated");
      }

      // setData([timestamp, bin2obj(buffer.slice(4,buffer.byteLength), Dash)]);
      // displayData.push([timestamp, bin2obj(buffer.slice(4,buffer.byteLength), Dash)]);
    });
  }

  function fetchData() {
    fetch(`${url}/api/config/get`)
      .then((response) => {
        return response.arrayBuffer();
      })
      .then((data) => {
        setBinSize(data.byteLength);
        setConfigData(bin2obj(data, Config));
      });
  }

  let projectName = configData["projectName"];
  if (typeof projectName === "undefined") {
    projectName = Config.find((entry) => entry.name === "projectName")
      ? Config.find((entry) => entry.name === "projectName").value
      : "ESP8266";
  }
  let projectVersion = configData["projectVersion"];
  if (typeof projectVersion === "undefined") {
    projectVersion = Config.find((entry) => entry.name === "projectVersion")
      ? Config.find((entry) => entry.name === "projectVersion").value
      : "";
  }

  // make id for the browser
  const unique_id = uuid();
  let storeduuid = localStorage.getItem("uuid");
  if (storeduuid === null) {
    localStorage.setItem("uuid", unique_id);
    storeduuid = unique_id;
  }

  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Page>
          <Switch>
            <Route exact path="/">
              <PasswordPage API={url} uuid={storeduuid} data={data} />
            </Route>
            {/* <Route exact path="/files">
                        <FilePage API={url}
                            data={data} />
                    </Route> */}
            {/* <Route exact path="/dashboard">
                        <DashboardPage API={url} 
                            socket={socket}
                            data={data} 
                            requestData={() => {return displayData;}} />
                    </Route> */}
            <Route exact path="/lock">
              <LockPage API={url} socket={socket} data={data} />
            </Route>
            {/* <Route exact path="/firmware">
                        <FirmwarePage API={url} 
                            data={data} /> 
                    </Route> */}
            <Route path="/wifi">
              <WifiPage API={url} />
            </Route>
          </Switch>
        </Page>
      </BrowserRouter>
    </>
  );
}

ReactDOM.render(<Root />, document.getElementById("root"));
