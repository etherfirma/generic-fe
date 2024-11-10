import React, { Component } from "react";
import {PreJson, wrap} from "../../../util/Utils";
import _ from "lodash";
import {observable} from "mobx";
import { action } from "mobx";
import GeoPicker from "../../../data/geo/GeoPicker";
import Breadcrumb from "../../../util/Breadcrumb";

/**
 *
 */

class GeoPickerTest extends Component {
    store = observable ({
        geo: null,
        geo2: null
    });

    static crumbs = [
        { label: null, href: "#/" },
        { label: "System", href: "#/system" },
        { label: "Tests", href: "#/tests" },
        { label: "GeoPicker Test" },
    ];

    set Geo (val) {
        action (() => this.store.geo = val) ();
    }

    render () {
        const { geo, geo2 } = this.store;

        return (
            <div>
                <Breadcrumb crumbs={GeoPickerTest.crumbs} />
                <h1>Geo Picker Test</h1>

                <GeoPicker
                    value={geo?.id}
                    required={false}
                    onChange={geo => this.store.geo = geo}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={geo} />
                <br/>

                <GeoPicker
                    value={geo2?.id}
                    required={true}
                    onChange={geo => this.store.geo2 = geo}
                    formProps={{
                        fullWidth: true,
                        size: "small"
                    }}
                />

                <PreJson json={geo2} />
            </div>
        );
    }
}

export default wrap (GeoPickerTest);

// EOF