import React, { Component } from "react";
import USAMap from "react-usa-map";
import _ from "lodash";
import {PreJson} from "../../../util/Utils";

/**
 *
 */

class SampleMap extends Component {
    componentDidMount() {

        return;
    }

    mapHandler = (event) => {
        alert (event.target.dataset.name);
    };

    // colors = [
    //     "#9e0142",
    //     "#d53e4f",
    //     "#f46d43",
    //     "#fdae61",
    //     "#fee08b",
    //     "#e6f598",
    //     "#abdda4",
    //     "#66c2a5",
    //     "#3288bd",
    //     "#5e4fa2"
    // ];

    colors = [
        "#b3e5fc", "#81d4fa", "#4fc3f7", "#29b6f6", "#03a9f4", "#0288d1", "#0277bd", "#01579b", "#512da8", "#311b92"
    ];

    statesCustomConfig = (jobsByGeo) => {
        const config = { };
        const max = _.reduce (jobsByGeo, (acc, i) => Math.max (acc, i.count), 0)

        _.each (jobsByGeo, (el) => {
            const i = parseInt (el.count / max * this.colors.length);
            config[el.geoId] = {
                fill: this.colors[i]
            };
        });

        return config;
    };


    render() {
        const { jobsByGeo } = this.props;
        const config = jobsByGeo ? this.statesCustomConfig(jobsByGeo) : null;
        return (
            <div>
                <USAMap
                    width={500} height={300}
                    customize={config}
                    onClick={this.mapHandler}
                />
            </div>
        );
    }
}

export default SampleMap;

// EOF