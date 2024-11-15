import React, { Component } from 'react';
import {action, observable} from "mobx";
import {Snackbar, IconButton, Drawer, Avatar} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { wrap } from './Utils';
import {BugReport} from "@mui/icons-material";
import AuthManager from "./AuthManager";
import {observer} from "mobx-react";
import "../home/App.css";
import Server from "./Server";
import Button from "@mui/material/Button";
import PropertyTable from "./PropertyTable";
import YesNo from "./YesNo";
import Environment from "./Environment";

const debugStore = observable ({
    open: false,

    show: action (() => {
        debugStore.open = true;
        console.log ("open");
    }),

    hide: action (() => {
        debugStore.open = false;
        console.log ("close");
    })
});

const DebugButton = observer (
    class DebugButton extends Component {
        render() {
            return (
                <Avatar className={"DebugButton"} onClick={(e) => {
                    debugStore.show();
                }}>
                    <BugReport/>
                </Avatar>
            );
        }
    }
);

class DebugPane extends Component {
    render () {
        const { debugStore, AuthManager, environment } = this.props
        const { open } = debugStore;

        const toggleClose = (e) => {
            debugStore.open = false;
        };

        const authManager = {
            isLoggedIn: <YesNo value={AuthManager.isLoggedIn} />,
            user: JSON.stringify (AuthManager.user, null, 2),
            csrfToken: AuthManager.csrfToken || '-',
            actions: (
                <div>
                    <Button size={"small"} variant={"outlined"} onClick={() => {
                        AuthManager.logout ()
                        toggleClose ()
                    }}>
                        Logout
                    </Button>
                </div>
            )
        };

        const server = {
            csrfToken: Server.csrfToken || '-',
            serverUrl: Server.serverUrl
        };

        const env = {
            version: environment.version,
            environment: environment.environment
        };

        return (
            <Drawer
                open={open}
                anchor={"right"}
                onClose={toggleClose}
            >
                <div className={"DebugPane"}>
                    <div className={"DebugHeader"}>
                        <BugReport/>
                        &nbsp;Debug
                    </div>
                    <h2>AuthManager</h2>
                    <PropertyTable value={authManager} />

                    <h2>Server</h2>
                    <PropertyTable value={server} />

                    <h2>Environment</h2>
                    <PropertyTable value={env} />
                </div>
            </Drawer>
        );
    }
}

export default wrap (DebugPane);

export {
    debugStore,
    DebugButton
};

// EOF