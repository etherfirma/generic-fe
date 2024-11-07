import React, { Component } from "react";
import "./css/Global.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ColoredDiv from "./ColoredDiv";

class Empty extends Component {
    render() {
        return (
            <div className={"OuterWrapper"}>
                <Header />
                <div className={"InnerWrapper"}>
                    <Sidebar />
                    <div>
                        <ColoredDiv color={"blue"} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Empty;

// EOF