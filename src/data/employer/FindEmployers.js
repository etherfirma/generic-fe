import React from 'react';
import {wrap} from "../../util/Utils";
import ID from "../../util/ID";
import DataTable from "../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import EmployerUtil from "./EmployerUtil";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, ReloadButton} from "../../util/ButtonUtil";
import {employerLink} from "../thing/ThingUtil";
import YesNo from "../../util/YesNo";
import BooleanPicker from "../../util/BooleanPicker";

/**
 *
 */

class FindEmployers extends ThingDetails {
    constructor () {
        super ({
            heading: "Employers",
            hasFilters: true,
            key: "", // filter
            name: "", //filter
            isActive: null, // filter
            id: "" // filter
        });
    }

    get query () {
        return EmployerUtil.findEmployersGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { name, key, id, isActive } = this.store;
        if (name) {
            filters.name = name;
        }
        if (isActive !== null) {
            filters.isActive = isActive;
        }
        if (key) {
            filters.key = key;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
        return;
    }

    get headers () {
        return [
            this.sortHeader ("key", "Key"),
            this.sortHeader ("name", "Name"),
            this.sortHeader ("isActive", "Active?"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (employer) {
        return [
            employerLink (employer),
            employer.name,
            <YesNo value={employer.isActive} labelled={true} />,
            <ID short={true} value={employer.id} />
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
                    onClick={employer => window.location.href = `#/data/employer/${employer.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <AddButton onClick={() => window.location.href = "#/data/employer/add"} />
                &nbsp;
                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { name, id, key, isActive } = this.store;
        return Boolean (name || id || key || isActive);
    }

    clearFilters = action (() => {
        this.store.name = "";
        this.store.key = "";
        this.store.id = "";
        this.store.isActive = null; 
        this.doLoad ();
    });

    renderFilters () {
        const { key, name, id, isActive, showDrawer } = this.store;
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
                        value={key}
                        label={"Key"}
                        onChange={(e) => {
                            this.store.key = e.target.value;
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
                    <BooleanPicker
                        value={isActive}
                        onChange={(boolean) => {
                            this.store.isActive = boolean;
                            this.doLoad();
                        }}
                        formProps={{
                            fullWidth: true,
                            size: "small"
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
            { label: "Employers" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindEmployers);

// EOF