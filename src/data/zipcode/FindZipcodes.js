import React from 'react';
import {wrap} from "../../util/Utils";
import ID from "../../util/ID";
import DataTable from "../DataTable";
import ThingDetails from "../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import ZipcodeUtil from "./ZipcodeUtil";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, ClearAllButton, ReloadButton} from "../../util/ButtonUtil";
import YesNo from "../../util/YesNo";

/**
 *
 */

class FindZipcodes extends ThingDetails {
    constructor () {
        super ({
            heading: "Zipcodes",
            hasFilters: true,
            postalCode: "", // filter
            countryCode: "", // filter
            id: "" // filter
        });
    }

    get query () {
        return ZipcodeUtil.findZipcodesGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { postalCode, countryCode, id } = this.store;
        if (postalCode) {
            filters.postalCode = postalCode;
        }
        if (countryCode) {
            filters.countryCode = countryCode;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
    }

    get headers () {
        return [
            this.sortHeader ("placeName", "City"),
            this.sortHeader ("adminCode1", "State"),
            this.sortHeader ("postalCode", "Zip Code"),
            this.sortHeader ("countryCode", "Country"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (zipcode) {
        return [
            zipcode.placeName,
            zipcode.adminCode1,
            zipcode.postalCode,
            zipcode.countryCode,
            <ID short={true} value={zipcode.id} />
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
                    onClick={(user) => window.location.href = `#/data/zipcode/${user.id}`}
                />
                <br/>
                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { countryCode, postalCode, id } = this.store;
        return Boolean (postalCode || countryCode || id);
    }

    clearFilters = action (() => {
        this.store.countryCode = "";
        this.store.postalCode = "";
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { postalCode, countryCode, id, showDrawer } = this.store;
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
                        value={countryCode}
                        label={"Country Code"}
                        onChange={(e) => {
                            this.store.countryCode = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <TextField
                        {...formProps}
                        value={postalCode}
                        label={"Postal Code"}
                        onChange={(e) => {
                            this.store.postalCode = e.target.value;
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
                    <ClearAllButton onClick={() => this.clearFilters ()} />
                </div>
            </Drawer>
        )
    }

    renderHeader () {
        const crumbs = [
            { label: null, href: "#/" },
            { label: "Zipcodes" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindZipcodes);

// EOF