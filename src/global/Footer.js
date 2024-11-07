import React, { Component } from "react";
import "./css/Footer.css";
import {observable} from "mobx";
import Server from "../util/Server";
import {observer} from "mobx-react";
import {DebugButton} from "../util/debugStore";

class Footer extends Component {
    store = observable ({
        version: "loading"
    });

    componentDidMount() {
        this.getServerVersion ()
    }

    async getServerVersion () {
        const query = "{ res: serverVersion { version } }";
        const res = await Server._gql (query);
        this.store.version = res.version;
        return;
    }

    render() {
        return (
            <div className={"Footer"}>
                <DebugButton />
                &copy; Copyright 2023, <a target="__blank" href={"http://etherfirma.com"}>Etherfirma, LLC</a>.
                <br/>
                All rights reserved.
                <br/>
                <br/>
                Server Version {this.store.version}
            </div>
        );
    }
}

export default observer (Footer);

// EOF