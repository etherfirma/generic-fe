import React from 'react';
import {encodeUrl, formatDate, objGet, PreJson, wrap} from "../../../util/Utils";
import PropertyTable from "../../../util/PropertyTable";
import ID from "../../../util/ID";
import ThingDetail from "../../thing/ThingDetail";
import Breadcrumb from "../../../util/Breadcrumb";
import {DeleteButton, EditButton} from "../../../util/ButtonUtil";
import YesNo from "../../../util/YesNo";
import {employerLink, geoLink} from "../../thing/ThingUtil";
import Server from "../../../util/Server";
import Button from "@mui/material/Button";

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
                config
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
            isActive: (
                <div>
                    <YesNo value={employerGeo.isActive} labelled={true} />
                    &nbsp;
                    <Button variant={"outlined"} size={"small"} onClick={() => this.toggleActive (employerGeo)}>
                        Toggle
                    </Button>
                </div>
            ),
            config: <PreJson json={employerGeo.config} />
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (employerGeo)}
            </div>
        )
    }

    async toggleActive (employerGeo) {
        const query = `mutation ($id: String!, $update: EmployerGeoUpdate!) {
            res: updateEmployerGeo (id: $id, update: $update) {
                id 
            }  
        }`;
        const variables = {
            id: employerGeo.id,
            update: {
                isActive: ! employerGeo.isActive
            }
        };
        const req = await Server._gql (query, variables);
        this.doLoad ();
        return;
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