import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './home/App';
import InfoDialog, {infoDialogStore} from "./util/InfoDialog";
import Server from "./util/Server";
import {Provider} from "mobx-react";
import {GoogleOAuthProvider} from "@react-oauth/google";
import AuthManager from "./util/AuthManager";
import EnumManager from "./util/enum/EnumManager";
import SnackbarPopop, {snackbarStore} from "./util/snackbarStore";
import DebugPane, {DebugButton, debugStore} from "./util/debugStore";
import {BugReport} from "@mui/icons-material";
import {Avatar, Snackbar} from "@mui/material";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="190363921124-u2mcuqdcs31if72lc7jmhh3fu470l09l.apps.googleusercontent.com">
        <React.StrictMode>
            <Provider
                AuthManager={AuthManager}
                snackbarStore={snackbarStore}
                infoDialogStore={infoDialogStore}
                EnumManager={EnumManager}
                Server={Server}
                debugStore={debugStore}
                // textFieldDialogStore={textFieldDialogStore}
            >
                <App />
                <InfoDialog/>
                <DebugPane />
                <SnackbarPopop />
            </Provider>
        </React.StrictMode>
    </GoogleOAuthProvider>
);

// EOF