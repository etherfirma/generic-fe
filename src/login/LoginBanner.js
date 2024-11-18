import React, { Component } from "react";
import "./css/LoginBanner.css";
import {House03Icon} from "hugeicons-react";
import logo from "../global/logo.png";

class LoginBanner extends Component {
    render() {
        const { width } = this.props;

        return (
            <div className={"LoginBanner"}>
                {/*<img height={50} src={logo} />*/}
                {/*<img height={50} src={"https://abide.com/wp-content/uploads/2023/03/Abide_Logo_Horizontal_FullColor_WEB.svg"} />*/}
                Abide.ai
            </div>
        );
    }
}

LoginBanner.defaultProps = {
    width: 200
};

export default LoginBanner;

// EOF