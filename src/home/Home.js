import ShadowBox from "./ShadowBox";
import "./css/Home.css";
import fakePng from "./fake.png";
import {DashboardBar, DashboardWidget} from "./Dashboard";
import React, {Component} from "react";
import {observable} from "mobx";
import { wrap } from "../util/Utils";
import Loading from "../util/Loading";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import _ from "lodash";
import {employerLink, geoLink} from "../data/thing/ThingUtil";
import GeoUtil from "../data/geo/GeoUtil";

/**
 * The home page.
 */

class Home extends Component {
    store = observable ({
        users: null,
        jobs: null,
        employers: null,
        topJobs: null,
        topGeos: null,
        topEmployers: null
    });

    async componentDidMount() {
        const { Server } = this.props;
        console.log ("server", Server);
        this.store.users = await Server._gql ("query { res: countUsers }");
        this.store.jobs = await Server._gql ("query { res: countJobs }");
        this.store.employers = await Server._gql ("query { res: countEmployers }");
        this.store.topJobs = await Server._gql ("query { res: topJobs (count: 5) { title count } }");
        this.store.topEmployers = await Server._gql ("query { res: topEmployers (count: 5) { employer { id name } count } }");
        this.store.topGeos = await Server._gql ("query { res: topGeos (count: 5) { geo { id name key } count } }");
    }

    render () {
        const { users, jobs, employers } = this.store;
        const { topJobs, topEmployers, topGeos } = this.store;

        return (
            <div>
                <table className={"HomeTable"}>
                    <tbody>
                    <tr>
                        <td colSpan={2}>
                            <img src={fakePng} alt={""}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <DashboardBar>
                                <DashboardWidget label={"Users"} numeric={users} loading={users === null}/>
                                <DashboardWidget label={"Employers"} numeric={employers} loading={employers === null}/>
                                <DashboardWidget label={"Jobs"} numeric={jobs} loading={jobs === null}/>
                                <DashboardWidget label={"Messages"} numeric={"-"} loading={true}/>
                            </DashboardBar>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <TopJobs topJobs={topJobs}/>
                        </td>
                        <td>
                            <TopEmployers topEmployers={topEmployers}/>
                        </td>
                    </tr>
                    <tr>
                    <td>
                        <TopGeos topGeos={topGeos}/>
                    </td>
                        <td>

                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

class TopJobs extends Component {
    render() {
        const { topJobs } = this.props;
        return (
            <ShadowBox>
                <div className={"DashboardLabel"}>
                    Top Jobs
                </div>
                <br/>
                {this.renderTopJobs (topJobs)}
            </ShadowBox>
        );
    }

    renderTopJobs (topJobs) {
        if (! topJobs) {
            return <Loading show={true} />
        }
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableBody>
                            {_.map (topJobs, (job, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell style={{ width: "10%"}}>{i + 1}.</TableCell>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>{job.count}</TableCell>
                                    </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

class TopEmployers extends Component {
    render() {
        const { topEmployers } = this.props;
        return (
            <ShadowBox>
                <div className={"DashboardLabel"}>
                    Top Employers
                </div>
                <br/>
                {this.renderTopEmployers (topEmployers)}
            </ShadowBox>
        );
    }

    renderTopEmployers (topEmployers) {
        if (! topEmployers) {
            return <Loading show={true} />
        }
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableBody>
                            {_.map (topEmployers, (el, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell style={{ width: "10%"}}>{i + 1}.</TableCell>
                                        <TableCell>{employerLink (el.employer)}</TableCell>
                                        <TableCell>{el.count}</TableCell>
                                    </TableRow>
                                )})}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

class TopGeos extends Component {
    render() {
        const { topGeos } = this.props;
        return (
            <ShadowBox>
                <div className={"DashboardLabel"}>
                    Top Geos
                </div>
                <br/>
                {this.renderTopGeos (topGeos)}
            </ShadowBox>
        );
    }

    renderTopGeos (topGeos) {
        if (! topGeos) {
            return <Loading show={true} />
        }
        return (
            <div>
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableBody>
                            {_.map (topGeos, (el, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell style={{ width: "10%"}}>{i + 1}.</TableCell>
                                        <TableCell>
                                            <a href={GeoUtil.linkUrl (el.geo.id)}>
                                                {`${el.geo.name} (${el.geo.key})`}
                                            </a>
                                        </TableCell>
                                        <TableCell>{el.count}</TableCell>
                                    </TableRow>
                                )})}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

export default wrap(Home);

// EOF