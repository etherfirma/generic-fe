import React, { Component } from "react";
import BarChart from "./BarChart";
import USAMap from "react-usa-map";

/**
 *
 */

class Graph1 extends Component {
    componentDidMount() {

        return;
    }

    mapHandler = (event) => {
        alert(event.target.dataset.name);
    };

    statesCustomConfig = () => {
        return {
            "NJ": {
                fill: "navy",
                clickHandler: (event) => console.log('Custom handler for NJ', event.target.dataset)
            },
            "NY": {
                fill: "#CC0000"
            }
        };
    };


    render() {
        return (
            <div>
                <h2>Bar Chart</h2>
                <div style={{ border: "1px solid gray" }}>
                    <BarChart />
                </div>

                <h2>Map</h2>
                <USAMap
                    width={400} height={300}
                    customize={this.statesCustomConfig()}
                    onClick={this.mapHandler}
                />
            </div>
        );
    }
}

export default Graph1;

// EOF