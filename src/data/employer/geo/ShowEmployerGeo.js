import React from 'react';
import {encodeUrl, formatDate, objGet, wrap} from "../../../util/Utils";
import PropertyTable from "../../../util/PropertyTable";
import ID from "../../../util/ID";
import ThingDetail from "../../thing/ThingDetail";
import Breadcrumb from "../../../util/Breadcrumb";
import {DeleteButton, EditButton} from "../../../util/ButtonUtil";
import YesNo from "../../../util/YesNo";
import {employerLink, geoLink} from "../../thing/ThingUtil";
import Server from "../../../util/Server";

/**
 *
 */

class ShowEmployerGeo extends ThingDetail {
    constructor () {
        super ({
            type: "EmployerGeo"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: employerGeoById (id: $id) {
                id
                employer { id name key isActive } 
                geo { id name key } 
                isActive
            } 
        }`;
    }

    actions (employer) {
        return (
            <div>
                <DeleteButton onClick={()=> {
                    this.delete (employer);
                }} />
            </div>
        );
    }

    delete (employerGeo) {
        const props = {
            title: "Confirm delete",
            body: <p>Really delete <b>employerGeo</b>?</p>,
            confirmText: "Delete",
            confirmFunc: () => {
                this.doDelete (employerGeo);
            }
        };
        const { infoDialogStore } = this.props;
        infoDialogStore.showDialog (props);
    }

    async doDelete (follow) {
        const mutation = `mutation ($id: String!) {
            res: deleteEmployerGeo (id: $id) 
        }`;
        const variables = { id: follow.id };
        try {
            const res = await Server._gql (mutation, variables);
            this.doLoad();
        }
        catch (e) {
            alert (JSON.stringify (e));
        }
    }
    
    /**
     *
     * @param employerId
     */

    doRender (employerGeo) {
        if (! employerGeo) {
            return (
                <span>
                    EmployerGeo not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={employerGeo.id} />,
            employer: employerLink (employerGeo.employer),
            geo: geoLink (employerGeo.geo),
            isActive: <YesNo value={employerGeo.isActive} labelled={true} />,
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (employerGeo)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "EmployerGeos", href: "#/data/employerGeos" },
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

export default wrap (ShowEmployerGeo);

// EOF