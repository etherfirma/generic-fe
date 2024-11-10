import React from 'react';
import "./css/ThingUtil.css";

const thingLink = (type, field = "name", func = null) => (thing) => {
    const text = func ? func (thing) : thing[field];
    return (
        <span className="ThingLink" onClick={() => window.location.href = `#/data/${type}/${thing.id}`}>
            {text}
        </span>
    );
}
const senderLink = thingLink ("sender", "email");
const userLink = thingLink ("user", "name", (thing) => `${thing.name} (${thing.email})`);
const templateLink = thingLink ("template", "path");
const geoLink = thingLink ("geo", "key")
const geoTargetLink = thingLink ("geoTarget", "key")
const employerLink = thingLink ("employer", "name")

export {
    senderLink,
    employerLink,
    geoLink,
    userLink,
    templateLink,
    geoTargetLink
};

// EOF