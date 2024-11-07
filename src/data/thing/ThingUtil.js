import React from 'react';
import "./css/ThingUtil.css";

const thingLink = (type, icon, field = "name") => (thing) => {
    return (
        <span className="ThingLink" onClick={() => window.location.href = `#/data/${type}/${thing.id}`}>
            <i className={icon} />
            &nbsp;
            <span>
                {thing[field]}
            </span>
        </span>
    );

}

const taskLink = thingLink ("task", "fal fa-tasks", "title");
const userLink = thingLink ("user", "fal fa-user");
const auditLink = thingLink ("audit", "fas fa-calculator");
const projectLink = thingLink ("project", "fal fa-project-diagram");
const templateLink = thingLink ("template", "fal fa-file-code");
// const organizationLink = thingLink ("organization", "fal fa-building");

export {
    userLink,
    projectLink,
    templateLink,
    // organizationLink,
    taskLink,
    auditLink
};

// EOF