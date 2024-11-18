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
const batchLink = thingLink ("batch", "importType")
const templateLink = thingLink ("template", "path");
const geoLink = thingLink ("geo", "key")
const geoTargetLink = thingLink ("geoTarget", "key")
const employerLink = thingLink ("employer", "name")
const jobLink = thingLink ("job", "title")
const ajcLink = thingLink ("ajc", "name")
const jcLink = thingLink ("jc", "name")
const wdbLink = thingLink ("wdb", "wdbName")

export {
    batchLink,
    jobLink,
    senderLink,
    employerLink,
    geoLink,
    userLink,
    templateLink,
    geoTargetLink,
    ajcLink, jcLink, wdbLink
};

// EOF