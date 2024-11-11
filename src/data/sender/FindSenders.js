import React from 'react';
import {wrap} from "../../util/Utils";
import ID from "../../util/ID";
import DataTable from "../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import SenderUtil from "./SenderUtil";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, ClearButton, ReloadButton} from "../../util/ButtonUtil";
import {senderLink} from "../thing/ThingUtil";

/**
 *
 */

class FindSenders extends ThingDetails {
    constructor () {
        super ({
            heading: "Senders",
            hasFilters: true,
            email: "", // filter
            name: "", //filter
            label: "", // filter
            id: "" // filter
        });
    }

    get query () {
        return SenderUtil.findSendersGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { name, email, label, id } = this.store;
        if (name) {
            filters.name = name;
        }
        if (label) {
            filters.label = label; 
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
            this.sortHeader ("label", "Label"),
            this.sortHeader ("email", "Email"),
            this.sortHeader ("name", "Name"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (sender) {
        return [
            sender.label, 
            senderLink (sender),
            sender.name || '-',
            <ID value={sender.id} />
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
                    onClick={sender => window.location.href = `#/data/sender/${sender.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <AddButton onClick={() => window.location.href = "#/data/sender/add"} />
                &nbsp;
                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { name, id, email, label } = this.store;
        return Boolean (name || id || email || label);
    }

    clearFilters = action (() => {
        this.store.name = "";
        this.store.email = "";
        this.store.id = "";
        this.store.label = ""; 
        this.doLoad ();
    });

    renderFilters () {
        const { name, email, label, id, showDrawer } = this.store;
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
                        value={label}
                        label={"Label"}
                        onChange={(e) => {
                            this.store.label = e.target.value;
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
                    <ClearButton onClick={() => this.clearFilters ()} />
                </div>
            </Drawer>
        )
    }

    renderHeader () {
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Senders" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindSenders);

// EOF