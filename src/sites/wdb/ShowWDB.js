import React from 'react';
import {encodeUrl, formatDate, objGet, wrap} from "../../util/Utils";
import PropertyTable from "../../util/PropertyTable";
import ID from "../../util/ID";
import ThingDetail from "../../data/thing/ThingDetail";
import Breadcrumb from "../../util/Breadcrumb";
import YesNo from "../../util/YesNo";
import _ from "lodash";
import {geoLink} from "../../data/thing/ThingUtil";

/**
 *
 */

class DataWdb extends ThingDetail {
    constructor () {
        super ({
            type: "Workforce Development Board"
        });
    }

    get query () {
        return `
        query ($id: String!) {
            res: workforceDevelopmentBoardById (id: $id) {
                id
                 emailListId
                    addressId
                    wdbName
                    directorName
                    addr1
                    addr2
                    city
                    geo { id key }
                    zipCode
                    phone
                    fax
                    chairName
                    chairAddr1
                    chairAddr2
                    chairCity
                    chairState
                    chairZipCode
                    chairPhone
                    chairFax     
                    latitude
                    longitude       
            } 
        }`;
    }

    actions (wdb) {
        return (
            <div>
            </div>
        );
    }

    /**
     *
     * @param wdbId
     */

    doRender (wdb) {
        if (! wdb) {
            return (
                <span>
                    Wdb not found.
                </span>
            );
        }


        const o = {
            id: <ID snackbar={true} value={wdb.id} />,
            emailListId: wdb.emailListId,
            addressId: wdb.addressId,
            wdbName: wdb.wdbName,
            directorName: wdb.directorName,
            addr1: wdb.addr1,
            addr2: wdb.addr2 || '-',
            city: wdb.city,
            state: geoLink (wdb.geo),
            zipCode: wdb.zipCode,
            phone: wdb.phone,
            fax: wdb.fax || '-',
            chairName: wdb.chairName,
            chairAddr1: wdb.chairAddr1,
            chairAddr2: wdb.chairAddr2 || '-',
            chairCity: wdb.chairCity,
            chairState: wdb.chairState,
            chairZipCode: wdb.chairZipCode,
            chairPhone: wdb.chairPhone,
            chairFax: wdb.chairFax || '-',
            latitude: wdb.latitude,
            longitude: wdb.longitude,
        };

        return (
            <div>
                <PropertyTable value={o} size={"small"} />
                <br/>
                {this.actions (wdb)}
            </div>
        )
    }

    renderHeader () {
        const { result, id } = this.store;
        const crumbs = [
            { label: null, href: "#/" },
            { label: "WDBs", href: "#/sites/wdb/find" },
            { label: result?.centerId || id}
        ];
        return (
            <div>
                <Breadcrumb crumbs={crumbs} />
                {super.renderHeader ()}
            </div>
        );
    }
}

export default wrap (DataWdb);

// EOF