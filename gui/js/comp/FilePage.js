import React, { useState ,useEffect } from "react";
import PropTypes from "prop-types";

import { FileListing } from "./FileListing";  

import Config from "./../configuration.json";
let loc;
if (Config.find(entry => entry.name === "language")) {
    loc = require("./../lang/" + Config.find(entry => entry.name === "language").value + ".json");
} else {
    loc = require("./../lang/en.json");
}

export function FilePage(props) {

    useEffect(() => {
        document.title = loc.titleFile;
    }, []);

    const [auth, setAuth] = useState(0);
    setAuth(props.data.passwordAcceptance);


    return (
        <>
            { (auth) ? 
                <><h2>{loc.titleFile}</h2><FileListing API={props.API} /> </> 
                : <div>no auth</div> 
            }
        </>
    );

}

FilePage.propTypes = {
    API: PropTypes.string,
    data: PropTypes.object,
};