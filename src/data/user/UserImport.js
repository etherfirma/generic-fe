import React, { Component } from "react";
import {doGql, PreJson, wrap} from "../../util/Utils";
import _ from "lodash";
import Server from "../../util/Server";
import ThingImport from "./ThingImport";

/**
 *
 */

class UserImport extends ThingImport {
    constructor () {
        super("User");
    }
    get csv () {
        return "/dl/users.csv";
    }

    get query () {
        return `
           mutation ($file: String!) {
                res: uploadUsers (file: $file) 
           }
       `;
    }

    async doExport () {
        try {
            this.store.error = null;
            const query = `
                query ($req: UserFindRequest!) { 
                    res: findUsers (req: $req) { 
                        total 
                        skip
                        limit            
                        results { 
                            id
                            email
                            name
                            handle
                            locked                   
                        }
                    }
                }
            `;
            const variables = {
                "req": {
                    "skip": 0,
                    "filters": {},
                    "limit": -1,
                    "sort": "{\"_id\":1}"
                }
            };
            const res = await Server._gql (query, variables);

            let str = "name,email,handle,locked\n";
            _.forEach (res.results, el => {
                str += el.name + "," + el.email + "," + el.handle + ",false\n";
            });
            const out = window.open ("");
            out.document.write (`<pre>${str}</pre>`);
        }
        catch (e) {
            this.store.error = e;
        }
    }
}

export default wrap (UserImport);

// EOF