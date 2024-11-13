import React, { Component } from "react";
import ThingDetails from "../../data/thing/ThingDetails";
import DataTable from "../../data/DataTable";
import {AddButton, ClearButton, ReloadButton} from "../../util/ButtonUtil";
import TextField from "@mui/material/TextField";
import Breadcrumb from "../../util/Breadcrumb";
import PAUtil from "./PAUtil";
import ID from "../../util/ID";
import {Drawer} from "@mui/material";
import {action} from "mobx";
import {externalLink, PreJson, wrap} from "../../util/Utils";
import YesNo from "../../util/YesNo";

/**
 *
 */

class FindPAs extends ThingDetails {
    constructor () {
        super ({
            heading: "Professional Associations",
            hasFilters: true,
            name: "", //filter
            url: "", // filter
            certification: "", // filter
            id: "" // filter
        });
    }

    get query () {
        return PAUtil.findPAsGql;
    }

    extendVariables (variables) {
        const {sort} = this.store;
        if (sort) {
            variables.sort = JSON.stringify(sort);
        }
        const filters = {};
        const {name, url, certification, id} = this.store;
        if (name) {
            filters.name = name;
        }
        if (url) {
            filters.url = url;
        }
        if (certification) {
            filters.certification = certification;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
    }

    get headers () {
        return [
            this.sortHeader ("name", "Name"),
            this.sortHeader ("url", "Url"),
            this.sortHeader ("certification", "Certification"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (pa) {
        return [
            pa.name,
            externalLink (pa.url),
            <YesNo value={pa.certification} />,
            <ID short={true} value={pa.id} />
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
                    onClick={sender => window.location.href = `#/data/pa/${sender.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { name, url, state, id } = this.store;
        return Boolean (name || id || state || url);
    }

    clearFilters = action (() => {
        this.store.name = "";
        this.store.url = "";
        this.store.certification = "";
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { name, url, certification, id, showDrawer } = this.store;
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
                        value={url}
                        label={"Url"}
                        onChange={(e) => {
                            this.store.url = e.target.value;
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
                        value={certification}
                        label={"Certification"}
                        onChange={(e) => {
                            this.store.certification = e.target.value;
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
            { label: "PAs" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindPAs);

// EOF