import React, { Component } from "react";
import Alert from "@mui/material/Alert";
import _ from "lodash";
import "./css/ErrorBanner.css";
import {toJS} from "mobx";

class ErrorBanner extends Component {
    render () {
        const { error } = this.props;
        if (! error) {
            return null;
        } else if (_.isArray (error) && error.length === 0) {
            return null;
        }
        return (
            <div className={"ErrorBanner"}>
                <Alert severity="error">
                    {this.renderError (error)}
                </Alert>
            </div>
        );
    }

    renderError (error) {
        if (_.isObject (error) && error.errors) {
            error = error.errors;
        }
        if (_.isArray (error)) {
            if (error.length === 0) {
                return null;
            } else if (error.length === 1) {
                return error[0].message;
            } else {
                return (
                    <ul>
                        {_.map (error, (el, i) => {
                            return (
                                <li key={i}>
                                    {el.message}
                                </li>
                            );
                        })}
                    </ul>
                );
            }
        } else if (_.isObject (error)) {
            return JSON.stringify (error, null, 2);
        } else {
            return error.toString ();
        }
    }
}

export default ErrorBanner;

// EOF