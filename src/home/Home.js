import ShadowBox from "./ShadowBox";
import "./css/Home.css";
import fakePng from "./fake.png";
import {DashboardBar, DashboardWidget} from "./Dashboard";
import React, {Component} from "react";
import {observable} from "mobx";
import YesNo from "../util/YesNo";
import {PreJson, wrap, fixedPoint, encodeUrl, withCommas} from "../util/Utils";
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
import SampleMap from "../system/tests/graph/SampleMap";
import {JobState} from "../util/enum/EnumSlug";

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
        topEmployers: null,
        jobsByState: null,
        jobsByGeo: null
    });

    async componentDidMount() {
        const { Server } = this.props;
        console.log ("server", Server);
        this.store.users = await Server._gql ("query { res: countUsers }");
        this.store.jobs = await Server._gql ("query { res: countJobs }");
        this.store.employers = await Server._gql ("query { res: countEmployers }");
        this.store.topJobs = await Server._gql ("query { res: topJobs (count: 6) { title count } }");
        this.store.topEmployers = await Server._gql ("query { res: topEmployers (count: 6) { employer { id name } count } }");
        this.store.topGeos = await Server._gql ("query { res: topGeos (count: 6) { geo { id name key } count } }");
        this.store.jobsByState = await Server._gql ("query { res: jobsByState { state count } }");
        this.store.jobsByGeo = await Server._gql ("query { res: jobsByGeo { geoId count } }");
    }

    render () {
        const { users, jobs, employers } = this.store;
        const { topJobs, topEmployers, topGeos, jobsByState, jobsByGeo } = this.store;

        return (
            <div>
                <table className={"HomeTable"}>
                    <tbody>
                    <tr>
                        <td style={{textAlign: "center"}}>
                            <SampleMap jobsByGeo={jobsByGeo} />
                        </td>
                        <td>
                            <DashboardBar>
                                <DashboardWidget label={"Users"} value={withCommas (users)} loading={users === null} href={"#/data/users"}/>
                                <DashboardWidget label={"Employers"} value={withCommas (employers)} loading={employers === null} href={"#/data/employers"}/>
                            </DashboardBar>
                            <DashboardBar>
                                <DashboardWidget label={"Jobs"} value={withCommas (jobs)} loading={jobs === null} href={"#/data/jobs"}/>
                                <DashboardWidget label={"Server Status"} value={<YesNo value={true} />} />
                            </DashboardBar>
                        </td>
                        <td colSpan={2}>
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
                            <JobsByState jobsByState={jobsByState} />
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
                <table style={{ width: "100%" }} className={"FancyTable"}>
                    <tbody>
                        {_.map (topJobs, (job, i) => {
                            return (
                                <tr key={i}>
                                    <td style={{ width: "10%"}}>{i + 1}.</td>
                                    <td>
                                        <span className={"ThingLink"} onClick={() => {
                                            const params = { title: job.title };
                                            const href = encodeUrl ("/data/jobs", params)
                                            window.location.hash = href;
                                        }}>
                                            {job.title}
                                        </span>
                                    </td>
                                    <td style={{ width: "10%" }} align={"right"}>
                                        {withCommas (job.count)}
                                    </td>
                                </tr>
                        )})}
                    </tbody>
                </table>
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
                <table style={{ width: "100%" }} className={"FancyTable"}>
                    <tbody>
                        {_.map (topEmployers, (el, i) => {
                            return (
                                <tr key={i}>
                                    <td style={{ width: "10%"}}>{i + 1}.</td>
                                    <td>
                                          <span className={"ThingLink"} onClick={() => {
                                              const params = { employerId: el.employer.id };
                                              const href = encodeUrl("/data/jobs", params)
                                              window.location.hash = href;
                                          }}>
                                              {el.employer.name}
                                          </span>
                                    </td>
                                    <td style={{ width: "10%" }} align={"right"}>
                                        {withCommas (el.count)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

class TopGeos extends Component {
    render() {
        const {topGeos} = this.props;
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
                <table className={"FancyTable"} style={{ width: "100%" }}>
                    <tbody>
                        {_.map (topGeos, (el, i) => {
                            return (
                                <tr key={i}>
                                    <td style={{ width: "10%"}}>{i + 1}.</td>
                                    <td>
                                       <span className={"ThingLink"} onClick={() => {
                                           const params = { geoId: el.geo.id};
                                           const href = encodeUrl("/data/jobs", params)
                                           window.location.hash = href;
                                       }}>
                                          {`${el.geo.name} (${el.geo.key})`}
                                      </span>
                                    </td>
                                    <td style={{ width: "10%" }} align={"right"}>
                                        {withCommas (el.count)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

class JobsByState extends Component {
    render() {
        const {jobsByState} = this.props;
        return (
            <ShadowBox>
                <div className={"DashboardLabel"}>
                    Jobs by Status
                </div>
                <br/>
                {this.renderJobsByState (jobsByState)}
            </ShadowBox>
        );
    }

    renderJobsByState (jobsByState) {
        if (! jobsByState) {
            return <Loading show={true}/>
        }
        let total = 0;
        _.each (jobsByState, (el) => total += el.count);
        return (
            <div>
                    <table className={"FancyTable"} style={{ width: "100%" }}>
                        <tbody>
                            {_.map (jobsByState, (el, i) => {
                                return (
                                    <tr key={i}>
                                        <td>
                                            <span className={"ThingLink"} onClick={() => {
                                                const params = {state: el.state};
                                                const href = encodeUrl("/data/jobs", params)
                                                window.location.hash = href;
                                            }}>
                                              <JobState value={el.state}/>
                                          </span>

                                        </td>
                                        <td style={{ width: 80 }} align={"right"}>
                                            {withCommas (el.count)}
                                        </td>
                                        <td align={"right"}>
                                            {fixedPoint(el.count / total * 100.0)}%
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                {/*</TableContainer>*/}
                <br/>
            </div>
        );
    }
}

export default wrap(Home);

// EOF