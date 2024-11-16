import React from 'react';
import {encodeUrl, externalLink, formatDate, objGet, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../../data/thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import YesNo from "../../util/YesNo";
import _ from "lodash";
import {geoLink} from "../../data/thing/ThingUtil";

/**
 *
 */

class DataJc extends ThingDetail {
    constructor () {
        super ({
            type: "Job Clubs"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: jobClubById (id: $id) {
                id
                name
                city
                geo { id key }
                zipcode
                contactName
                contactPhone
                contactEmail
                url
                latitude
                longitude
            } 
        }`;
    }

    actions (jc) {
        return (
            <div>
            </div>
        );
    }

    /**
     *
     * @param jcId
     */

    doRender (jc) {
        if (! jc) {
            return (
                <span>
                    JobClub not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={jc.id} />,
            name: jc.name,
            city: jc.city,
            state: geoLink (jc.geo),
            zipcode: jc.zipcode,
            contactName: jc.contactName,
            contactPhone: jc.contactPhone,
            contactEmail: jc.contactEmail,
            url: externalLink (jc.url),
            latitude: jc.latitude,
            longitude: jc.longitude,
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (jc)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "JCs", href: "#/sites/jc/find" },
            { label: result?.centerId || id}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (DataJc);

// EOF