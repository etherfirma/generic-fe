import React from 'react';
import {wrap} from "../../util/Utils";
import ID from "../../util/ID";
import DataTable from "../DataTable";
import Button from "@mui/material/Button";
import ThingDetails from "../thing/ThingDetails";
import {action} from "mobx";
import {Drawer} from "@mui/material";
import TextField from "@mui/material/TextField";
import UserUtil from "./UserUtil";
import YesNo from "../../util/YesNo";
import Breadcrumb from "../../util/Breadcrumb";
import {AddButton, ReloadButton} from "../../util/ButtonUtil";
import {userLink} from "../thing/ThingUtil";
import EnumPicker from "../../util/enum/EnumPicker";

/**
 *
 */

class FindUsers extends ThingDetails {
    constructor () {
        super ({
            heading: "Users",
            hasFilters: true,
            email: "", // filter
            name: "", //filter
            handle: "", // filter
            type: "", // filter
            id: "" // filter
        });
    }

    get query () {
        return UserUtil.findUsersGql;
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        const { name, email, type,id } = this.store;
        if (name) {
            filters.name = name;
        }
        if (type) {
            filters.type = type;
        }
        if (email) {
            filters.email = email;
        }
        if (id) {
            filters.id = id;
        }
        variables.filters = filters;
        return;
    }

    get headers () {
        return [
            this.sortHeader("email", "Email"),
            this.sortHeader("name", "Name"),
            <i className="fal fa-user-crown"></i>,
            <i className="fal fa-key"/>,
            this.sortHeader("locked", <i className="fas fa-lock"/>),
            this.sortHeader("_id", "ID")
        ];
    }

    xform(user) {
        return [
            userLink (user),
            user.name,
            <YesNo value={user.type === "ADMIN"} />,
            <YesNo value={user.hasUserLocal} />,
            <YesNo value={user.locked} onClick={async (e) => {
                try {
                    e.stopPropagation()
                    if (await UserUtil.toggleLocked (user)) {
                        console.log("HI")
                        this.doLoad ();
                    }
                } catch (e) {
                    console.log(e);
                }
            }}/>,
            <ID value={user.id} />
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
                    onClick={(user) => window.location.href = `#/data/user/${user.id}`}
                />

                <br/>
                {this.showElapsed ()}
                <br/>

                <AddButton onClick={() => window.location.href = "#/data/user/add"} />
                &nbsp;
                <ReloadButton disabled={this.store.loading} onClick={() => this.doLoad ()} />
            </div>
        );
    }

    hasFilters () {
        const { name, id } = this.store;
        return Boolean (name || id);
    }

    clearFilters = action (() => {
        this.store.name = "";
        this.store.type = "";
        this.store.email = ""; 
        this.store.id = "";
        this.doLoad ();
    });

    renderFilters () {
        const { name, email, id, type, showDrawer } = this.store;
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
                        value={email}
                        label={"Email"}
                        onChange={(e) => {
                            this.store.email = e.target.value;
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
                        value={id}
                        label={"ID"}
                        onChange={(e) => {
                            this.store.id = e.target.value;
                            this.doLoad();
                        }}
                    />
                    <EnumPicker
                        enumType={"UserType"}
                        value={type}
                        onChange={value => {
                            this.store.type = value;
                            this.doLoad();
                        }}
                        formProps={formProps}
                    />
                    <br/>
                    <br/>
                    <Button variant="outlined" onClick={() => this.clearFilters ()}>
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
            { label: "Users" }
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (FindUsers);

// EOF