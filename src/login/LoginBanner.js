import React, { Component } from "react";
import "./css/LoginBanner.css";
import {House03Icon} from "hugeicons-react";
import logo from "../global/logo.png";

class LoginBanner extends Component {
    render() {
        const { width } = this.props;

        return (
            <div className={"LoginBanner"}>
                <img height={50} src={logo} />
            </div>
        );
    }
}

LoginBanner.defaultProps = {
    width: 200
};

export default LoginBanner;

// EOF