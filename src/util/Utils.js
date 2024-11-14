import React, { Component } from 'react';
import moment from 'moment' ;
import _ from 'lodash';
import {inject, observer} from "mobx-react";
import * as PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import {action} from "mobx";
import Server from "./Server";
import { renderToString } from 'react-dom/server'

const shadowObject = (obj) => {
    if (obj) {
        const shadow = {};
        _.each (obj, (v, k) => {
            shadow[k] = Boolean (v);
        });
        return shadow;
    } else {
        return obj;
    }
};

class If extends Component {
    render () {
        if (this.props.condition) {
            return React.Children.toArray (this.props.children);
        } else {
            return null;
        }
    }
}

class Counter {
    constructor () {
        this.count = 0;
    }

    next () {
        return this.count++;
    }
}

const guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
};

const formatNullable = (obj, field) => {
    if (_.isArray (field)) {
        _.each (field, (f) => formatNullable (obj, f));
        return;
    }
    const val = obj[field];
    if (val === null || val === undefined) {
        obj[field] = (
            <span style={{  color: "gray" }}>
                <i>null</i>
            </span>
        );
    }
};

const formatBoolean =  (obj, field) => {
    if (_.isArray (field)) {
        _.each (field, (f, i) => formatBoolean (obj, f));
        return;
    }
    const val = obj[field];
    if (val) {
        obj[field] = (
            <div style={{ color: "green" }}>
                <i className="far fa-check"></i>
            </div>
        );
    } else {
        obj[field] = (
            <div style={{ color: "red" }}>
                <i className="far fa-times"></i>
            </div>
        );
    }
};

const formatDate = (obj, field) => {
    if (_.isArray (field)) {
        _.each (field, (f) => formatDate (obj, f));
        return;
    }
    const ts = obj[field];
    if (ts) {
        const m = moment (new Date (ts));
        const display = (
            <div>
                {m.format('MMMM Do YYYY, h:mm:ss a')}
                <br/>
                {m.fromNow ()}
            </div>
        );
        obj[field] = display;
    }
};

const formatLink = (obj, field) => {
    if (_.isArray (field)) {
        _.each (field, (f) => formatLink (obj, f));
        return;
    }
    const url = obj[field];
    if (url) {
        obj[field] = (
            <div>
                <i className="far fa-external-link-alt"></i>
                &nbsp;
                <a href={url} target="__blank">
                    {url}
                </a>
            </div>
        );
    }
};

const withCommas = (x) => {
    if (x !== null && x !== undefined) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        return "-";
    }
};

const objGet = (obj, path) => {
    if (! _.isArray (path)) {
        path = path.split(".");
    }
    for (let i = 0; i < path.length; i ++) {
        if (! obj) {
            return undefined;
        }
        obj = obj[path[i]];
    }
    return obj;
};

const arrayToObject = (arr, key) => {
    const o = { };
    _.each (arr, (el, i) => o[el[key]] = el)
    return o;
};

const initials = (name) => {
    if (! name) {
        return "?";
    }
    let buf = "";
    const els = name.split (' ');
    _.each (els, (el, i) => {
        buf = buf + el.substring (0, 1);
    });
    return buf;
};

const maybeValue = (value) => {
    return value ? value : '-'
};

const isJsonError = (value) => {
    try {
        const json = JSON.parse (value);
        if (! _.isObject (json)) {
            return "Not an object";
        }
    } catch (e) {
        return e.message;
    }
    return null;
};

const nullIfEmpty = (value) => {
    if (value) {
        return value;
    } else {
        return null;
    }
};

const encodeParams = (params) => {
    let str = "";
    _.each (params, (v, k) => {
        if (str === "") {
            str += '?';
        } else {
            str += '&';
        }
        str += encodeURIComponent (k);
        str += '=';
        str += encodeURIComponent (v);
    });
    return str;
};

const encodeUrl = (url, params) => {
    return url + encodeParams (params);
};

const getParams = () => {
    const hash = window.location.hash.substring (1);
    const j = hash.indexOf ("?");
    if (j !== -1) {
        return hash.substring (j + 1)
            .split("&")
            .map(v => v.split("="))
            .reduce( (pre, [key, value]) => ({ ...pre, [key]: decodeURIComponent (value) }), {} );
    } else {
        return { };
    }
};

const maybeId = (obj) => obj?.id;

const maybeParam = (which, defaultValue = null) => {
    const params = getParams ();
    const param = params[which];
    if (param) {
        return param;
    } else {
        return defaultValue;
    }
};

const rgb1 = /^#[0-9a-fA-F]{3}$/;
const rgb2 = /^#[0-9a-fA-F]{6}$/;

const isColor = (color) => {
    return rgb1.test (color) || rgb2.test (color);
};

const jsonTheme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
};

const _render = (value) => {
    if (value == null) {
        return <i>null</i>;
    } else if (value === undefined) {
        return <i>undefined</i>;
    } else if (value === "") {
        return "\"\"";
    } else {
        return value;
    }
};

const listFields = (obj, header, fields) => {
    if (! obj) {
        return (
            <div>
                {header && <h2>{header}</h2>}
                <p><i>null</i></p>
            </div>
        );
    }

    return (
        <div>
            {header && <h2>{header}</h2>}
            <ul>
                {_.map (fields, (field, i) => {
                    return (
                        <li key={i}>
                            <b>{field}</b> - {"" + _render (objGet (obj, field))}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const fixedPoint = (val, dec = 2) => Number.parseFloat(val).toFixed(dec);

const renderNanos = (val) => {
    if (val > 1_000_000) {
        return renderMillis (val);
    } else {
        return renderMicros (val);
    }
};

const renderMicros = (val) => {
    let micros = (Number.parseFloat (val) / 1000).toFixed (0);
    return withCommas (micros) + " µs";
};

const renderMillis = (val) => {
    let micros = (Number.parseFloat (val) / 1_000_000).toFixed (0);
    return withCommas (micros) + " ms";
};


const standardInjects = [ "infoDialogStore", "AuthManager", "debugStore", "snackbarStore", "EnumManager", "Server" ];

const wrap = (thing, extra) => {
    if (extra) {
        return inject(...[...standardInjects, ...extra])(observer(thing));
    }  else {
        return inject(...standardInjects)(observer(thing));
    }
}

const inAction = (lambda) => {
    action (() => lambda ()) ();
};

const NO_SELECTION = "x";
const encodeSelectValue = (value) => value || NO_SELECTION;
const decodeSelectValue = (value) => value === NO_SELECTION ? null : value;

const Pane = (props) => {
    const { left, right } = props;
    return (
        <table style={{ width: "100%" }}>
            <tbody>
            <tr>
                <td style={{ width: "50%" }}>
                    {left}
                </td>
                <td>
                    {right}
                </td>
            </tr>
            </tbody>
        </table>
    );
};

const stringToHash = (s) => {
    var hash = 0;
    if (s.length === 0) {
        return hash;
    }
    for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

const colorBallColors = [
    "lightgray",
    "fuschia",
    "maroon",
    "silver",
    "indianred",
    "lightcoral",
    "salmon",
    "darksalmon",
    "lightsalmon",
    "crimson",
    "firebrick",
    "deeppink",
    "gold",
    "peachpuff",
    "khaki",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "gray",
    "olive",
    "aqua",
    "teal",
    "navy",
    "darkkhaki",
    "lavender",
    "plum",
    "thistle",
    "violet",
    "orchid",
    "rebeccapurple",
    "indigo",
    "blueviolet",
    "seagreen",
    "olivedrab",
    "lightgreen",
    "darkcyan",
    "mediumaquamarine",
    "steelblue",
    "cornflowerblue",
    "lightskyblue",
    "powderblue",
    "royalblue",
    "sienna",
    "peru",
    "darkgoldenrrod",
    "rosybrown",
    "slategray",
    "dimgray"
];

const ColorBall = (props) => {
    const { value } = props;
    let hash = stringToHash (value || "");
    if (hash < 0) {
        hash = -hash;
    }
    const color = colorBallColors[hash % colorBallColors.length];

    return (
        <span style={{ color: color }}>
            ⬤
        </span>
    )
};

const TabPanel = (props) => {
    const {children, value, index} = props;

    if (value !== index) {
        return null;
    } else {
        return (
            <div style={{ marginTop: 12 }}>
                {children}
            </div>
        );
    }
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const cloneJS = (val) => {
    return JSON.parse (JSON.stringify (val));
};

const extractHash = (url) => {
    if (url) {
        const i = url.indexOf ("#");
        if (i !== -1) {
            return url.substring (i);
        } else {
            return null;
        }
    } else {
        return null;
    }
}

class Stopwatch {
    constructor() {
        this.start = new Date ().getTime ();
    }
    stop () {
        return new Date ().getTime () - this.start;
    }
}


const commaSeparatedComponents = (els) => {
    return (
        <div>
            {_.map (els, (el, i) => {
                return (
                    <>
                        {el}
                        {i !== els.length -1 && (
                            <span>,&nbsp;</span>
                        )}
                    </>
                )
            })}
        </div>
    );
}

function invokeMaybe (func) {
    return function () {
        if (func) {
            return func.apply (null, arguments);
        } else {
            return null;
        }
    }
}

function Unimplemented (props) {
    return (
        <Alert severity={"error"}>
            <AlertTitle>Unimplemented</AlertTitle>
        </Alert>
    );
};

const PreJson = ({ json }) => <pre>{JSON.stringify (json, null, 2)}</pre>;

const toBullets = (els) => {
    return (
        <ul>
            {_.map (els, (el, i) => {
                return (
                    <li key={i}>
                        {el}
                    </li>
                );
            })}
        </ul>
    );
}

const doGql = async (obj) => {
    try {
        obj.store.error = null;
        obj.store.result = null;
        obj.store.loading = true;
        const results = await Server.gql (obj.query, obj.variables, obj.files, obj.headers);
        obj.store.results = results;
        obj.store.result = results.data?.res;
        obj.store.error = results.errors === [] ? null : results.errors;
        return obj.store.result;
    } catch (e) {
        obj.store.error = e; 
    } finally {
        obj.store.loading = false;
    }
};

const doGql2 = async (store, func) => {
    try {
        store.loading = true;
        store.error = null;
        store.result = null;
        const res = await func ();
        store.result = res;
        return res;
    }
    catch (e) {
        store.error = e.toString();
    }
    finally {
        store.loading = false;
    }
}

const shortenText = (text, len = 20) => {
    if (text.length < len) {
        return text;
    } else {
        return text.substring (0, len) + "...";
    }
};

/**
 *
 * @param times
 * @param children
 * @returns {*[]}
 * @constructor
 */

const Repeat = ({ times, children}) => {
    const arr = [];
    for (let i = 0; i < times; i ++) {
        arr.push (children);
    }
    return arr;
};

const externalLink = (url, text= url) => {
    if (! url) {
        return "-";
    }
    return (
        <a href={url} target={"__blank"} className={"ThingLink"}>
            {text}
        </a>
    );
}

export  {
    // MaybeError,
    doGql,
    doGql2,
    invokeMaybe,
    commaSeparatedComponents,
    Stopwatch,
    extractHash,
    cloneJS,
    TabPanel,
    stringToHash,
    ColorBall,
    renderNanos,
    listFields,
    isJsonError,
    initials,
    arrayToObject,
    objGet,
    withCommas,
    formatDate,
    formatLink,
    formatBoolean,
    formatNullable,
    maybeValue,
    maybeId,
    nullIfEmpty,
    encodeParams,
    encodeUrl,
    getParams,
    maybeParam,
    jsonTheme,
    fixedPoint,
    shortenText,
    wrap,
    NO_SELECTION,
    encodeSelectValue,
    decodeSelectValue,
    Pane,
    guid,
    Counter,
    isColor,
    If,
    shadowObject,
    Unimplemented,
    inAction,
    PreJson,
    Repeat,
    toBullets,
    externalLink
};

// EOF