import React from 'react';
import {wrap} from "../../../util/Utils";
import ID from "../../../util/ID";
import DataTable from "../../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import EmployerUtil from "./EmployerGeoUtil";
import Breadcrumb from "../../../util/Breadcrumb";
import {AddButton, ReloadButton} from "../../../util/ButtonUtil";
import {employerLink, geoLink} from "../../thing/ThingUtil";
import YesNo from "../../../util/YesNo";
import BooleanPicker from "../../../util/BooleanPicker";
import EmployerGeoUtil from "./EmployerGeoUtil";
import {GeoType} from "../../../util/enum/EnumSlug";
import TableCell from "@mui/material/TableCell";

/**
 *
 */

class FindEmployerGeos extends ThingDetails {
    constructor () {
        super ({
            heading: "EmployerGeos",
            hasFilters: true,
            employer: null, // filter
            geo: null, //filter
            isActive: null, // filter
            id: "" // filter
        });
    }

    get query () {
        return EmployerGeoUtil.findEmployerGeosGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { employer, geo, isActive, id } = this.store;
        if (employer) {
            filters.employerId = employer.id;
        }
        if (isActive !== null) {
            filters.isActive = isActive;
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
            this.sortHeader ("employer", "Employer"),
            this.sortHeader ("geo", "Geo"),
            this.sortHeader ("geoType", "Geo Type"),
            this.sortHeader ("isActive", "Active?"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (employerGeo) {
        return [
            employerLink (employerGeo.employer),
            geoLink (employerGeo.geo),
            <GeoType value={employerGeo.geo.type} />,
            <YesNo value={employerGeo.isActive} />,
            <ID value={employerGeo.id} />
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
                    onClick={employerGeo => window.location.href = `#/data/employerGeo/${employerGeo.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <AddButton onClick={() => window.location.href = "#/data/employerGeo/add"} />
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
        this.store.employer = null;
        this.store.geo = null;
        this.store.isActive = null;
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { employer, geo, isActive, id, showDrawer } = this.store;
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
            { label: "EmployerGeos" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindEmployerGeos);

// EOF