import React from 'react';
import {wrap, shortenText } from "../../util/Utils";
import ID from "../../util/ID";
import DataTable from "../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import Breadcrumb from "../../util/Breadcrumb";
import {userLink} from "../user/UserUtil";
import {AddButton, ReloadButton} from "../../util/ButtonUtil";


class FindTemplates extends ThingDetails {
    constructor () {
        super ({
            heading: "Templates",
            hasFilters: true,
            path: "", // filter
            id: "" // filter
        });
    }

    get query () {
        return `query ($req: TemplateFindRequest!) { 
            findTemplates (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    engine
                    path
                    description
                    template
                    user {
                        id
                        email
                        name 
                    }                   
                }
            }
        }`;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { name, email, id } = this.store;
        if (name) {
            filters.name = name;
        }
        if (email) {
            filters.email = email;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
        return;
    }

    get headers () {
        return [
            this.sortHeader ("user", "User"),
            this.sortHeader ("path", "Path"),
            this.sortHeader ("description", "Description"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (template) {
        return [
            userLink (template.user),
            template.path,
            shortenText (template.description, 8) || '-',
            <ID value={template.id} />
        ];
    }

    doRender (fres) {
        return (
            <div>
                <DataTable
                    headers={this.headers}
                    xform={this.xform.bind (this)}
                    rows={fres.results}
                    skip={fres.skip}
                    onClick={(el) => window.location.href = `#/data/template/${el.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <AddButton onClick={() => window.location.href = "#/data/template/add"} />
                &nbsp;
                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { name, id } = this.store;
        return Boolean (name || id);
    }

    clearFilters = action (() => {
        this.store.name = "";
        this.store.email = ""; 
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { name, email, id, showDrawer } = this.store;
        const formProps = {margin: "dense", size: "small", fullWidth: true};

        return (
            <Drawer
                style={{ width: 250 }}
                anchor={"right"}
                open={showDrawer}
                onClose={this.toggleDrawer(false)}
            >
                <div className={"DataFilters"}>
                    <h2>Filters</h2>

                    <TextField
                        {...formProps}
                        value={email}
                        label={"Email"}
                        onChange={(e) => {
                            this.store.email = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <TextField
                        {...formProps}
                        value={name}
                        label={"Name"}
                        onChange={(e) => {
                            this.store.name = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <TextField
                        {...formProps}
                        value={id}
                        label={"ID"}
                        onChange={(e) => {
                            this.store.id = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <br/>
                    <br/>
                    <Button variant="outlined" onClick={() => this.clearFilters ()}>
                        <i className="fas fa-trash" />
                        &nbsp;
                        Clear All
                    </Button>
                </div>
            </Drawer>
        )
    }

    renderHeader () {
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Templates" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindTemplates);

// EOF