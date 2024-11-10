import React, { Component } from "react";
import "./css/Dashboard.css";
import Loading from "../util/Loading";

class DashboardBar extends Component {
    render() {
        return (
            <div className={"DashboardBar"}>
                {this.props.children}
            </div>
        );
    }
}

class DashboardWidget extends Component {
    render() {
        const { label, numeric, loading } = this.props;
        return (
            <div className={"DashboardWidget"}>
                <div className={"DashboardLabel"}>
                    {label}
                </div>
                <div className={"DashboardNumeric"}>
                    {loading
                        ? (
                            <div style={{ color: "#e5e5e5" }}>
                                <i className="fas fa-sync fa-spin"></i>
                            </div>
                        )
                        : numeric}
                </div>
            </div>
        );
    }
}

export {DashboardBar, DashboardWidget};

// EOF