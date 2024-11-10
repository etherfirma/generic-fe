import React from 'react';
import {wrap} from "../../util/Utils";
import ID from "../../util/ID";
import DataTable from "../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import JobUtil from "./JobUtil";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, ReloadButton} from "../../util/ButtonUtil";
import {employerLink, geoLink, jobLink} from "../thing/ThingUtil";
import YesNo from "../../util/YesNo";
import BooleanPicker from "../../util/BooleanPicker";
import GeoPicker from "../geo/GeoPicker";
import EmployerPicker from "../employer/EmployerPicker";

/**
 *
 */

class FindJobs extends ThingDetails {
    constructor () {
        super ({
            heading: "Jobs",
            hasFilters: true,
            jobKey: "",
            employer: null,
            geo: null,
            state: "",
            id: "" // filter
        });
    }

    get query () {
        return JobUtil.findJobsGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { jobKey, employer, geo, state, id } = this.store;
        if (jobKey) {
            filters.jobKey = jobKey;
        }
        if (state) {
            filters.state = state;
        }
        if (employer) {
            filters.employerId = employer.id;
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
            this.sortHeader ("title", "Title"),
            this.sortHeader ("Employer", "Employer"),
            this.sortHeader ("geo", "Geo"),
            this.sortHeader ("state", "State"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (job) {
        return [
            job.title,
            employerLink (job.employer),
            geoLink (job.geo),
            job.state,
            <ID value={job.id} />
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
        const { jobKey, employer, geo, state, id } = this.store;
        return Boolean (jobKey || employer || geo || state || id);
    }

    clearFilters = action (() => {
        this.store.jobKey = "";
        this.store.state = "";
        this.store.employer = null;
        this.store.geo = null;
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { jobKey, state, employer, geo, id, showDrawer } = this.store;
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
                        value={jobKey}
                        label={"Job Key"}
                        onChange={(e) => {
                            this.store.jobKey = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <EmployerPicker
                        value={employer}
                        required={false}
                        onChange={employer => {
                            this.store.employer = employer;
                            this.doLoad ();
                        }}
                        formProps={{
                            fullWidth: true,
                            size: "small"
                        }}
                    />
                    <GeoPicker
                        value={geo?.id}
                        required={false}
                        onChange={geo => {
                            this.store.geo = geo;
                            this.doLoad();
                        }}
                        formProps={{
                            fullWidth: true,
                            size: "small"
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
            { label: "Jobs" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindJobs);

// EOF