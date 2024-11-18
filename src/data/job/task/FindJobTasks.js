import React from 'react';
import {wrap} from "../../../util/Utils";
import ID from "../../../util/ID";
import DataTable from "../../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import JobTasksUtil from "./JobTasksUtil";
import Breadcrumb from "../../../util/Breadcrumb";
import {AddButton, ClearButton, ReloadButton} from "../../../util/ButtonUtil";
import {employerLink, geoLink, JobTasksLink} from "../../thing/ThingUtil";
import {TaskState} from "../../../util/enum/EnumSlug";
import EnumPicker from "../../../util/enum/EnumPicker";

/**
 *
 */

class FindJobTasks extends ThingDetails {
    constructor () {
        super ({
            heading: "JobTasks",
            hasFilters: true,
            state: "", // filter
            id: "" // filter
        });
    }

    get query () {
        return JobTasksUtil.findJobTasksGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { state, id } = this.store;
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
            "Employer",
            "Geo",
            // this.sortHeader ("name", "Name"),
            this.sortHeader ("state", "State"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (jobTask) {
        return [
            employerLink (jobTask.job.employer),
            geoLink (jobTask.job.geo),
            <TaskState value={jobTask.state} />,
            <ID short={true} value={jobTask.id} />
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
                    onClick={jobTask => window.location.href = `#/data/jobTask/${jobTask.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
                &nbsp;
                <AddButton label={"create"} onClick={() => window.location.hash="/data/jobTask/create"} />
            </div>
        );
    }

    hasFilters () {
        const { state, id} = this.store;
        return Boolean (state || id);
    }

    clearFilters = action (() => {
        this.store.state = "";
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { state, id, showDrawer } = this.store;
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

                    <EnumPicker
                        enumType={"TaskState"}
                        value={state}
                        onChange={state => {
                            this.store.state = state;
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
            { label: "JobTasks" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindJobTasks);

// EOF