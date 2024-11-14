import React from 'react';
import {encodeUrl, formatDate, objGet, TabPanel, wrap, PreJson} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import YesNo from "../../util/YesNo";
import Breadcrumb from "../../util/Breadcrumb";
import Server from "../../util/Server";
import {DeleteButton, EditButton, ReloadButton} from "../../util/ButtonUtil";

/**
 *
 */

class ShowZipcode extends ThingDetail {
    constructor () {
        super ({
            type: "Zipcode",
            tab: 0
        });
    }

    get query () {
        return `query ($id: String!) {
                    res: zipcodeById (id: $id) {
                        id
                        countryCode
                        postalCode
                        placeName
                        adminName
                        adminCode1
                        adminName2
                        adminCode2
                        latitude
                        longitude
                    } 
                }`;
    }

    actions (zipcode) {
        return (
            <div>
                <ReloadButton onClick={() => this.doLoad ()} />
            </div>
        );
    }

    /**
     *
     */

    doRender (zipcode) {
        if (! zipcode) {
            return (
                <span>
                    Zipcode not found.
                </span>
            );
        }

        const o = {
            id: <ID value={zipcode.id} snackbar={true} />,
            countryCode: zipcode.countryCode,
            postalCode: zipcode.postalCode,
            placeName: zipcode.placeName,
            adminName: zipcode.adminName,
            adminCode1: zipcode.adminCode1,
            adminName2: zipcode.adminName2,
            adminCode2: zipcode.adminCode2,
            latitude: zipcode.latitude,
            longitude: zipcode.longitude,
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (zipcode)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Zipcodes", href: "#/data/zipcodes" },
            { label: result?.id }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (ShowZipcode);

// EOF