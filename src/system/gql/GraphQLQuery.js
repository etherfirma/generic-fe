import React, { Component } from 'react';
import _ from 'lodash';
import {observable, toJS} from "mobx";
import {inject, observer} from "mobx-react";
import './css/Macro.css';
import "./css/GraphQLQuery.css";
import classnames from 'classnames';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import GraphQLTracing from "./GraphQLTracing";
import {isJsonError, TabPanel, objGet, withCommas, getParams} from "../../util/Utils";
import Editor from "@monaco-editor/react";
import FancyBorder from "../../util/FancyBorder";
import {Badge, Button, CircularProgress, DialogActions, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Breadcrumb from "../../util/Breadcrumb";
import Server from "../../util/Server";
import ValidationUtil from "../../util/ValidationUtil";
import ErrorBanner from "../../util/ErrorBanner";
import {IconButton} from "../../util/ButtonUtil";

const stores = [ "infoDialogStore", "Server" ];

const GraphQLQuery = inject (...stores)(observer (
    class GraphQLQuery extends Component {
        store = observable({
            selected: 0,
            reqs: ["query {\n  noOp\n}", "mutation {\n  bootstrap\n}", "", "", "", "", "", "", "", ""],
            contexts: ["{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}", "{}"],
            contextError: null,
            loading: false,
            res: null,
            elapsed: null,
            anchorEl: null,
            tab: 0,
            tab2: 0,
            files: [],
            loadIsOpen: false,
            saveIsOpen: false,
            serverUrl: "",
            serverUrlError: ""
        });

        componentDidMount() {
            const params = getParams ();
            if (params.query) {
                this.store.reqs [0] = params.query;
            }
            if (params.variables) {
                this.store.contexts [0] = params.variables;
            }
        }

        async sendRequest() {
            const {Server} = this.props;
            const {reqs, contexts, selected, files} = this.store;
            const req = reqs[selected];
            const context = contexts[selected];

            const url = this.store.serverUrl || null;
            console.log ("using url", url)
            // const uploads = files.length ? files : null;

            const start = new Date().getTime();
            try {
                this.store.loading = true;
                this.store.res = null;
                this.store.res = await Server.graphQLClient (req, context, files, url);
            }
            catch (e) {
                const {infoDialogStore} = this.props;
                infoDialogStore.showError (e);            }
            finally {
                this.store.loading = false;
                this.store.elapsed = new Date().getTime() - start;
            }


        }


        maybeLocation(error) {
            if (error.locations && error.locations[0]) {
                return (
                    <span>
                        (<i> line {error.locations[0].line}, column {error.locations[0].column}</i>)
                    </span>
                );
            }
        }

        renderErrors(errors) {
            if (errors?.length) {
                return (
                    <div>
                        <ul>
                            {_.map(errors, (error, i) => {
                                return (
                                    <li key={i}>
                                        {error.message} {this.maybeLocation(error)}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            }
        }

        renderData(data) {
            if (data) {
                return (
                    <pre>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                );
            }
        }

        renderResults(res, loading) {
            if (loading) {
                return <CircularProgress/>;
            } else if (res) {
                const {tab2, elapsed} = this.store;
                const { selected, reqs, contexts } = this.store;
                res = toJS (res);
                const fullText = reqs[selected] + "\n" + contexts[selected] + "\n" + JSON.stringify(res.data, null, 2);
                return (
                    <div>
                        <h2>Results</h2>

                        <Tabs
                            value={tab2}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={(e, f) => this.store.tab2 = f}
                        >
                            <Tab label="Results"/>
                            <Tab label="Raw Response"/>
                            <Tab label="Trace"/>
                        </Tabs>
                        <TabPanel value={tab2} index={0}>
                            <CopyToClipboard text={fullText} >
                                <div>
                                    <span>
                                        <i className="fal fa-copy"></i>
                                        &nbsp;
                                        <i>response in {withCommas(elapsed)}ms</i>
                                    </span>
                                </div>
                            </CopyToClipboard>
                            {this.renderErrors(res.errors)}
                            {this.renderData(res.data)}
                        </TabPanel>
                        <TabPanel value={tab2} index={1}>
                            <pre>
                                {JSON.stringify(res, null, 2)}
                            </pre>
                        </TabPanel>
                        <TabPanel value={tab2} index={2}>
                            <GraphQLTracing response={res} elapsed={elapsed}/>
                        </TabPanel>
                    </div>
                );
            } else {
                return null;
            }
        }

        macro(v, k) {
            return (
                <div className={"Macro"} onClick={() => {
                    console.log(v)
                    this.store.req = v;
                }}>
                    {k}
                </div>
            );
        }

        onFileChange(e) {
            this.store.files = e.target.files;
            return;
        }

        showServerUrl() {
            const {Server} = this.props;
            const {serverUrl} = Server;

            if (false) {
                return (
                    <TextField
                        label="GraphQL URL"
                        style={{width: "100%"}}
                        // onChange={(e) => this.store.serverUrl = e.target.value}
                        value={serverUrl}
                        margin="normal"
                        variant="outlined"
                    />
                );
            } else {
                return null;
            }
        }

        fileRef(i) {
            return "${file." + i + "}";
        }

        render() {
            const {reqs, contexts, selected, res, loading, tab} = this.store;
            const {saveIsOpen, loadIsOpen} = this.store;
            const req = reqs[selected];
            const context = contexts[selected];

            const crumbs = [
                { label: null, href: "#/" },
                { label: "System", href: "#/system" },
                { label: "GraphQL" }
            ];

            return (
                <div>
                    <Breadcrumb crumbs={crumbs} />
                    <h1>GraphQL Query</h1>

                    {this.showServerUrl()}

                    <ErrorBanner error={this.store.res?.errors} />

                    <div>
                        <Tabs
                            value={tab}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={(e, f) => this.store.tab = f}
                        >
                            <Tab label="Query"/>
                            <Tab label={
                                isJsonError(context)
                                    ? (
                                        <Badge color="secondary" variant="dot">
                                            <span>Variables</span>
                                        </Badge>
                                    )
                                    : (
                                        <span>Variables</span>
                                    )
                            }/>
                            <Tab label={
                                this.store.files.length
                                    ? (
                                        <Badge color="secondary" variant="dot">
                                            <span>Upload</span>
                                        </Badge>
                                    )
                                    : (
                                        <span>Upload</span>
                                    )
                            }/>
                            <Tab label={"Server"}/>
                        </Tabs>
                        <TabPanel value={tab} index={0}>
                            {this.renderQueryEditor (req, selected)}
                            {this.renderSwitcher()}
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            {this.renderVariablesEditor (context, selected)}
                            {this.renderSwitcher()}
                        </TabPanel>
                        <TabPanel value={tab} index={2}>
                            {_.map(this.store.files, (file, i) => {
                                return (
                                    <div>
                                        <span>
                                            <i className="fal fa-file"></i>
                                            &nbsp;
                                            {this.fileRef(i)}
                                            &nbsp;&nbsp;
                                        </span>
                                        <input id="fileupload" name="myfile" type="file"
                                               onChange={(e) => this.onFileChange(e, i)}/>
                                    </div>
                                )
                            })}
                            <br/><br/>
                            <IconButton icon={"fal fa-file"} label={"Add File"} onClick={() => {
                                this.store.files = [...this.store.files, null];
                            }} />
                            &nbsp;
                            <IconButton icon={"fal fa-trash"} label="Remove File" onClick={() => {
                                this.store.files = this.store.files.slice(0, this.store.files.length - 1);
                            }} />
                        </TabPanel>
                        <TabPanel value={tab} index={3}>
                            <TextField
                                label={"DefaultURL"}
                                value={Server.url}
                                disabled={true}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                variant="outlined"
                            />

                            <TextField
                                label={"ServerURL"}
                                value={this.store.serverUrl}
                                margin={"dense"}
                                size={"small"}
                                fullWidth
                                onChange={(e) => {
                                    const { value } = e.target;
                                    this.store.serverUrl = value;
                                    if (ValidationUtil.isUrl (value)) {
                                        this.store.serverUrlError = "";
                                    } else {
                                        this.store.serverUrlError = "Not a valid URL";
                                    }
                                }}
                                helperText={this.store.serverUrlError}
                                error={Boolean (this.store.serverUrlError)}
                                variant="outlined"
                            />
                        </TabPanel>
                    </div>
                    <br/>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <IconButton icon={"fal fa-paper-plane"} label="Send" disabled={isJsonError(context)} onClick={() => this.sendRequest()} />
                                &nbsp;
                                <IconButton icon={"fal fa-trash"} label="Clear" onClick={() => {
                                    const rs = reqs.slice();
                                    rs[selected] = "";
                                    this.store.reqs = rs;

                                    const cs = contexts.slice();
                                    cs[selected] = "{}";
                                    this.store.contexts = cs;

                                    delete this.store.saveId;
                                    delete this.store.saveName;
                                    delete this.store.saveNamespace;
                                    delete this.store.saveDescription;
                                }} />
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    {this.renderResults(res, loading)}
                </div>
            );
        }

        renderSwitcher() {
            const {reqs, selected} = this.store;

            return (
                <div className={"QuerySelector"}>
                    {_.map(reqs, (req, i) => {
                        const cns = {
                            "QueryEntry": true,
                            "QueryEntry-selected": Boolean(i === selected),
                            "QueryEntry-nonempty": Boolean(req !== "")
                        };
                        return (
                            <span key={i} className={classnames(cns)} onClick={(e) => this.store.selected = i}>
                            ⬤
                          </span>
                        );
                    })}
                </div>
            );
        }

        renderBasicQueryEditor (req, selected) {
            return (
                <TextField
                    label="GraphQL Query"
                    value={req}
                    margin={"dense"}
                    size={"small"}
                    rows={16}
                    multiline={true}
                    fullWidth
                    onChange={(e) => {
                        console.log (e.target.value);
                        this.store.reqs[selected] = e.target.value;
                    }}
                    variant="outlined"
                />
            );
        }

        renderMonacoQueryEditor(req, selected) {
            return (
                <FancyBorder label={"GraphQL Query"} error={this.store.contextError}>
                    <Editor
                        height="300px"
                        defaultLanguage="graphql"
                        value={req}
                        options={{
                            minimap: {
                                enabled: false
                            }
                        }}
                        onChange={(e) => {
                            this.store.reqs[selected] = e.value;
                        }}
                    />
                </FancyBorder>
            )
        };

        renderQueryEditor(req, selected) {
            const connected = false;
            if (connected) {
                return this.renderMonacoQueryEditor (req, selected);
            } else {
                return this.renderBasicQueryEditor (req, selected);
            }
        }

        renderBasicVariablesEditor (context, selected) {
            return (
                <TextField
                    label="GraphQL Variables"
                    value={context}
                    margin={"dense"}
                    size={"small"}
                    rows={16}
                    multiline={true}
                    fullWidth
                    onChange={(e) => {
                        this.store.contexts[selected] = e.target.value;
                    }}
                    variant="outlined"
                />
            );
        }

        renderMonacoVariablesEditor (context, selected) {
            return (
                <FancyBorder label={"Variables"} error={this.store.contextError}>
                    <Editor
                        height="300px"
                        defaultLanguage="json"
                        defaultValue={context}
                        options={{
                            minimap: {
                                enabled: false
                            }
                        }}
                        onChange={(e) => {
                            this.store.contexts[selected] = e;

                        }}
                    />
                </FancyBorder>
            );
        }

        renderVariablesEditor(req, selected) {
            const connected = false;
            if (connected) {
                return this.renderMonacoVariablesEditor (req, selected);
            } else {
                return this.renderBasicVariablesEditor (req, selected);
            }
        }
    }
));

export default GraphQLQuery;

// EOF