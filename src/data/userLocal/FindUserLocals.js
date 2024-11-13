import React from 'react';
import {wrap} from "../../util/Utils";
import ID from "../../util/ID";
import DataTable from "../DataTable";
import ThingDetails from "../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import UserLocalUtil from "./UserLocalUtil";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, ClearAllButton, ReloadButton} from "../../util/ButtonUtil";
import YesNo from "../../util/YesNo";

/**
 *
 */

class FindUserLocals extends ThingDetails {
    constructor () {
        super ({
            heading: "UserLocals",
            hasFilters: true,
            hashedPassword: "", // filter
            id: "" // filter
        });
    }

    get query () {
        return UserLocalUtil.findUserLocalsGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { hashedPassword, id } = this.store;
        if (hashedPassword) {
            filters.hashedPassword = hashedPassword;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
        return;
    }

    get headers () {
        return [
            this.sortHeader ("hashedPassword", "HashedPassword"),
            // this.sortHeader ("name", "Name"),
            <i className="fal fa-key" />,
            // this.sortHeader ("locked", <i className="fas fa-lock" />),
            this.sortHeader("_id", "ID")
        ];
    }

    xform (userLocal) {
        return [
            userLocal.hashedPassword,
            <YesNo value={userLocal.reset} />,
            <ID short={true} value={userLocal.id} />
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
                    onClick={(user) => window.location.href = `#/data/userLocal/${user.id}`}
                />
                <br/>
                <AddButton onClick={() => window.location.href = "#/data/userLocal/add"} />
                &nbsp;
                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { hashedPassword, id } = this.store;
        return Boolean (hashedPassword || id);
    }

    clearFilters = action (() => {
        this.store.name = "";
        this.store.email = "";
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { hashedPassword, id, showDrawer } = this.store;
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
                        value={hashedPassword}
                        label={"hashedPassword"}
                        onChange={(e) => {
                            this.store.hashedPassword = e.target.value;
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
            { label: "UserLocals" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindUserLocals);

// EOF