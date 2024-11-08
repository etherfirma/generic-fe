import React from 'react';
import {encodeUrl, formatDate, objGet, PreJson, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import Server from "../../util/Server";
import {DeleteButton, EditButton, IconButton} from "../../util/ButtonUtil";
import {userLink} from "../thing/ThingUtil";

const INIT = {
    type: "Template",
};

class DataTemplate extends ThingDetail {
    constructor() {
        super (INIT);
    }

    get query() {
        return `
            query ($id: String!) {
                res: templateById (id: $id) {
                    id
                    engine
                    description
                    path
                    sampleContext
                    user { 
                        id 
                        name
                        email
                    }
                    template
                    created
                    lastModified
                } 
            }`;
    }

    // getVariables () {
    //     const { id } = this.store;
    //     return { id };
    // }

    actions(template) {
        return (
            <div>
                <EditButton onClick={() => {
                    window.location.hash = `#/data/template/${template.id}/edit`;
                }}/>
                &nbsp;
                <DeleteButton onClick={() => {
                    this.delete(template);
                }}/>
                &nbsp;
                <IconButton icon={"far fa-file-alt"} label={"Merge"} onClick={() => {
                    window.location.hash = `#/tests/template?templateId=${template.id}`;
                }}/>
            </div>
        );
    }

    /**
     *
     * @param templateId
     */

    doRender(template) {
        console.log("doRender", template);
        if (!template) {
            return (
                <span>
                    Template not found.
                </span>
            );
        }

        const o = {
            id: <ID value={template.id} snackbar={true}/>,
            engine: template.engine,
            description: template.description || "-",
            path: template.path,
            template: (
                <pre>{template.template}</pre>
            ),
            sampleContext: <PreJson json={JSON.parse(template.sampleContext)}/>,
            user: userLink(template.user),
            created: template.created,
            lastModified: template.lastModified,
        };

        formatDate(o, ["created", "lastModified"]);
        return (
            <div>
                <PropertyTable value={o} size={"small"}/>
                <br/>
                {this.actions(template)}
            </div>
        )
    }

    renderHeader() {
        const { result, id} = this.store;
        const crumbs = [
            {label: null, href: "#/"},
            {label: "Templates", href: "#/data/templates"},
            {label: result?.path || id}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs}/>
                {super.renderHeader()}
            </div>
        );
    }

    delete(template) {
        const props = {
            title: "Confirm delete",
            body: <p>Really delete <b>template</b>?</p>,
            confirmText: "Delete",
            confirmFunc: () => {
                this.doDelete(template);
            }
        };
        const {infoDialogStore} = this.props;
        infoDialogStore.showDialog(props);
    }

    async doDelete(template) {
        const mutation = `mutation ($id: String!) {
            res: deleteTemplateById (id: $id) 
        }`;
        const variables = {id: template.id};
        try {
            const res = await Server._gql(mutation, variables);
            this.doLoad();
        } catch (e) {
            alert(JSON.stringify(e));
        }
    }
}

export default wrap (DataTemplate);

// EOF