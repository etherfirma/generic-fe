import React from 'react';
import {encodeUrl, formatDate, objGet, wrap, toBullets} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import {batchLink, employerLink, geoLink} from "../thing/ThingUtil";

/**
 *
 */

class ShowOnetCode extends ThingDetail {
    constructor () {
        super ({
            type: "OnetCode"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: onetCodeById (id: $id) {
                id
                code
                title
                description
            } 
        }`;
    }

    actions (job) {
        return (
            <div>
            </div>
        );
    }

    /**
     *
     */

    doRender (onetCode) {
        if (! onetCode) {
            return (
                <span>
                    OnetCode not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={onetCode.id} />,
            code: onetCode.code,
            title: onetCode.title,
            description: onetCode.description
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (onetCode)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "OnetCodes", href: "#/data/onetCodes" },
            { label: id }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (ShowOnetCode);

// EOF