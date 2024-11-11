import React, { Component } from "react";
import BarChart from "./BarChart";

/**
 *
 */

class Graph1 extends Component {
    componentDidMount() {

        return;
    }

    render() {
        return (
            <div>
                <h2>Bar Chart</h2>
                <div style={{ border: "1px solid gray" }}>
                    <BarChart />
                </div>
            </div>
        );
    }
}

export default Graph1;

// EOF