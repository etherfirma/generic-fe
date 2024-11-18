import React, { Component } from "react";
import ThingImport from "../../data/thing/ThingImport";
import _ from "lodash";
import { wrap } from "../../util/Utils";
import {ShowButton} from "../../util/ButtonUtil";

/**
 *
 */

class UploadJCs extends ThingImport {
    constructor () {
        super("JC");
    }

    actions () {
        return (
            <>
                {super.actions()}
                &nbsp;
                <ShowButton onClick={() => window.location.hash = `/sites/jc/find`}/>
            </>
        );
    }

    get query () {
        return `
           mutation ($file: String!) {
                res: uploadJobClubs (file: $file) 
           }
       `;
    }
}

export default wrap (UploadJCs);


// EOF