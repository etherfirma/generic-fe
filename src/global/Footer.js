import React, { Component } from "react";
import "./css/Footer.css";
import {observable} from "mobx";
import Server from "../util/Server";
import {observer} from "mobx-react";
import {DebugButton} from "../util/debugStore";

class Footer extends Component {
    store = observable ({
        version: "...",
        env: null
    });

    componentDidMount() {
        this.getServerVersion ()
    }

    async getServerVersion () {
        const query = "{ res: serverVersion { version env } }";
        const res = await Server._gql (query);
        this.store.version = res.version;
        this.store.env = res.env;
        return;
    }

    renderEnv (env) {
        if (env) {
            return (
                <span className={"Environment"}>
                    {env}
                </span>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className={"Footer"}>
                <table>
                    <tbody>
                    <tr>
                        <td>

                        </td>
                        <td>
                            &copy; Copyright 2024, <a target="__blank" href={"http://etherfirma.com"}>Etherfirma, LLC</a>.
                            <br/>
                            All rights reserved.
                            <br/>
                            <br/>
                            Server Version {this.store.version} {this.renderEnv (this.store.env)}
                        </td>
                        <td>
                            <DebugButton />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default observer (Footer);

// EOF