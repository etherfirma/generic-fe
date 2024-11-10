
class GeoTargetUtil {
    findGeoTargetsGql =  `query ($req: GeoTargetFindRequest!) { 
            findGeoTargets (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    geo { id key name } 
                    isActive
                    url
                }
            }
        }`;
}

export default new GeoTargetUtil ();

// EOF