import React from 'react';
import {encodeUrl, externalLink, formatDate, objGet, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../../data/thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import YesNo from "../../util/YesNo";
import _ from "lodash";

/**
 *
 */

class DataPa extends ThingDetail {
    constructor () {
        super ({
            type: "Professional Association"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: professionalAssociationById (id: $id) {
                id
                name
                url
                certification
                careerCenterUrl
                naicsCode
                onetCode
            } 
        }`;
    }

    actions (pa) {
        return (
            <div>
            </div>
        );
    }

    /**
     *
     * @param paId
     */

    doRender (pa) {
        if (! pa) {
            return (
                <span>
                    Pa not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={pa.id} />,
            name:  pa.name,
            url: externalLink (pa.url),
            certification:  <YesNo value={pa.certification} labelled={true} />,
            careerCenterUrl: externalLink (pa.careerCenterUrl),
            naicsCode:  pa.naicsCode,
            onetCode:  pa.onetCode,
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (pa)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "PAs", href: "#/sites/pa/find" },
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

export default wrap (DataPa);

// EOF