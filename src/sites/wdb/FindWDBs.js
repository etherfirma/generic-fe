import React, { Component } from "react";
import ThingDetails from "../../data/thing/ThingDetails";
import DataTable from "../../data/DataTable";
import {AddButton, ClearButton, ReloadButton} from "../../util/ButtonUtil";
import TextField from "@mui/material/TextField";
import Breadcrumb from "../../util/Breadcrumb";
import WDBUtil from "./WDBUtil";
import ID from "../../util/ID";
import {Drawer} from "@mui/material";
import {action} from "mobx";
import {PreJson, wrap} from "../../util/Utils";

/**
 *
 */

class FindWDBs extends ThingDetails {
    constructor () {
        super ({
            heading: "Workforce Development Boards",
            hasFilters: true,
            wdbName: "", // filter
            city: "", //filter
            state: "", // filter
            id: "" // filter
        });
    }

    get query () {
        return WDBUtil.findWDBsGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { city, wdbName, state, id } = this.store;
        if (city) {
            filters.city = city;
        }
        if (wdbName) {
            filters.wdbName = wdbName;
        }
        if (state) {
            filters.state = state;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
        return;
    }

    get headers () {
        return [
            this.sortHeader ("wdbName", "WdbName"),
            this.sortHeader ("city", "City"),
            this.sortHeader ("state", "State"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (wdb) {
        return [
            wdb.wdbName,
            wdb.city,
            wdb.state,
            <ID value={wdb.id} />
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
                    onClick={sender => window.location.href = `#/data/wdb/${sender.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { city, wdbName, state, id } = this.store;
        return Boolean (city || id || state || wdbName);
    }

    clearFilters = action (() => {
        this.store.city = "";
        this.store.wdbName = "";
        this.store.state = "";
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { city, wdbName, state, id, showDrawer } = this.store;
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
                        value={wdbName}
                        label={"WdbName"}
                        onChange={(e) => {
                            this.store.wdbName = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <TextField
                        {...formProps}
                        value={city}
                        label={"City"}
                        onChange={(e) => {
                            this.store.city = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <TextField
                        {...formProps}
                        value={state}
                        label={"State"}
                        onChange={(e) => {
                            this.store.state = e.target.value;
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
            { label: "WDBs" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindWDBs);

// EOF