import React, { Component } from "react";
import {doGql, wrap, PreJson, fixedPoint, TabPanel, If, externalLink} from "../util/Utils";
import Validator from "../login/Validator";
import {observable, action} from "mobx";
import TextField from "@mui/material/TextField";
import {IconButton} from "../util/ButtonUtil";
import ErrorBanner from "../util/ErrorBanner";
import _ from "lodash";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import "./css/RadiusSearch.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import GeoPicker from "../data/geo/GeoPicker";

/**
 *
 */

const VALIDATION = [
    {
        path: "lat",
        name: "Latitude",
        required: true,
        validator: Validator.floatValidator
    },
    {
        path: "lon",
        name: "Longitude",
        required: true,
        validator: Validator.floatValidator
    },
    {
        path: "miles",
        name: "Miles",
        required: true,
        validator: Validator.floatValidator
    },
];

const PRESETS = [
        {
            "name": "New York City",
            "latitude": 40.7128,
            "longitude": -74.0060
        },
        {
            "name": "Los Angeles",
            "latitude": 34.0522,
            "longitude": -118.2437
        },
        {
            "name": "Chicago",
            "latitude": 41.8781,
            "longitude": -87.6298
        },
        {
            "name": "Houston",
            "latitude": 29.7604,
            "longitude": -95.3698
        },
        {
            "name": "Phoenix",
            "latitude": 33.4484,
            "longitude": -112.0740
        },
        {
            "name": "Philadelphia",
            "latitude": 39.9526,
            "longitude": -75.1652
        },
        {
            "name": "San Antonio",
            "latitude": 29.4241,
            "longitude": -98.4936
        },
        {
            "name": "San Diego",
            "latitude": 32.7157,
            "longitude": -117.1611
        },
        {
            "name": "Dallas",
            "latitude": 32.7767,
            "longitude": -96.7970
        },
        {
            "name": "San Jose",
            "latitude": 37.3382,
            "longitude": -121.8863
        }
    ]
;

/**
 *
 */

class RadiusSearch extends Component {
    store = observable ({
        errors: { },
        lat: "",
        lon: "",
        miles: "50.0",
        preset: "",
        tab: 0,
        geo: null,
        // from doGql
        results: null,
        result: null,
        error: "sdfdssdfsdfa",
        loading: null
    });

    validator = new Validator (this, VALIDATION)

    get isValid () {
        return this.validator.isValid;
    }

    validate () {
        this.validator.validate();
    }

    componentDidMount() {
        this.validate ();
    }

    textField (which, label, extra) {
        const { errors } = this.store;
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
                helperText={errors[which]}
                error={Boolean (errors[which])}
                variant="outlined"
            />
        );
    }

    render () {
        return (
            <div>
                <h1>RadiusSearch</h1>

                <ErrorBanner error={this.store.banner} />

                <table className={"RadiusSearchTable"}>
                    <tbody>
                    <tr>
                        <td>
                            {this.textField ("lat", "Latitude")}
                        </td>
                        <td>
                            {this.textField ("lon", "Longitude")}
                        </td>
                        <td>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Presets</InputLabel>
                                <Select
                                    value={this.store.preset}
                                    margin={"dense"}
                                    size={"small"}
                                    label="Presets"
                                    onChange={action ((e) => {
                                        const preset = e.target.value;
                                        this.store.preset = preset;
                                        this.store.lat = preset.latitude;
                                        this.store.lon = preset.longitude;
                                        this.validate ();
                                    })}
                                >
                                    {_.map (PRESETS, (preset, i) => {
                                        return (
                                            <MenuItem value={preset}>
                                                {preset.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {this.textField ("miles", "Miles")}
                        </td>
                        <td>
                            <GeoPicker
                                value={this.store.geo?.id}
                                required={false}
                                onChange={geo => this.store.geo = geo}
                                formProps={{
                                    fullWidth: true,
                                    size: "small"
                                }}
                            />
                        </td>
                        <td>

                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <IconButton icon={"fal fa-globe"} label="Geo Search" disabled={! this.isValid} onClick={() => {
                                this.submit ();
                            }}/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                {this.renderResults (this.store.results)}
            </div>
        );
    }

    renderResults (results) {
        if (! results) {
            return;
        }
        const { tab } = this.store;
        return (
            <div>
                <h2>Geo Search Results</h2>

                <Tabs
                    value={tab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={(e, f) => this.store.tab = f}
                >
                    <Tab label="American Job Center"/>
                    <Tab label="Job Center"/>
                    <Tab label="Workforce Development Board"/>
                </Tabs>
                <TabPanel value={tab} index={0}>
                    {this.renderAjc (results?.data?.a)}
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    {this.renderJc (results?.data?.b)}
                </TabPanel>
                <TabPanel value={tab} index={2}>
                    {this.renderWdb (results?.data?.c)}
                </TabPanel>
            </div>
        );
    }

    renderJc (results) {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Index</TableCell>
                            <TableCell>Center</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Distance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_.map (results, (el, i) => {
                            return (
                                <TableRow key={i} onClick={() => window.location.hash = `/data/jc/${el.jc.id}`}>
                                    <TableCell component="th" scope="row">
                                        {i + 1}.
                                    </TableCell>
                                    <TableCell>
                                        {externalLink (el.jc.url, el.jc.name)}
                                    </TableCell>
                                    <TableCell>
                                        {el.jc.city}
                                    </TableCell>
                                    <TableCell>
                                        {el.jc.state}
                                    </TableCell>
                                    <TableCell>
                                        {fixedPoint (el.distance, 2)} miles
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        <If condition={results.length === 0}>
                            <TableRow>
                                <TableCell colSpan={5}>
                                    No results.
                                </TableCell>
                            </TableRow>
                        </If>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    renderWdb (results) {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Index</TableCell>
                            <TableCell>Center</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Distance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_.map (results, (el, i) => {
                            return (
                                <TableRow key={i} onClick={() => window.location.hash = `/data/wdb/${el.wdb.id}`}>
                                    <TableCell component="th" scope="row">
                                        {i + 1}.
                                    </TableCell>
                                    <TableCell>
                                        {el.wdb.wdbName}
                                    </TableCell>
                                    <TableCell>
                                        {el.wdb.city}
                                    </TableCell>
                                    <TableCell>
                                        {el.wdb.state}
                                    </TableCell>
                                    <TableCell>
                                        {fixedPoint (el.distance, 2)} miles
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        <If condition={results.length === 0}>
                            <TableRow>
                                <TableCell colSpan={5}>
                                    No results.
                                </TableCell>
                            </TableRow>
                        </If>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    renderAjc (results) {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Index</TableCell>
                            <TableCell>Center</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Distance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {_.map (results, (el, i) => {
                            return (
                                <TableRow key={i} onClick={() => window.location.hash = `/data/ajc/${el.ajc.id}`}>
                                    <TableCell component="th" scope="row">
                                        {i + 1}.
                                    </TableCell>
                                    <TableCell>
                                        {externalLink (el.ajc.url, el.ajc.name)},
                                    </TableCell>
                                    <TableCell>
                                        {el.ajc.city}
                                    </TableCell>
                                    <TableCell>
                                        {el.ajc.state}
                                    </TableCell>
                                    <TableCell>
                                        {fixedPoint (el.distance, 2)} miles
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        <If condition={results.length === 0}>
                            <TableRow>
                                <TableCell colSpan={5}>
                                    No results.
                                </TableCell>
                            </TableRow>
                        </If>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }


    async submit () {
        await doGql (this);
    }

    get query () {
        return `query ($lat: Float!, $lon: Float!, $radius: Float!, $state: String) {
            a: findAmericanJobCentersWithinRadius (lat: $lat, lon: $lon, radius: $radius, state: $state) {
                ajc { 
                    id
                    centerId
                    name
                    city
                    state
                    siteType
                    url
                }
                distance 
            } 
            b: findJobClubsWithinRadius (lat: $lat, lon: $lon, radius: $radius, state: $state) {
                jc { 
                    id
                    name
                    city
                    state
                    siteType
                    url
                }
                distance 
            } 
            c: findWorkforceDevelopmentBoardsWithinRadius (lat: $lat, lon: $lon, radius: $radius, state: $state) {
                wdb { 
                    id
                    wdbName
                    city
                    state
                    siteType
                }
                distance 
            } 
        }`;
    }

    get variables () {
        const { lat, lon, geo, miles } = this.store;
        const km = miles / 1.609344;
        return {
            lat: parseFloat (lat),
            lon: parseFloat (lon),
            radius: km,
            state: geo?.key
        };
    }
}

export default wrap (RadiusSearch);

// EOF