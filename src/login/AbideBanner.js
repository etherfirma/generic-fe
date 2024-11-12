import React, { Component } from "react";
import abidePng from "./abide.png";

function AbideBanner () {
    return (
        <div className={"AbideBanner"}>
            <div className={"AbideWrapper"}>
                <img src={abidePng}/>
            </div>
        </div>
    );
}

export default AbideBanner;

// EOF