import React, { Component } from "react";
import {action, observable} from "mobx";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {If, inAction, TabPanel, withCommas} from "../../util/Utils";
import PrettyPrint from "../../util/PrettyPrint";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import Button from "@mui/material/Button";
import _ from "lodash";
import Server from "../../util/Server";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import "./css/ThingDetails.css";
import "./css/ThingUtil.css";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import classNames from "classnames";
import {CircularProgress} from "@mui/material";
import {observer} from "mobx-react";
import "./css/DataFilters.css";
import Loading from "../../util/Loading";
import GraphQLTracing from "../../system/gql/GraphQLTracing";

/**
 *
 */

class ThingsDetail extends Component {
    store = observable({
        id: null,
        autoLoad: true,
        loading: false,
        heading: "Things",
        debug: false,
        results: null,
        fres: null,
        elapsed: null,
        skip: 0,
        limit: 20,
        tab: 0,
        hasFilters: false,
        showDrawer: false,
        sort: {
            _id: 1
        }
    });

    constructor (init) {
        super();
        _.each (init, (v, k) => {
            this.store[k] = v
        });
        this.toggleSort = this.toggleSort.bind (this);
        this.setSort = this.setSort.bind (this);
    }

    parseParameters () {
        // EMPTY
    }

    componentDidMount() {
        this.parseParameters ();
        if (this.store.autoLoad) {
            this.doLoad ();
        }
    }

    toggleDrawer = (state) => (e) => {
        this.store.showDrawer = state;
    }

    clearFilters () {
        inAction (() => {
            _.map(this.filters.string, el => {
                this.store[el] = "";
            });
            _.map(this.filters.object, el => {
                this.store[el] = null;
            });
            this.doLoad();
        });
    }

    extendVariables (variables) {
        const { sort } = this.store;
        if (sort) {
            variables.sort = JSON.stringify (sort);
        }
        const filters = { };
        _.map (this.filters.string, el => {
            const val = this.store[el];
            if (val) {
                filters[el] = val;
            }
        });
        _.map (this.filters.object, el => {
            const val = this.store[el];
            if (val) {
                filters[el + "Id"] = val.id;
            }
        });
        variables.filters = filters;
        return;
    }

    get query () {
        console.error (this.constructor.name + "get query is unimplemented.");
    }

    hasFilters () {
        return false;
    }

    renderFilters () {
        console.error (this.constructor.name + ".renderFilters is unimplemented.");
        return null;
    }

    setFilter = (which) => action ((value) => {
        this.store[which] = value;
        this.doLoad ();
    });

    get variables () {
        const { skip } = this.store;
        const variables =  {
            skip,
            filters: {},
            limit: this.getLimit ()
        };
        this.extendVariables (variables);
        return {
            req: variables
        };
    }

    doRender () {
        console.error (this.constructor.name + ".doRender is unimplemented.");
    }

    async doLoad () {
        const variables = this.variables;
        const query = this.query;
        const start = new Date ().getTime ();

        this.store.thing = null;
        this.store.results = null;
        this.store.loading = true;

        try {
            const res = await Server.gql (query, variables);
            this.store.results = res;
            const data = res.data;
            if (data) {
                const keys = Object.keys (data);
                if (keys.length === 1) {
                    this.store.fres = data[keys[0]];
                }
            }
        }
        catch (e) {
            const { infoDialogStore } = this.props;
            infoDialogStore.showError (e);
        }
        finally {
            this.store.elapsed = new Date ().getTime () - start;
            this.store.loading = false;
        }
    }

    maybeErrors () {
        const { results } = this.store;
        if (results?.errors?.length > 0) {
            return (
                <Alert severity="error">
                    <AlertTitle>GraphQL Errors</AlertTitle>
                    <ul>
                        {_.map (results?.errors, (error, i) => {
                            return (
                                <li key={i}>
                                    {error.message}
                                </li>
                            );
                        })}
                    </ul>
                </Alert>
            );
        } else {
            return null;
        }
    }

    renderHeader () {
        const { heading } = this.store;

        return (
            <h1 onClick={() => {
                this.store.debug = ! Boolean (this.store.debug);
            }}>
                {heading}
            </h1>
        );
    }

    getLimit () {
        const { limit } = this.store;

        try {
            const value = parseInt (limit);
            if (value > 0) {
                return value;
            } else {
                return 20;
            }
        }
        catch (e) {
            return 20;
        }
    }

    /**
     * Renders the pagination page that allows us to page through the possible results.
     *
     * @param fres
     * @returns {JSX.Element|null}
     */

    renderPagination (fres) {
        if (! fres) {
            return null;
        }
        console.log (JSON.stringify (fres, null, 2));

        const { limit } = this.store;
        const { total, skip } = fres;
        const count = Math.ceil (total / fres.limit);
        const page = Math.floor ((skip / fres.limit) + 1);


        return (
            <div className={"ThingDetailsPagination"}>
                <div>
                    Showing {fres.results.length} of {withCommas (fres.total)}
                </div>
                <div>
                    <div>
                        <Pagination
                            count={count}
                            page={page}
                            size={"large"}
                            color="primary"
                            onChange={action ((e, c) => {
                                this.store.skip = (c - 1) * limit;
                                this.doLoad ();
                            })}
                            showFirstButton
                            showLastButton
                        />
                    </div>
                </div>
                <div>
                    <If condition={this.store.hasFilters}>
                        <>
                            <span className={classNames("DataFilterButton", `DataFilterButton-${this.hasFilters ()}`)} onClick={this.toggleDrawer (true)}>
                                <i className="far fa-filter" />
                            </span>
                            &nbsp;
                        </>
                    </If>
                    <TextField
                        label="Page Size"
                        margin={"dense"}
                        sx={{width: 100}}
                        size={"small"}
                        value={limit}
                        onChange={(e) => {
                            this.store.limit = e.target.value;
                            this.store.skip = 0;
                            this.doLoad();
                        }}
                    />
                </div>
            </div>
        )
    }

    renderDebug (fres) {
        const { tab, results, elapsed, loading } = this.store;

        return (
            <div>
                {this.renderHeader ()}
                {this.maybeErrors ()}
                <Tabs value={tab} onChange={(e, v) => this.store.tab = v}>
                    <Tab label="Rendered" />
                    <Tab label="Results" />
                    <Tab label="Query" />
                    <Tab label="Variables" />
                    <Tab label="Store" />
                    <Tab label="Tracing" />
                </Tabs>
                <TabPanel value={tab} index={0}>
                    {this.renderPagination(fres)}
                    <Loading show={loading} />
                    {this._doRender (fres)}
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <div>
                        <p>Query executed in {withCommas (this.store.elapsed)}ms.</p>
                        <PrettyPrint value={results} />
                        <CopyToClipboard text={JSON.stringify (results, null, 2)}>
                            <Button color="primary">
                                <i className="fal fa-clipboard"></i>
                                &nbsp;
                                Copy
                            </Button>
                        </CopyToClipboard>
                    </div>
                </TabPanel>
                <TabPanel value={tab} index={2}>
                    <PrettyPrint value={this.query} />
                    <CopyToClipboard text={this.query}>
                        <Button color="primary">
                            <i className="fal fa-clipboard"></i>
                            &nbsp;
                            Copy
                        </Button>
                    </CopyToClipboard>
                </TabPanel>
                <TabPanel value={tab} index={3}>
                    <PrettyPrint value={this.variables} />
                    <CopyToClipboard text={JSON.stringify (this.variables, null, 2)}>
                        <Button color="primary">
                            <i className="fal fa-clipboard"></i>
                            &nbsp;
                            Copy
                        </Button>
                    </CopyToClipboard>
                </TabPanel>
                <TabPanel value={tab} index={4}>
                    <PrettyPrint value={this.store} />
                    <CopyToClipboard text={JSON.stringify (this.store, null, 2)}>
                        <Button color="primary">
                            <i className="fal fa-clipboard"></i>
                            &nbsp;
                            Copy
                        </Button>
                    </CopyToClipboard>
                </TabPanel>
                <TabPanel value={tab} index={5} >
                    <GraphQLTracing response={results} elapsed={elapsed}/>
                </TabPanel>
                {this.renderFilters ()}
            </div>
        );
    }

    _doRender (fres) {
        if (fres) {
            return this.doRender (fres);
        } else if (this.store.loading) {
            return <CircularProgress />;
        } else {
            return "Not found.";
        }
    }

    renderNormal (fres) {
        return (
            <div>
                {this.renderHeader ()}
                {this.maybeErrors ()}
                {this.renderPagination(fres)}
                {this.store.loading && <Loading />}
                {this._doRender (fres)}
                {this.renderFilters ()}
            </div>
        );
    }

    render () {
        const { debug, fres } = this.store;
        if (debug) {
            return this.renderDebug (fres);
        } else {
            return this.renderNormal (fres);
        }
    }

    /**
     * Get's the active sort key, if any.
     *
     * @returns {string|null}
     */

    getSortKey () {
        const { sort } = this.store;
        if (sort) {
            return Object.keys (sort)[0];
        } else {
            return null;
        }
    }

    /**
     * Sets the active sort key and direction.
     *
     * @type {(function(*, *=): void) & IAction}
     */

    setSort = action ((key, direction = 1) => {
        this.store.sort = {
            [key]: direction
        };
    });

    /**
     * Inverts the current sort direction for the active (if any) sort key.
     *
     * @type {(function(): void) & IAction}
     */

    toggleSort = action (() => {
        const key = this.getSortKey ();
        if (key) {
            this.store.sort[key] = -this.store.sort[key];
        }
    });

    /**
     * Show the elapsed time.
     * @returns {Element}
     */

    showElapsed () {
        return (
            <div className="ThingElapsed">
                Results fetched in {this.store.elapsed} ms.
            </div>
        );
    }

    /**
     * Convenience function for creating a sorting header.
     *
     * @param key
     * @param label
     * @returns {JSX.Element}
     */

    sortHeader (key, label) {
        const sortKey = this.getSortKey ();
        const direction = sortKey ? this.store.sort[sortKey] : undefined;
        const isMe = sortKey === key;
        const isUp = isMe && direction === 1;
        const isDown = isMe && direction !== 1;

        let icon = <i className="fas fa-sort" style={{ color: "lightgray"}} />;

        if (isMe) {
            if (isUp) {
                icon = <i className="fas fa-sort-up"></i>
            } else if (isDown) {
                icon = <i className="fas fa-sort-down"></i>
            }
        }

        return (
            <span
                className={"ThingDetails-Header"}
                onClick={() => {
                    const current = this.getSortKey();
                    if (current) {
                        if (current === key) {
                            this.toggleSort ();
                        } else {
                            this.setSort (key);
                        }
                    } else {
                        this.setSort (key);
                    }
                    this.doLoad ();
                }}
            >
                {label}
                &nbsp;
                {icon}
            </span>
        );
    }
}

export default ThingsDetail;

// EOF