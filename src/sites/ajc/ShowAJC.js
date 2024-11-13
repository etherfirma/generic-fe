import React from 'react';
import {encodeUrl, formatDate, objGet, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../../data/thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import YesNo from "../../util/YesNo";
import _ from "lodash";

/**
 *
 */

class DataAjc extends ThingDetail {
    constructor () {
        super ({
            type: "AJC"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: americanJobCenterById (id: $id) {
                id
                centerId
                name
                address1
                address2
                city
                state
                zipcode
                phone
                email
                url
                vetRep
                latitude
                longitude
                closure
                status
                businessRep { name phone email } 
                vetRepContacts { name phone email } 
                youthReps { name phone email }
            } 
        }`;
    }

    actions (ajc) {
        return (
            <div>
            </div>
        );
    }

    /**
     *
     * @param ajcId
     */

    doRender (ajc) {
        if (! ajc) {
            return (
                <span>
                    Ajc not found.
                </span>
            );
        }

        const toContacts = (cs) => {
            return (
                <ul>
                    {_.map (cs, (c, i) => <li key={i}>{toContact (c)}</li>)}
                </ul>
            );
        }
        const toContact = (c) => {
            return (
                <span>
                    {c.name} ({c.email}) {c.phone}
                </span>
            )
        }

        const o = {
            id: <ID snackbar={true} value={ajc.id} />,
            centerId: ajc.centerId,
            programType: ajc.programType,
            name: ajc.name,
            address1: ajc.address1,
            address2: ajc.address2 || '-',
            city: ajc.city,
            state: ajc.state,
            zipcode: ajc.zipcode,
            phone: ajc.phone,
            email: ajc.email,
            url: ajc.url,
            vetRep: <YesNo value={ajc.vetRep} />,
            vetRepContacts: toContacts (ajc.vetRepContacts),
            businessRep: toContact (ajc.businessRep),
            exOffenders: <YesNo value={ajc.exOffenders} />,
            youthReps: toContacts (ajc.youthReps),
            latitude: ajc.latitude,
            longitude: ajc.longitude,
            closure: <YesNo value={ajc.closure} />,
            status: ajc.status || '-'
        };





        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (ajc)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "AJCs", href: "#/sites/ajc/find" },
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

export default wrap (DataAjc);

// EOF