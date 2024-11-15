import React, { Component } from "react";
import "./css/Footer.css";
import {DebugButton} from "../util/debugStore";
import { wrap } from "../util/Utils";

class Footer extends Component {
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
        const { environment } = this.props;

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
                            Server Version {environment.version} {this.renderEnv (environment.environment)}
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

export default wrap (Footer);

// EOF