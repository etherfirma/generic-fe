
class GeoUtil {
    findGeosGql =  `query ($req: GeoFindRequest!) { 
            findGeos (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    key
                    name
                    type
                }
            }
        }`;
}

export default new GeoUtil ();

// EOF