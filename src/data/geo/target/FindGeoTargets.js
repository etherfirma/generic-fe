import React from 'react';
import {wrap} from "../../../util/Utils";
import ID from "../../../util/ID";
import DataTable from "../../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import GeoTargetUtil from "./GeoTargetUtil";
import Breadcrumb from "../../../util/Breadcrumb";
import {AddButton, ReloadButton} from "../../../util/ButtonUtil";
import {geoLink, geoTargetLink} from "../../thing/ThingUtil";
import YesNo from "../../../util/YesNo";

/**
 *
 */

class FindGeoTargets extends ThingDetails {
    constructor () {
        super ({
            heading: "GeoTargets",
            hasFilters: true,
            geo: "", // filter
            isActive: "", //filter
            id: "" // filter
        });
    }

    get query () {
        return GeoTargetUtil.findGeoTargetsGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { geo, isActive, id } = this.store;
        if (geo) {
            filters.geoId = geo.id;
        }
        if (isActive) {
            filters.isActive = isActive;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
    }

    get headers () {
        return [
            this.sortHeader ("geo", "Geo"),
            this.sortHeader ("url", "URL"),
            this.sortHeader ("isActive", "Active?"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (geoTarget) {
        return [
            geoLink (geoTarget.geo),
            <a href={geoTarget.url} target={"__blank"} >
                {geoTarget.url}
            </a>,
            <YesNo value={geoTarget.isActive} labelled={true} />,
            <ID value={geoTarget.id} />
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
                    onClick={geoTarget => window.location.href = `#/data/geoTarget/${geoTarget.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <AddButton onClick={() => window.location.href = "#/data/geoTarget/add"} />
                &nbsp;
                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { geo, isActive, id } = this.store;
        return Boolean (geo, isActive, id);
    }

    clearFilters = action (() => {
        this.store.geo = null;
        this.store.isActive = null;
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { geo, isActive, id, showDrawer } = this.store;
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
                    {/*    value={email}*/}
                    {/*    label={"Email"}*/}
                    {/*    onChange={(e) => {*/}
                    {/*        this.store.email = e.target.value;*/}
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
                    {/*<TextField*/}
                    {/*    {...formProps}*/}
                    {/*    value={label}*/}
                    {/*    label={"Label"}*/}
                    {/*    onChange={(e) => {*/}
                    {/*        this.store.label = e.target.value;*/}
                    {/*        this.doLoad();*/}
                    {/*    }}*/}
                    {/*/>*/}
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
            { label: "GeoTargets" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindGeoTargets);

// EOF