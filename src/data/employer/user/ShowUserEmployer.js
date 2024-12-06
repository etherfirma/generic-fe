import React from 'react';
import {encodeUrl, formatDate, objGet, PreJson, wrap} from "../../../util/Utils";
import PropertyTable from "../../../util/PropertyTable";
import ID from "../../../util/ID";
import ThingDetail from "../../thing/ThingDetail";
import Breadcrumb from "../../../util/Breadcrumb";
import {DeleteButton, EditButton} from "../../../util/ButtonUtil";
import YesNo from "../../../util/YesNo";
import {employerLink, geoLink, userLink} from "../../thing/ThingUtil";
import Server from "../../../util/Server";
import Button from "@mui/material/Button";

/**
 *
 */

class ShowUserEmployer extends ThingDetail {
    constructor () {
        super ({
            type: "UserEmployer"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: userEmployerById (id: $id) {
                id
                employer { id name key } 
                user { id name email } 
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

    delete (userEmployer) {
        const props = {
            title: "Confirm delete",
            body: <p>Really delete <b>userEmployer</b>?</p>,
            confirmText: "Delete",
            confirmFunc: () => {
                this.doDelete (userEmployer);
            }
        };
        const { infoDialogStore } = this.props;
        infoDialogStore.showDialog (props);
    }

    async doDelete (follow) {
        const mutation = `mutation ($id: String!) {
            res: deleteUserEmployer (id: $id) 
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

    doRender (userEmployer) {
        if (! userEmployer) {
            return (
                <span>
                    UserEmployer not found.
                </span>
            );
        }

        const o = {
            id: <ID snackbar={true} value={userEmployer.id} />,
            employer: employerLink (userEmployer.employer),
            user: userLink (userEmployer.user),
            isActive: (
                <div>
                    <YesNo value={userEmployer.isActive} labelled={true} />
                    &nbsp;
                    <Button variant={"outlined"} size={"small"} onClick={() => this.toggleActive (userEmployer)}>
                        Toggle
                    </Button>
                </div>
            ),
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (userEmployer)}
            </div>
        )
    }

    async toggleActive (userEmployer) {
        const query = `mutation ($id: String!, $update: UserEmployerUpdate!) {
            res: updateUserEmployer (id: $id, update: $update) {
                id 
            }  
        }`;
        const variables = {
            id: userEmployer.id,
            update: {
                isActive: ! userEmployer.isActive
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
            { label: "UserEmployers", href: "#/data/userEmployers" },
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

export default wrap (ShowUserEmployer);

// EOF