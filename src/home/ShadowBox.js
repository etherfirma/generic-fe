import React, { Component } from "react";
import "./css/ShadowBox.css";

class ShadowBox extends Component {
    render () {
        return (
            <div className={"ShadowBox"}>
                {this.props.children}
            </div>
        );
    }
}

export default ShadowBox;

// EOF