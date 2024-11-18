import React from 'react';
import {wrap, getParams} from "../../../util/Utils";
import ID from "../../../util/ID";
import DataTable from "../../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import RawJobUtil from "./RawJobUtil";
import Breadcrumb from "../../../util/Breadcrumb";
import {AddButton, ReloadButton} from "../../../util/ButtonUtil";

/**
 *
 */

class FindRawJobs extends ThingDetails {
    constructor () {
        super ({
            heading: "RawJobs",
            hasFilters: true,
            jobKey: "", // filter
            batchId: "", // filter
            id: "" // filter
        });
    }

    get query () {
        return RawJobUtil.findRawJobsGql;
    }

    parseParameters () {
        const params = getParams ();
        if (params.batchId) {
            this.store.batchId = params.batchId;
        }
        if (params.jobKey) {
            this.store.jobKey = params.jobKey;
        }
        if (params.id) {
            this.store.id = params.id;
        }
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { batchId, jobKey, id } = this.store;
        if (jobKey) {
            filters.jobKey = jobKey;
        }
        if (batchId) {
            filters.batchId = batchId;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
    }

    get headers () {
        return [
            this.sortHeader ("batchId", "Batch"),
            this.sortHeader ("jobKey", "JobKey"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (rawJob) {
        return [
            rawJob.batchId,
            rawJob.jobKey,
            <ID short={true} value={rawJob.id} />
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
                    onClick={job => window.location.href = `#/data/job/${job.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <AddButton onClick={() => window.location.href = "#/data/job/add"} />
                &nbsp;
                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { batchId, jobKey, id } = this.store;
        return Boolean (batchId || jobKey || id);
    }

    clearFilters = action (() => {
        this.store.jobKey = "";
        this.store.batchId = "";
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { batchId, jobKey, id, showDrawer } = this.store;
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
                        value={batchId}
                        label={"batchId"}
                        onChange={(e) => {
                            this.store.batchId = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <TextField
                        {...formProps}
                        value={jobKey}
                        label={"Job Key"}
                        onChange={(e) => {
                            this.store.jobKey = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <br/>
                    <br/>
                    <Button size="small" variant="outlined" onClick={() => this.clearFilters ()}>
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
            { label: "RawJobs" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindRawJobs);

// EOF