
class EmployerGeoUtil {
    findEmployerGeosGql =  `query ($req: EmployerGeoFindRequest!) { 
            findEmployerGeos (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    employerId
                    geoId
                    employer {
                        key
                        name
                        isActive                         
                    }
                    geo { 
                        key
                        name
                        type
                    }
                    isActive
                }
            }
        }`;
}

export default new EmployerGeoUtil ();

// EOF