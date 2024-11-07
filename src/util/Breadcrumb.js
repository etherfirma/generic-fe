import React, { Component } from "react";
import "./css/Breadcrumb.css";
import _ from "lodash";

class Breadcrumb extends Component {

    /**
     *
     * @param crumb
     * @param key
     * @param isLast
     * @returns {Element}
     */
    renderCrumb (crumb, key, isLast) {
        let { label } = crumb;
        if (! label) {
            if (isLast) {
                label = (
                    <span>
                        <i className="far fa-home"></i>
                        &nbsp;
                        Admin
                    </span>
                );
            } else {
                label = <i className="far fa-home"></i>;
            }
        }
        const { href } = crumb;
        if (href) {
            return (
                <>
                    <a href={href} key={key}>
                        {label}
                    </a>
                    {! isLast && (
                        <>
                            &nbsp;
                            <i className="fas fa-angle-right"></i>
                            &nbsp;
                        </>
                    )}
                </>
            );
        } else {
            return (
                <>
                    <span key={key}>
                        {label}
                    </span>
                    {! isLast && (
                        <>
                            &nbsp;
                            <i className="fas fa-angle-right"></i>
                            &nbsp;
                        </>
                    )}
                </>
            );
        }
    }

    /**
     *
     * @returns {Element}
     */
    render() {
        const { crumbs } = this.props;
        return (
            <div>
                <div className={"Breadcrumb"}>
                    {_.map (crumbs, (crumb, i) => this.renderCrumb (crumb, i, i === crumbs.length - 1))}
                </div>
            </div>
        );
    }
}

const breadcrumbs = (extra) => {
    const els = [ {label: null, href: "#/wf"} ];
    if (extra) {
        if (_.isArray(extra)) {
            els.push(...extra);
        } else {
            els.push(extra);
        }
    }
    return els;
};

export default Breadcrumb;

export {
    breadcrumbs
};

// EOF