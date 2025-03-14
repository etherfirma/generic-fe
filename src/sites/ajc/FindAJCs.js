import React, { Component } from "react";
import ThingDetails from "../../data/thing/ThingDetails";
import DataTable from "../../data/DataTable";
import {AddButton, ClearButton, ReloadButton} from "../../util/ButtonUtil";
import TextField from "@mui/material/TextField";
import Breadcrumb from "../../util/Breadcrumb";
import AJCUtil from "./AJCUtil";
import ID from "../../util/ID";
import {Drawer} from "@mui/material";
import {action} from "mobx";
import {PreJson, wrap} from "../../util/Utils";
import {geoLink} from "../../data/thing/ThingUtil";
import GeoPicker from "../../data/geo/GeoPicker";

/**
 *
 */

class FindAJCs extends ThingDetails {
    constructor () {
        super ({
            heading: "AmericanJobCenters",
            hasFilters: true,
            centerId: "", // filter
            name: "", //filter
            geo: null, // filter
            id: "" // filter
        });
    }

    get query () {
        return AJCUtil.findAJCsGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { name, centerId, geo, id } = this.store;
        if (name) {
            filters.name = name;
        }
        if (centerId) {
            filters.centerId = centerId;
        }
        if (geo) {
            filters.geoId = geo.id;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
        return;
    }

    get headers () {
        return [
            this.sortHeader ("name", "Name"),
            this.sortHeader ("centerId", "CenterId"),
            this.sortHeader ("city", "City"),
            this.sortHeader ("state", "State"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (ajc) {
        return [
            ajc.name,
            ajc.centerId,
            ajc.city,
            ajc.geo.key,
            <ID short={true} value={ajc.id} />
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
                    onClick={sender => window.location.href = `#/data/ajc/${sender.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { name, centerId, geo, id } = this.store;
        return Boolean (name || id || geo || centerId);
    }

    clearFilters = action (() => {
        this.store.name = "";
        this.store.centerId = "";
        this.store.geo = null;
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { name, centerId, geo, id, showDrawer } = this.store;
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
                        value={centerId}
                        label={"CenterId"}
                        onChange={(e) => {
                            this.store.centerId = e.target.value;
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
                    <GeoPicker
                        value={geo?.id}
                        required={false}
                        onChange={geo => {
                            this.store.geo = geo;
                            this.doLoad ();
                        }}
                        formProps={formProps}
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
            { label: "Sites", href: "#/sites" },
            { label: "American Job Centers" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindAJCs);

// EOF