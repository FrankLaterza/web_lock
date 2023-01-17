import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { postAPI } from "./ControlItem";

import styled from "styled-components";

// styles
 
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
  background-color: rgb(233, 30, 75);
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
    background-color: black;
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

// tracks once per page load
let once = true;

// time :)
const now = new Date;
// sunset api
// https://api.sunrise-sunset.org/json?lat=28.6024274&lng=-81.2000599

// getting sunset and api stuff
const api_url = "https://api.sunrise-sunset.org/json?lat=28.6024274&lng=-81.2000599";

// get the background svg
const flake = "data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='60' height='60' patternTransform='scale(4) rotate(55)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0, 0%, 100%, 0)'/><path d='M30 28.46a.63.63 0 01-.63-.63v-6.3c0-.35.28-.63.63-.63s.63.28.63.63v6.3c0 .36-.28.63-.63.63zm1.88 1.09a.65.65 0 01-.56-.32.63.63 0 01.23-.87l5.46-3.15c.3-.18.69-.07.86.23.18.31.07.7-.23.87l-5.46 3.15a.54.54 0 01-.3.09zm5.46 5.32a.67.67 0 01-.32-.09l-5.47-3.15a.63.63 0 01-.23-.86c.18-.31.57-.42.86-.24l5.47 3.15c.3.18.41.57.24.87a.6.6 0 01-.55.32zM30 39.12a.63.63 0 01-.63-.63v-6.3c0-.35.28-.63.63-.63s.63.28.63.63v6.3c0 .34-.28.63-.63.63zm-7.34-4.24a.65.65 0 01-.56-.32.63.63 0 01.23-.86l5.46-3.15c.3-.18.69-.08.86.23.18.3.07.69-.23.86l-5.46 3.16a.58.58 0 01-.3.08zm5.45-5.33a.67.67 0 01-.32-.09l-5.47-3.15a.63.63 0 01-.24-.87c.18-.3.56-.4.87-.23l5.47 3.15c.3.18.4.57.23.87a.58.58 0 01-.54.32zm15.93-4.74c-.06 0-.12-.01-.17-.03l-2.7-.74a.65.65 0 01-.46-.78l.7-2.7a.64.64 0 01.79-.45c.33.09.54.44.45.78l-.54 2.1 2.08.56c.34.1.54.44.44.78-.05.3-.31.48-.59.48zm-1.39 3.05a.73.73 0 01-.18-.03l-5.3-1.46a.63.63 0 01-.44-.78l1.39-5.32a.64.64 0 01.78-.45c.33.08.54.44.45.77l-1.23 4.72 4.7 1.3c.34.08.55.43.45.77a.65.65 0 01-.62.48zm1.63-5.27a1.45 1.45 0 001.96-.53 1.44 1.44 0 10-1.96.53zm.71 14.64a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88zm-15.7 8.85a1.42 1.42 0 00.71 2.67 1.44 1.44 0 001.25-2.15c-.4-.68-1.28-.91-1.97-.52zm-13.57-8.66a1.44 1.44 0 10-.35 2.64c.37-.1.68-.34.87-.68.19-.33.25-.71.14-1.08a1.4 1.4 0 00-.66-.88zm-.71-17.5a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88zm15.36-8.62a1.44 1.44 0 10-.73 2.78 1.44 1.44 0 00.73-2.78zm11.7 28.6a.64.64 0 01-.62-.47l-.7-2.7a.64.64 0 01.45-.78l2.7-.74a.63.63 0 01.33 1.21l-2.08.57.54 2.1a.64.64 0 01-.45.78c-.07.03-.12.03-.18.03zm-3.33.3a.64.64 0 01-.62-.46l-1.4-5.33a.64.64 0 01.45-.77l5.3-1.47a.63.63 0 01.34 1.22l-4.7 1.29 1.23 4.72a.64.64 0 01-.46.78.52.52 0 01-.14.02zm-6.75 5.52a.63.63 0 01-.45-.2L30 44l-1.54 1.53a.63.63 0 01-.9 0 .63.63 0 010-.9l2-1.96a.63.63 0 01.9 0l1.99 1.96c.25.25.25.65 0 .9-.13.13-.3.19-.46.19zm1.92-2.73a.58.58 0 01-.44-.2L30 39.38l-3.47 3.43a.63.63 0 01-.9 0 .63.63 0 010-.9l3.92-3.86a.63.63 0 01.89 0l3.91 3.86c.25.25.25.65 0 .9-.1.12-.26.19-.44.19zm-15.97-3.08l-.16-.01a.64.64 0 01-.46-.78l.54-2.1-2.08-.57a.62.62 0 01-.44-.77.62.62 0 01.78-.44l2.7.74c.33.1.52.44.44.78l-.7 2.7c-.08.26-.34.44-.62.45zm3.32.3c-.05 0-.1 0-.16-.02a.64.64 0 01-.45-.78l1.23-4.72-4.7-1.29a.62.62 0 01-.45-.77.62.62 0 01.78-.44l5.3 1.46c.34.1.54.44.45.78l-1.4 5.32c-.05.26-.32.45-.6.45zm-5.32-15.38a.64.64 0 01-.61-.47.63.63 0 01.44-.78l2.08-.57-.54-2.1a.64.64 0 01.45-.77c.34-.09.69.12.78.45l.7 2.7a.64.64 0 01-.44.78l-2.7.73a.53.53 0 01-.16.03zm1.4 3.03a.64.64 0 01-.62-.47.63.63 0 01.44-.77l4.7-1.3-1.23-4.71a.64.64 0 01.46-.78c.34-.09.69.12.78.46l1.39 5.32a.64.64 0 01-.44.77l-5.3 1.47a.71.71 0 01-.18.01zM30 17.53a.58.58 0 01-.44-.2l-2-1.96a.63.63 0 010-.89.63.63 0 01.9 0L30 16l1.54-1.52a.63.63 0 01.9 0c.24.25.24.66 0 .9l-2 1.96a.64.64 0 01-.44.19zm0 4.63a.58.58 0 01-.44-.19l-3.91-3.87a.63.63 0 010-.9.63.63 0 01.9 0L30 20.65l3.48-3.43a.63.63 0 01.9 0c.24.25.24.66 0 .9l-3.92 3.86a.7.7 0 01-.47.2zm3.94-.56l-2.77 2.9a2.39 2.39 0 003.02 1.74l1.12-3.84c.23-.83-.78-1.41-1.37-.8zm5.3 7.63l-3.88-.97a2.38 2.38 0 000 3.49l3.89-.97c.82-.2.82-1.35 0-1.55zm-3.93 8.4l-1.12-3.85a2.4 2.4 0 00-3.02 1.75l2.77 2.89c.59.6 1.6.01 1.37-.8zm-9.27.79l2.77-2.9a2.39 2.39 0 00-3.02-1.74l-1.11 3.84c-.22.81.78 1.4 1.36.8zm-5.3-7.64l3.88.97a2.38 2.38 0 000-3.5l-3.88.98c-.81.2-.81 1.36 0 1.55zm3.95-8.4l1.12 3.84c1.32.4 2.7-.4 3.02-1.74l-2.77-2.89c-.6-.6-1.6-.02-1.37.8zM30 32.82a2.81 2.81 0 110-5.63 2.81 2.81 0 010 5.63zm0-4.36a1.54 1.54 0 100 3.08 1.54 1.54 0 000-3.08z'  stroke-width='1' stroke='none' fill='hsla(191, 89%, 19%, 1)'/><path d='M55.21 59.95a.59.59 0 00-.3-.53l-1.55-.87a.58.58 0 00-.45-.06l-2.84.78a.58.58 0 00-.43.57c0 .26.16.49.42.57l2.96.9.16.02c.1 0 .2-.03.3-.08l1.4-.8c.2-.1.33-.29.33-.5zm2.54-6.84l-2.1-2.06a.6.6 0 00-.71-.1.6.6 0 00-.29.66l.71 3c.04.16.14.3.28.38l1.4.82c.09.05.2.08.3.08.1 0 .2-.03.3-.08.19-.11.3-.3.3-.52l-.02-1.77c0-.15-.05-.3-.17-.41zm2.26 10a3.12 3.12 0 010-6.22 3.12 3.12 0 010 6.22zm0-5.04a1.92 1.92 0 000 3.84c1.05 0 1.92-.87 1.92-1.92 0-1.06-.87-1.92-1.92-1.92zm-14.7-3.03a.6.6 0 01-.58-.44.6.6 0 01.42-.72l2.95-.8-.82-3.04a.6.6 0 01.42-.73.6.6 0 01.73.43l.97 3.62c.04.15.02.31-.05.45a.6.6 0 01-.36.27l-3.52.95-.16.01zm1.1 3.63a.6.6 0 01-.58-.44.6.6 0 01.42-.72l6.5-1.74-1.7-6.37a.6.6 0 01.42-.73.6.6 0 01.73.42l1.86 6.95c.04.15.01.32-.05.45a.56.56 0 01-.36.28l-7.08 1.9h-.17zm11.46.58c-.1 0-.2-.03-.3-.09l-13.55-7.82a.59.59 0 01-.22-.8.59.59 0 01.8-.23l13.56 7.83c.29.16.38.53.22.8-.1.2-.3.3-.51.3zm2.16-11.6a.6.6 0 01-.42-.17l-2.58-2.58a.59.59 0 010-.83c.24-.24.6-.24.84 0l2.15 2.15 2.23-2.24c.24-.23.6-.23.84 0 .23.24.23.6 0 .84l-2.64 2.64a.51.51 0 01-.42.2zm.03 5.39a.6.6 0 01-.42-.18l-5.2-5.2a.59.59 0 010-.83c.24-.23.6-.23.84 0l4.77 4.77 4.67-4.67c.23-.23.6-.23.84 0 .23.23.23.6 0 .83l-5.09 5.09a.51.51 0 01-.4.19zm.04 5.03a.58.58 0 01-.59-.6V41.84c0-.33.26-.59.6-.59.32 0 .58.26.58.6v15.64a.58.58 0 01-.59.59zm-57.65-2.2a.59.59 0 00.6 0l1.53-.91c.14-.08.24-.2.28-.37l.74-2.84a.58.58 0 00-.28-.66.6.6 0 00-.71.09L2.36 53.3a.61.61 0 00-.19.42l-.01 1.62c-.02.22.1.41.29.52zm7.49 3.7l-2.96-.9a.62.62 0 00-.47.06l-1.4.8c-.2.1-.3.3-.3.51 0 .22.1.41.3.52l1.54.88c.1.05.2.08.29.08l.16-.03 2.84-.78c.26-.07.44-.3.44-.56a.65.65 0 00-.44-.59zM.01 63.1a3.12 3.12 0 010-6.22 3.12 3.12 0 010 6.22zm0-5.04a1.92 1.92 0 000 3.84 1.92 1.92 0 000-3.84zm14.82-2.95l-.15-.01-3.62-.97a.56.56 0 01-.35-.28.58.58 0 01-.06-.45l.95-3.52a.6.6 0 01.72-.43c.32.09.51.41.43.73l-.8 2.95 3.05.82c.31.08.5.4.42.72a.62.62 0 01-.59.44zm-1.31 3.6h-.15l-6.95-1.87a.6.6 0 01-.43-.73l1.9-7.08a.6.6 0 01.73-.43c.32.09.51.42.43.73l-1.74 6.5 6.37 1.72c.32.08.5.41.43.73a.63.63 0 01-.6.44zm-11.28.7a.6.6 0 01-.52-.3.59.59 0 01.22-.8l13.55-7.83a.59.59 0 01.8.22c.17.29.08.64-.21.8L2.53 59.35a.54.54 0 01-.29.08zM.04 47.66a.6.6 0 01-.43-.18l-2.58-2.58a.59.59 0 010-.83c.24-.24.6-.24.84 0l2.15 2.15 2.23-2.24c.24-.23.6-.23.84 0 .23.24.23.6 0 .84L.45 47.46a.51.51 0 01-.42.2zm.02 5.38a.6.6 0 01-.42-.18l-5.2-5.2a.59.59 0 010-.83c.24-.23.6-.23.84 0L.05 51.6l4.67-4.67c.23-.23.6-.23.84 0 .23.23.23.6 0 .83L.47 52.85a.51.51 0 01-.4.19zm.04 5.03a.58.58 0 01-.59-.6V41.84c0-.33.26-.59.6-.59.32 0 .58.26.58.6v15.64a.58.58 0 01-.59.59zM57.57 4.12a.6.6 0 00-.6 0l-1.54.9a.58.58 0 00-.27.38l-.74 2.83c-.07.26.04.52.27.66.1.06.2.08.3.08.15 0 .3-.05.41-.16l2.25-2.12a.61.61 0 00.2-.43V4.64a.56.56 0 00-.28-.52zM55.2-.05a.59.59 0 00-.3-.53l-1.55-.87a.58.58 0 00-.45-.06l-2.84.78a.58.58 0 00-.43.57c0 .26.16.49.42.57l2.96.9.16.02c.1 0 .2-.03.3-.08l1.4-.8c.2-.1.33-.29.33-.5zm4.8 3.16a3.12 3.12 0 010-6.22 3.12 3.12 0 010 6.22zm0-5.04a1.92 1.92 0 000 3.84c1.05 0 1.92-.87 1.92-1.92 0-1.06-.87-1.92-1.92-1.92zm-2.69 18.1a.6.6 0 01-.42-.18.59.59 0 010-.84l2.64-2.64a.61.61 0 01.84 0l2.57 2.57c.24.24.24.6 0 .84a.59.59 0 01-.83 0l-2.15-2.15L57.73 16a.56.56 0 01-.4.17zm7.82-2.84a.6.6 0 01-.42-.18L59.95 8.4l-4.67 4.67a.59.59 0 01-.84 0 .59.59 0 010-.84l5.09-5.08c.23-.23.6-.23.83 0l5.2 5.2c.23.22.23.6 0 .83a.58.58 0 01-.42.16zm-5.24 5.41a.58.58 0 01-.6-.59V2.51c0-.33.27-.6.6-.6.33 0 .59.27.59.6v15.64a.58.58 0 01-.6.6zm-12.05-8.19l-.15-.01a.6.6 0 01-.42-.73l.8-2.95-3.05-.82a.6.6 0 01-.42-.72.6.6 0 01.72-.43l3.62.97c.32.09.5.42.42.73l-.94 3.52a.61.61 0 01-.58.44zm3.69.86l-.15-.01a.6.6 0 01-.43-.73l1.74-6.5-6.37-1.72a.6.6 0 01-.42-.72.6.6 0 01.72-.43l6.95 1.86c.32.09.5.42.43.73l-1.9 7.08a.57.57 0 01-.57.44zm-7.32-1.83a.6.6 0 01-.52-.3.59.59 0 01.22-.81L57.47.64a.59.59 0 01.81.22c.17.3.07.65-.22.81L44.51 9.5a.5.5 0 01-.29.09zM9.94-.44l-2.96-.89a.62.62 0 00-.47.06l-1.4.79c-.2.11-.3.3-.3.52 0 .22.1.41.3.52l1.54.88c.1.05.2.08.29.08l.16-.03L9.94.71c.26-.07.44-.3.44-.56a.65.65 0 00-.44-.59zm-5.3 5.81A.62.62 0 004.36 5l-1.4-.82a.6.6 0 00-.6 0c-.19.1-.3.3-.3.52l.02 1.77c0 .16.06.31.17.42l2.1 2.06a.58.58 0 00.7.08.6.6 0 00.29-.66zM0 3.11a3.12 3.12 0 010-6.22 3.12 3.12 0 010 6.22zm0-5.04A1.92 1.92 0 000 1.9a1.92 1.92 0 000-3.84zM12.16 10.7a.6.6 0 01-.58-.44l-.97-3.62a.6.6 0 01.43-.72l3.52-.95a.6.6 0 01.72.43.6.6 0 01-.42.72l-2.95.8.83 3.04a.6.6 0 01-.43.73l-.15.01zm-3.78.66a.6.6 0 01-.58-.44L5.94 3.97a.65.65 0 01.05-.45.6.6 0 01.36-.27l7.08-1.9a.6.6 0 01.73.42.6.6 0 01-.42.72L7.23 4.23l1.71 6.37a.6.6 0 01-.42.73c-.03.03-.09.03-.14.03zm7.3-1.6c-.1 0-.2-.03-.3-.09L1.83 1.85a.59.59 0 01-.22-.8.59.59 0 01.8-.23l13.56 7.83c.29.16.38.53.22.8-.11.2-.3.3-.5.3zm-18.36 6.4A.6.6 0 01-3.1 16a.59.59 0 010-.84l2.64-2.64a.61.61 0 01.84 0l2.57 2.57c.24.24.24.6 0 .84a.59.59 0 01-.83 0l-2.15-2.15L-2.27 16a.56.56 0 01-.4.17zm7.82-2.83a.6.6 0 01-.42-.18L-.05 8.4l-4.67 4.67a.59.59 0 01-.84 0 .59.59 0 010-.84l5.09-5.08c.23-.23.6-.23.83 0l5.2 5.2c.23.22.23.6 0 .83a.58.58 0 01-.42.16zM-.1 18.74a.58.58 0 01-.6-.59V2.51c0-.33.27-.6.6-.6.33 0 .59.27.59.6v15.64a.58.58 0 01-.6.6z'  stroke-width='1' stroke='none' fill='hsla(231, 36%, 70%, 1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>";


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

    const [auth, setAuth] = useState(1);
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
        event.currentTarget.style.backgroundColor = lock
            ? "rgb(60, 194, 88)"
            : "rgb(233, 30, 75)";
        resetAnimation(event); // call the reset
    }

    // remove the ease
    const resetAnimation = setTimeout(function (event) {
        event.currentTarget.style.transition = `none`;
    }, 2000);



    
    const [backgroundColor, setBackgroundColor] = useState('rgb(198, 198, 198)');
    const [color, setInputTextColor] = useState('rgb(53, 53, 53)');

    // without await
    function getSunset() {
        return fetch(api_url).then(response => response.json().then(obj => {
            let current = now.getTime();
            let sunrise = new Date(obj.results.sunrise).getTime();
            let sunset = new Date(obj.results.sunset).getTime();
            if (sunrise < current && sunset > current) {
                // console.log("sun is up");
                setBackgroundColor('rgb(198, 198, 198)');
                setInputTextColor('rgb(53, 53, 53)');
            }
            else {
                // console.log("sun is down");
                setBackgroundColor('rgb(53, 53, 53)');
                setInputTextColor('rgb(198, 198, 198)');
            }

        }))
    }


    // runs once
    if(once){
        getSunset();
        
        once = false;
    }



    function Ret() {
        return (
            <>
                {auth ? (
                    <Conatiner style={{ backgroundImage: `url("${flake}")`, backgroundColor }}>
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
                        <h1 style={{color}}>{lock ? "Locked" : "Unlocked"}</h1>
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
