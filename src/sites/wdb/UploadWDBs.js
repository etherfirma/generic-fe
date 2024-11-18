import React, { Component } from "react";
import ThingImport from "../../data/thing/ThingImport";
import _ from "lodash";
import { wrap } from "../../util/Utils";
import {ShowButton} from "../../util/ButtonUtil";

/**
 *
 */

class UploadWDBs extends ThingImport {
    constructor () {
        super("WDB");
    }

    actions () {
        return (
            <>
                {super.actions()}
                &nbsp;
                <ShowButton onClick={() => window.location.hash = `/sites/wdb/find`}/>
            </>
        );
    }

    get query () {
        return `
           mutation ($file: String!) {
                res: uploadWorkforceDevelopmentBoards (file: $file) 
           }
       `;
    }
}

export default wrap (UploadWDBs);


// EOF