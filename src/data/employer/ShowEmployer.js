import React from 'react';
import {encodeUrl, formatDate, objGet, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import {DeleteButton, EditButton} from "../../util/ButtonUtil";
import YesNo from "../../util/YesNo";

/**
 *
 */

class DataEmployer extends ThingDetail {
    constructor () {
        super ({
            type: "Employer"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: employerById (id: $id) {
                id
                key
                name 
                isActive
                created
                lastModified
            } 
        }`;
    }

    actions (employer) {
        return (
            <div>
                <EditButton onClick={() => {
                    window.location.hash = `#/data/employer/${employer.id}/edit`;
                }} />
                {/*&nbsp;*/}
                {/*<DeleteButton onClick={()=> {*/}
                {/*    this.delete (employer);*/}
                {/*}} />*/}
            </div>
        );
    }

    /**
     *
     * @param employerId
     */

    doRender (employer) {
        if (! employer) {
            return (
                <span>
                    Employer not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={employer.id} />,
            key: employer.key,
            name: employer.name,
            isActive: <YesNo value={employer.isActive} labelled={true} />,
            created: employer.created,
            lastModified: employer.lastModified,
        };

        formatDate (o, [ "created", "lastModified" ]);

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (employer)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Employers", href: "#/data/employers" },
            { label: result?.name || id}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (DataEmployer);

// EOF