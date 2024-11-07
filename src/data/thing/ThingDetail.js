import React, { Component } from "react";
import {observable, toJS} from "mobx";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {doGql, TabPanel, withCommas, encodeUrl } from "../../util/Utils";
import PrettyPrint from "../../util/PrettyPrint";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import _ from "lodash";
import ValidationUtil from "../../util/ValidationUtil";
import { matchPath } from "react-router"
import ErrorBanner from "../../util/ErrorBanner";
import Loading from "../../util/Loading";
import GraphQLTracing from "../../system/gql/GraphQLTracing";
import {CopyButton, IconButton} from "../../util/ButtonUtil";

/**
 *
 */

class ThingDetail extends Component {
    store = observable({
        id: null,
        loading: false,
        type: "Thing",
        debug: false,
        result: null,
        elapsed: null,
        autoLoad: true,
        debugTab: 0,
        isMongoId: true
    });

    constructor (init) {
        super();
        _.each (init, (v, k) => {
            this.store[k] = v
        });
    }

    componentWillUpdate (nextProps, nextState, nextContext) {
        const params = this.getParams ();
        const nextId = params.id;

        if (nextId && this.store.id !== nextId) {
            this.store.id = nextId;
            this.maybeLoad ();
        }
    }

    getParams () {
        const match = matchPath({ path: "/data/:type/:id" }, window.location.hash.substring (1));
        return match?.params;
    }

    componentDidMount() {
        const params = this.getParams ();
        this.store.id = params.id || "";
        this.maybeLoad ();
    }

    maybeLoad () {
        const { id } = this.store;
        if (this.store.isMongoId) {
            if (ValidationUtil.isMongoId (id)) {
                this.doLoad ();
            } else {
                this.store.error = `Not a mongo id: ${id}`;
            }
        } else {
            this.doLoad ();
        }
    }

    get query () {
        console.error (this.constructor.name + "get query is unimplemented.");
    }

    get variables () {
        const { id } = this.store;
        return { id };
    }

    doRender () {
        console.error (this.constructor.name + ".doRender is unimplemented.");
    }

    async doLoad () {
        doGql (this);
    }

    renderHeader () {
        const { type, id } = this.store;

        return (
            <h1 onClick={() => {
                this.store.debug = ! Boolean (this.store.debug);
            }}>
                {type}: {id}
            </h1>
        );
    }

    renderDebug (thing) {
        const { debugTab, results, elapsed } = this.store;

        return (
            <div>
                <Tabs value={debugTab} onChange={(e, v) => this.store.debugTab = v}>
                    <Tab label="Rendered" />
                    <Tab label="Results" />
                    <Tab label="Query" />
                    <Tab label="Variables" />
                    <Tab label="Store" />
                    <Tab label="Tracing" />
                </Tabs>
                <TabPanel value={debugTab} index={0}>
                    {this.doRender (toJS (thing))}
                </TabPanel>
                <TabPanel value={debugTab} index={1}>
                    <div>
                        <p>Query executed in {withCommas (this.store.elapsed)}ms.</p>
                        {/*<JSONTree data={results} theme={jsonTheme} invertTheme shouldExpandNode={() => true} />*/}
                        <PrettyPrint value={results} />
                        <CopyToClipboard text={JSON.stringify (results, null, 2)}>
                            <CopyButton />
                        </CopyToClipboard>
                    </div>
                </TabPanel>
                <TabPanel value={debugTab} index={2}>
                    <PrettyPrint value={this.query} />
                    <CopyToClipboard text={this.query}>
                        <CopyButton />
                    </CopyToClipboard>
                    &nbsp;
                    <IconButton icon={"fal fa-brackets-curly"} label={"GraphQL"} onClick={() => {
                        const params = {
                            query: this.query,
                            variables: JSON.stringify (this.variables)
                        };
                        window.location.hash = encodeUrl ("#/system/gql", params);;
                    }}/>
                </TabPanel>
                <TabPanel value={debugTab} index={3}>
                    <PrettyPrint value={this.variables} />
                    <CopyToClipboard text={JSON.stringify (this.variables, null, 2)}>
                        <CopyButton />
                    </CopyToClipboard>
                </TabPanel>
                <TabPanel value={debugTab} index={4}>
                    <PrettyPrint value={this.store} />
                    <CopyToClipboard text={JSON.stringify (this.store, null, 2)}>
                        <CopyButton />
                    </CopyToClipboard>
                </TabPanel>
                <TabPanel value={debugTab} index={5} >
                    <GraphQLTracing response={results} elapsed={elapsed}/>
                </TabPanel>
            </div>
        );
    }

    _render () {
        const { debug, result } = this.store;
        if (result) {
            if (debug) {
                return this.renderDebug(result);
            } else {
                return this.doRender(result);
            }
        } else {
            return "No result found.";
        }
    }

    render () {
        const { loading, error, debug, result } = this.store;
        return (
            <div>
                {this.renderHeader()}
                <ErrorBanner error={error} />
                {loading
                    ? <Loading show={true} />
                    : this._render ()
                }
            </div>
        );
    }
}

export default ThingDetail;

// EOF