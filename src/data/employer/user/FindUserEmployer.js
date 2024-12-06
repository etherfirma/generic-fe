import React from 'react';
import {wrap} from "../../../util/Utils";
import ID from "../../../util/ID";
import DataTable from "../../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import EmployerUtil from "./UserEmployerUtil";
import Breadcrumb from "../../../util/Breadcrumb";
import {AddButton, ReloadButton} from "../../../util/ButtonUtil";
import {employerLink, geoLink, userLink} from "../../thing/ThingUtil";
import YesNo from "../../../util/YesNo";
import BooleanPicker from "../../../util/BooleanPicker";
import userEmployerUtil from "./UserEmployerUtil";
import {GeoType} from "../../../util/enum/EnumSlug";
import UserEmployerUtil from "./UserEmployerUtil";

/**
 *
 */

class FindUserEmployers extends ThingDetails {
    constructor () {
        super ({
            heading: "UserEmployers",
            hasFilters: true,
            employer: null, // filter
            user: null, //filter
            isActive: null, // filter
            id: "" // filter
        });
    }

    get query () {
        return UserEmployerUtil.findUserEmployersGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { employer, user, isActive, id } = this.store;
        if (employer) {
            filters.employerId = employer.id;
        }
        if (isActive !== null) {
            filters.isActive = isActive;
        }
        if (user) {
            filters.userId = user.id;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
        return;
    }

    get headers () {
        return [
            this.sortHeader ("employer", "Employer"),
            this.sortHeader ("user", "User"),
            this.sortHeader ("isActive", "Active?"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (userEmployer) {
        return [
            employerLink (userEmployer.employer),
            userLink (userEmployer.user),
            <YesNo value={userEmployer.isActive} labelled={true} />,
            <ID short={true} value={userEmployer.id} />
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
                    onClick={userEmployer => window.location.href = `#/data/userEmployer/${userEmployer.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <AddButton onClick={() => window.location.href = "#/data/userEmployer/add"} />
                &nbsp;
                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { name, id, user, isActive } = this.store;
        return Boolean (name || id || user || isActive);
    }

    clearFilters = action (() => {
        this.store.employer = null;
        this.store.user = null;
        this.store.isActive = null;
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { employer, user, isActive, id, showDrawer } = this.store;
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

                    {/*<TextField*/}
                    {/*    {...formProps}*/}
                    {/*    value={key}*/}
                    {/*    label={"Key"}*/}
                    {/*    onChange={(e) => {*/}
                    {/*        this.store.key = e.target.value;*/}
                    {/*        this.doLoad();*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<TextField*/}
                    {/*    {...formProps}*/}
                    {/*    value={name}*/}
                    {/*    label={"Name"}*/}
                    {/*    onChange={(e) => {*/}
                    {/*        this.store.name = e.target.value;*/}
                    {/*        this.doLoad();*/}
                    {/*    }}*/}
                    {/*/>*/}
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
            { label: "UserEmployers" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindUserEmployers);

// EOF