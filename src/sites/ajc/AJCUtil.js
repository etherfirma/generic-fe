import React from "react";

class AJCUtil {
    findAJCsGql =  `query ($req: AmericanJobCenterFindRequest!) { 
            findAmericanJobCenters (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id           
                    centerId
                    city,  
                    name    
                    geo { id key }     
                }
            }
        }`;
}

export default new AJCUtil ();

// EOF