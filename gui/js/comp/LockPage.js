import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { postAPI } from "./ControlItem";

import styled from "styled-components";

const Live = styled.span`
    color:#c4e052 !important;
    border: 1px solid #c4e052;
    background-color:#e6f9b8;     
    border-radius:3px;
    font-size:0.5em !important;  
    padding:0.2em; 
    vertical-align:0.3em;
`;

const Connecting = styled.span`
    color:#ddd !important;
    border: 1px solid #ddd;
    background-color:#f4f4f4;
    border-radius:3px;
    font-size:0.5em !important;
    padding:0.2em;
    vertical-align:0.3em;
`;

const Disconnected = styled.span`
    color:#ff3333 !important;
    border: 1px solid #ff3333;
    background-color:#ffb3b3;
    border-radius:3px;
    font-size:0.5em !important;
    padding:0.2em;
    vertical-align:0.3em;
`;

const Conatiner = styled.div`
    overflow: none;
    background-color: rgb(44, 44, 44);
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
    margin-top: 100px;;
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
    transition: 2s ease;

  
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
    return new Promise(resolve => setTimeout(resolve, ms));
}

import Config from "./../configuration.json";
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
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
            setCounter(counter => counter + 1);
            if (!(socketStatus == 0 && props.socket.readyState != 1)) {
                setSocketStatus(props.socket.readyState);
            }
        }, 40); //refresh with 25FPS

        return () => clearTimeout(timer);

    }, [counter]);
    
    const [lock, setLock] = useState(true);
    
    function handleClick(event){
        setLock((lock) ? 0 : 1);
        if (lock) {postAPI("Unlock", true, "bool", props.API ); sleep(2000);}
        else { postAPI("Lock", true, "bool", props.API); sleep(2000); }
        event.currentTarget.style.transform = `rotate(${lock * 90}deg)`;
        event.currentTarget.style.backgroundColor = (lock) ? "green" : "red";
    }

    // console.log(props.data);


    function Ret(){
        
        return (
            <>
                { (auth) ? 
                    <Conatiner>
                        <Header>
                            <b>Web Lock</b> 
                            {socketStatus != 0 ? socketStatus == 1 ? <Live>{loc.dashLive}</Live> : <Disconnected>{loc.dashDisconn}</Disconnected> : <Connecting>{loc.dashConn}</Connecting>}
                        </Header>
                        <LockBase onClick={handleClick}>
                            <Lock/>
                        </LockBase>
                        <h1>
                            {(lock) ? "Locked" : "Unlocked"}
                        </h1>
                    </Conatiner>
                    : <div>no auth</div>
                }
            </>   
        );
    }


    return (            
        Ret()
    );
}

LockPage.propTypes = {    
    data: PropTypes.object,
    API: PropTypes.string,
    socket: PropTypes.object,
};
