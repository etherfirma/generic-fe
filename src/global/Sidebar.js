import React, { Component } from "react";
import "./css/Sidebar.css";
import _ from "lodash";
import {Badge} from "@mui/material";
import {PreJson} from "../util/Utils";

class SidebarButton extends Component {
    doClick () {
        const { onClick, href } = this.props;
        if (onClick) {
            onClick ();
        } else if (href) {
            window.location.href = href;
        }
        return;
    }

    render () {
        const {
            icon = "fal fa-question",
            label = "no-label",
            onClick,
            href,
            ...extra
        } = this.props;
        return (
            <div className={"SidebarButton"} {...extra} onClick={(e) => this.doClick ()}>
                <i className={icon} />
                <div className={"SidebarLabel"}>
                    {label}
                </div>
            </div>
        );
    }
}

const BUTTONS = [
    {
        label: "Home",
        icon: "fal fa-home",
        href: "#/",
    },
    {
        label: "Data Browser",
        icon: "fal fa-database",
        href: "#/data",
    },
    {
        label: "GraphQL",
        icon: "fal fa-project-diagram",
        href: "#/system/gql",
    },
    {
        label: "System",
        icon: "fal fa-cogs",
        href: "#/system",
    }
]
class Sidebar extends Component {
    render() {
        return (
            <div className={"Sidebar"}>
                {_.map (BUTTONS, (button, i) => <SidebarButton {...button} key={i} />)}
            </div>
        );
    }
}

export default Sidebar;

// EOF