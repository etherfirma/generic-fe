import React from 'react';
import {encodeUrl, formatDate, objGet, PreJson, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import {DeleteButton, EditButton} from "../../util/ButtonUtil";
import YesNo from "../../util/YesNo";

/**
 *
 */

class DataGeo extends ThingDetail {
    constructor () {
        super ({
            type: "Geo"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: geoById (id: $id) {
                id
                key
                name
                type 
                isActive
                connectorType
                connectorConfig
            } 
        }`;
    }

    actions (geo) {
        return null;
    }

    /**
     *
     * @param geoId
     */

    doRender (geo) {
        if (! geo) {
            return (
                <span>
                    Geo not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={geo.id} />,
            key: geo.key,
            name: geo.name,
            type: geo.type,
            isActive: <YesNo value={geo.isActive} />,
            connectorType: geo.connectorType,
            connectorConfig: <PreJson json={geo.connectorConfig} />
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (geo)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Geos", href: "#/data/geos" },
            { label: result?.key || id}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (DataGeo);

// EOF