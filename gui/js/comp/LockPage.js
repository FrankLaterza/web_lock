import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { postAPI } from "./ControlItem";

import styled from "styled-components";

const spooky = "data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M82.42 180h-1.415L0 98.995v-2.827L6.167 90 0 83.833V81.004L81.005 0h2.827L90 6.167 96.167 0H98.996L180 81.005v2.827L173.833 90 180 96.167V98.996L98.995 180h-2.827L90 173.833 83.833 180H82.42zm0-1.414L1.413 97.58 8.994 90l-7.58-7.58L82.42 1.413 90 8.994l7.58-7.58 81.006 81.005-7.58 7.58 7.58 7.58-81.005 81.006-7.58-7.58-7.58 7.58zM175.196 0h-25.832c1.033 2.924 2.616 5.59 4.625 7.868C152.145 9.682 151 12.208 151 15c0 5.523 4.477 10 10 10 1.657 0 3 1.343 3 3v4h16V0h-4.803c.51.883.803 1.907.803 3 0 3.314-2.686 6-6 6s-6-2.686-6-6c0-1.093.292-2.117.803-3h10.394-13.685C161.18.938 161 1.948 161 3v4c-4.418 0-8 3.582-8 8s3.582 8 8 8c2.76 0 5 2.24 5 5v2h4v-4h2v4h4v-4h2v4h2V0h-4.803zm-15.783 0c-.27.954-.414 1.96-.414 3v2.2c-1.25.254-2.414.74-3.447 1.412-1.716-1.93-3.098-4.164-4.054-6.612h7.914zM180 17h-3l2.143-10H180v10zm-30.635 163c-.884-2.502-1.365-5.195-1.365-8 0-13.255 10.748-24 23.99-24H180v32h-30.635zm12.147 0c.5-1.416 1.345-2.67 2.434-3.66l-1.345-1.48c-1.498 1.364-2.62 3.136-3.186 5.14H151.5c-.97-2.48-1.5-5.177-1.5-8 0-12.15 9.84-22 22-22h8v30h-18.488zm13.685 0c-1.037-1.793-2.976-3-5.197-3-2.22 0-4.16 1.207-5.197 3h10.394zM0 148h8.01C21.26 148 32 158.742 32 172c0 2.805-.48 5.498-1.366 8H0v-32zm0 2h8c12.15 0 22 9.847 22 22 0 2.822-.53 5.52-1.5 8h-7.914c-.567-2.004-1.688-3.776-3.187-5.14l-1.346 1.48c1.09.99 1.933 2.244 2.434 3.66H0v-30zm15.197 30c-1.037-1.793-2.976-3-5.197-3-2.22 0-4.16 1.207-5.197 3h10.394zM0 32h16v-4c0-1.657 1.343-3 3-3 5.523 0 10-4.477 10-10 0-2.794-1.145-5.32-2.992-7.134C28.018 5.586 29.6 2.924 30.634 0H0v32zm0-2h2v-4h2v4h4v-4h2v4h4v-2c0-2.76 2.24-5 5-5 4.418 0 8-3.582 8-8s-3.582-8-8-8V3c0-1.052-.18-2.062-.512-3H0v30zM28.5 0c-.954 2.448-2.335 4.683-4.05 6.613-1.035-.672-2.2-1.16-3.45-1.413V3c0-1.04-.144-2.046-.414-3H28.5zM0 17h3L.857 7H0v10zM15.197 0c.51.883.803 1.907.803 3 0 3.314-2.686 6-6 6S4 6.314 4 3c0-1.093.292-2.117.803-3h10.394zM109 115c-1.657 0-3 1.343-3 3v4H74v-4c0-1.657-1.343-3-3-3-5.523 0-10-4.477-10-10 0-2.793 1.145-5.318 2.99-7.132C60.262 93.638 58 88.084 58 82c0-13.255 10.748-24 23.99-24h16.02C111.26 58 122 68.742 122 82c0 6.082-2.263 11.636-5.992 15.866C117.855 99.68 119 102.206 119 105c0 5.523-4.477 10-10 10zm0-2c-2.76 0-5 2.24-5 5v2h-4v-4h-2v4h-4v-4h-2v4h-4v-4h-2v4h-4v-4h-2v4h-4v-2c0-2.76-2.24-5-5-5-4.418 0-8-3.582-8-8s3.582-8 8-8v-4c0-2.64 1.136-5.013 2.946-6.66L72.6 84.86C70.39 86.874 69 89.775 69 93v2.2c-1.25.254-2.414.74-3.447 1.412C62.098 92.727 60 87.61 60 82c0-12.15 9.84-22 22-22h16c12.15 0 22 9.847 22 22 0 5.61-2.097 10.728-5.55 14.613-1.035-.672-2.2-1.16-3.45-1.413V93c0-3.226-1.39-6.127-3.6-8.14l-1.346 1.48C107.864 87.987 109 90.36 109 93v4c4.418 0 8 3.582 8 8s-3.582 8-8 8zM90.857 97L93 107h-6l2.143-10h1.714zM80 99c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm20 0c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z' fill='%23000000' fill-opacity='0.42' fill-rule='evenodd'/%3E%3C/svg%3E"

const Live = styled.span`
  color: #c4e052 !important;
  border: 1px solid #c4e052;
  background-color: #e6f9b8;
  border-radius: 3px;
  font-size: 0.5em !important;
  padding: 0.2em;
  vertical-align: 0.3em;
`;

const Connecting = styled.span`
  color: #ddd !important;
  border: 1px solid #ddd;
  background-color: #f4f4f4;
  border-radius: 3px;
  font-size: 0.5em !important;
  padding: 0.2em;
  vertical-align: 0.3em;
`;

const Disconnected = styled.span`
  color: #ff3333 !important;
  border: 1px solid #ff3333;
  background-color: #ffb3b3;
  border-radius: 3px;
  font-size: 0.5em !important;
  padding: 0.2em;
  vertical-align: 0.3em;
`;

const Conatiner = styled.div`
  overflow: none;
  background-color: #d66e0d;
  font-family: "Roboto", sans-serif;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  color: white;
  padding: 0;
  margin: 0;
  font-size: 2rem;
  overflow: hidden;
`;

const Header = styled.div`
  background-color: rgb(31, 31, 31);
  width: 100%;
  height: 100px;
  gap: 30px;
  font-size: 3rem;
  text-align: center;
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LockBase = styled.div`
  margin-top: 100px;
  width: 25vw;
  height: 25vw;
  background-color: red;
  border-radius: 50%;
  border: solid;
  border-color: black;
  border-width: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0s ease;

  @media (max-width: 800px) {
    width: 80vw;
    height: 80vw;
  }
`;

const Lock = styled.div`
    margin-top: 10vw;
    width: 5vw;
    height: 16vw;
    background-color: rgb(46, 46, 46);
    border: solid;
    border-color: black;
    border-width: 1vw;
    border-radius: 10vw;
  }
  
  @media (max-width: 800px) {
    margin-top: 30vw;
    width: 18vw;
    height: 55vw;
    border-radius: 18vw;
    border-width: 3vw;
  }
  
`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import Config from "./../configuration.json";
let loc;
if (Config.find((entry) => entry.name === "language")) {
  loc = require("./../lang/" +
    Config.find((entry) => entry.name === "language").value +
    ".json");
} else {
  loc = require("./../lang/en.json");
}

export function LockPage(props) {
  const [counter, setCounter] = useState(0);
  const [socketStatus, setSocketStatus] = useState(0);

  const [auth, setAuth] = useState(0);
  setAuth(props.data.passwordAcceptance);

  useEffect(() => {
    document.title = loc.titleDash;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCounter((counter) => counter + 1);
      if (!(socketStatus == 0 && props.socket.readyState != 1)) {
        setSocketStatus(props.socket.readyState);
      }
    }, 40); //refresh with 25FPS

    return () => clearTimeout(timer);
  }, [counter]);

  const [lock, setLock] = useState(true);

  function handleClick(event) {
    setLock(lock ? 0 : 1);
    if (lock) {
      postAPI("Unlock", true, "bool", props.API);
      sleep(2000);
    } else {
      postAPI("Lock", true, "bool", props.API);
      sleep(2000);
    }
    
    event.currentTarget.style.transform = `rotate(${lock * 90}deg)`;
    event.currentTarget.style.transition = `2s ease`;
    event.currentTarget.style.backgroundColor = lock ? "green" : "red";
  }

  // remove the ease

  // console.log(props.data);

  function Ret() {
    return (
      <>
        {auth ? (
          <Conatiner style={{backgroundImage: `url("${spooky}")`}}>
            <Header>
              <b>Web Lock</b>
              {socketStatus != 0 ? (
                socketStatus == 1 ? (
                  <Live>{loc.dashLive}</Live>
                ) : (
                  <Disconnected>{loc.dashDisconn}</Disconnected>
                )
              ) : (
                <Connecting>{loc.dashConn}</Connecting>
              )}
            </Header>
            <LockBase onClick={handleClick}>
              <Lock />
            </LockBase>
            <h1>{lock ? "Locked" : "Unlocked"}</h1>
          </Conatiner>
        ) : (
          <div>no auth</div>
        )}
      </>
    );
  }

  return Ret();
}

LockPage.propTypes = {
  data: PropTypes.object,
  API: PropTypes.string,
  socket: PropTypes.object,
};
