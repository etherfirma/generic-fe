import React from 'react';
import {wrap} from "../../util/Utils";
import ID from "../../util/ID";
import DataTable from "../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import GeoUtil from "./GeoUtil";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, ReloadButton} from "../../util/ButtonUtil";
import {geoLink} from "../thing/ThingUtil";
import {GeoType} from "../../util/enum/EnumSlug";
import TableCell from "@mui/material/TableCell";
import EnumPicker from "../../util/enum/EnumPicker";
import YesNo from "../../util/YesNo";
import BooleanPicker from "../../util/BooleanPicker";

/**
 *
 */

class FindGeos extends ThingDetails {
    constructor () {
        super ({
            heading: "Geos",
            hasFilters: true,
            key: "", // filter
            name: "", //filter
            type: "", //filter
            connectorType: "", //filter
            isActive: null, //filter
            id: "" // filter
        });
    }

    get query () {
        return GeoUtil.findGeosGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { name, key, type, isActive, connectorType, id } = this.store;
        if (isActive !== null) {
            filters.isActive = isActive;
        }
        if (name) {
            filters.name = name;
        }
        if (key) {
            filters.key = key;
        }
        if (type) {
            filters.type = type;
        }
        if (connectorType) {
            filters.connectorType = connectorType;
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
            this.sortHeader ("type", "Type"),
            this.sortHeader ("connectorType", "Connector"),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (geo) {
        return [
            geoLink (geo),
            geo.name,
            <YesNo value={geo.isActive} labelled={true} />,
            <GeoType value={geo.type} />,
            geo.connectorType || '-',
            <ID short={true} value={geo.id} />
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
                    onClick={geo => window.location.href = `#/data/geo/${geo.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { name, id, email, isActive, connectorType, label } = this.store;
        return Boolean (name || id || email || connectorType || isActive || label);
    }

    clearFilters = action (() => {
        this.store.name = "";
        this.store.email = "";
        this.store.id = "";
        this.store.isActive = null;
        this.store.connectorType = "";
        this.store.label = "";
        this.doLoad ();
    });

    renderFilters () {
        const { key, name, type, id, isActive, connectorType, showDrawer } = this.store;
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
                    <TextField
                        {...formProps}
                        value={type}
                        label={"Type"}
                        onChange={(e) => {
                            this.store.type = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <EnumPicker
                        enumType={"ConnectorType"}
                        value={connectorType}
                        onChange={value => this.store.connectorType = value}
                        formProps={formProps}
                    />
                    <BooleanPicker
                        value={isActive}
                        onChange={(boolean) => {
                            this.store.isActive = boolean;
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
            { label: "Geos" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindGeos);

// EOF