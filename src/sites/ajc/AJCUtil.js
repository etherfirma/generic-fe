
class AJCUtil {
    findAJCsGql =  `query ($req: AmericanJobCenterFindRequest!) { 
            findAmericanJobCenters (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id           
                    centerId
                    city, state, 
                    name        
                }
            }
        }`;
}

export default new AJCUtil ();

// EOF