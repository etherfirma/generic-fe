import React from 'react';
import {wrap, getParams, withCommas} from "../../../util/Utils";
import ID from "../../../util/ID";
import DataTable from "../../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import BatchUtil from "./BatchUtil";
import Breadcrumb from "../../../util/Breadcrumb";
import {AddButton, ClearButton, ReloadButton} from "../../../util/ButtonUtil";
import {employerLink, geoLink, userLink} from "../../thing/ThingUtil";
import UserPicker from "../../user/UserPicker";

/**
 *
 */

class FindBatches extends ThingDetails {
    constructor () {
        super ({
            heading: "Batches",
            hasFilters: true,
            importType: "", // filter
            user: null, // filter
            id: "" // filter
        });
    }

    get query () {
        return BatchUtil.findBatchesGql;
    }

    parseParameters () {
        const params = getParams ();
        if (params.importType) {
            this.store.importType = params.importType;
        }
        if (params.userId) {
            this.store.user = {
                id: params.userId
            };
        }
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { user, importType, id } = this.store;
        if (importType) {
            filters.importType = importType;
        }
        if (user) {
            filters.userId = user?.id;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
        return;
    }

    get headers () {
        return [
            this.sortHeader ("importType", "Import Type"),
            this.sortHeader ("jobCount", "Job Count"),
            this.sortHeader ("jobsAdded", "Added"),
            this.sortHeader ("jobsAlready", "Already"),
            this.sortHeader ("jobsFailed", "Failed"),
            this.sortHeader ("malformed", "Malformed"),
            this.sortHeader ("User", "User"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (batch) {
        return [
            batch.importType, 
            batch.jobCount,
            batch.jobsAdded ? withCommas (batch.jobsAdded) : "-",
            batch.jobsAlready ? withCommas (batch.jobsAlready) : "-",
            batch.jobsFailed ? withCommas (batch.jobsFailed) : "-",
            batch.malformed ? withCommas (batch.malformed) : "-",
            batch.user ? userLink (batch.user) : "-",
            <ID short={true} value={batch.id} />
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
                    onClick={batch => window.location.href = `#/data/batch/${batch.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { user, importType, id } = this.store;
        return Boolean (user || importType || id);
    }

    clearFilters = action (() => {
        this.store.user = null;
        this.store.importType = "";
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { importType, user, id, showDrawer } = this.store;
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
                        value={id}
                        label={"ID"}
                        onChange={(e) => {
                            this.store.id = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <TextField
                        {...formProps}
                        value={importType}
                        label={"Import Type"}
                        onChange={(e) => {
                            this.store.importType = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <UserPicker
                        value={user?.id}
                        required={false}
                        onChange={user => {
                            this.store.user = user;
                            this.doLoad ();
                        }}
                        formProps={formProps}
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
            { label: "Batches" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindBatches);

// EOF