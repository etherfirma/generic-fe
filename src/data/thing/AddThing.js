import React, { Component } from "react";
import {observable, action} from "mobx";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {TabPanel, withCommas, doGql, PreJson} from "../../util/Utils";
import PrettyPrint from "../../util/PrettyPrint";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import Button from "@mui/material/Button";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import ErrorBanner from "../../util/ErrorBanner";
import Loading from "../../util/Loading";
import GraphQLTracing from "../../system/gql/GraphQLTracing";
import Validator from "../../login/Validator";

/**
 *
 */

class AddThing extends Component {
    store = observable({
        loading: false,
        header: "Add Thing",
        errors: {},
        error: null,
        slug: "thing",
        debug: false,
        results: null,
        elapsed: null,
        tab: 0
    });

    constructor (init) {
        super();
        _.each (init, (v, k) => {
            this.store[k] = v
        });
    }

    get query () {
        console.error (this.constructor.name + "get query is unimplemented.");
    }

    get variables () {
        console.error (this.constructor.name + "get variables is unimplemented.");
    }

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    doRender () {
        console.error (this.constructor.name + ".doRender is unimplemented.");
    }

    async doAdd () {
        const res = await doGql (this);
        if (res) {
            window.location.hash = `#/data/${this.store.slug}/${res.id}`;
        }
        return;
    }

    /**
     *
     * @param which
     * @param label
     * @returns {Element}
     */

    textField (which, label, extra) {
        const { errors } = this.store;
        const error = errors[which];

        return (
            <TextField
                {...extra}
                label={label}
                value={this.store[which]}
                margin={"dense"}
                size={"small"}
                fullWidth
                onChange={(e) => {
                    this.store[which] = e.target.value;
                    this.validate ();
                }}
                helperText={error}
                error={Boolean (error)}
                variant="outlined"
            />
        );
    }

    renderDebug () {
        const { tab, results, elapsed, header } = this.store;
        const { error, loading } = this.store;

        return (
            <div>
                {this.renderHeader ()}
                <ErrorBanner error={error} />
                <Loading show={loading} />
                <Tabs value={tab} onChange={(e, v) => this.store.tab = v}>
                    <Tab label="Rendered" />
                    <Tab label="Results" />
                    <Tab label="Query" />
                    <Tab label="Variables" />
                    <Tab label="Store" />
                    <Tab label="Tracing" />
                </Tabs>
                <TabPanel value={tab} index={0}>
                    {this.doRender ()}
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <div>
                        <p>Query executed in {withCommas (this.store.elapsed)}ms.</p>
                        {/*<JSONTree data={results} theme={jsonTheme} invertTheme shouldExpandNode={() => true} />*/}
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
            </div>
        );
    }

    renderHeader () {
        const { header } = this.store;
        return (
            <h1 onClick={action (() => {
                this.store.debug = ! Boolean (this.store.debug);
            })}>
                {header}
            </h1>
        );
    }

    renderNormal () {
        return this.doRender ()
    }

    render () {
        const { debug, error, loading } = this.store;
        return (
            <div>
                {this.renderHeader ()}
                <ErrorBanner error={this.store.results?.errors} />
                <Loading show={loading} />
                { debug
                    ? this.renderDebug()
                    : this.renderNormal()
                }
            </div>
        );
    }

    onSuccess (id) {
        const { slug } = this.store;
        window.location.href = `#/data/${slug}/${id}`;
    }

    requireBoolean (which, errors) {
        if (! _.isBoolean (this.store[which])) {
            const label = which.substring (0, 1).toUpperCase() + which.substring (1);
            errors[which] = `${label} must be specified.`;
        }
    }

    require (which, errors) {
        if (! this.store[which]) {
            const label = which.substring (0, 1).toUpperCase() + which.substring (1);
            errors[which] = `${label} must be specified.`;
        }
    }
}

export default AddThing;

// EOF