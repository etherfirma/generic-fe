
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
                    isActive
                    connectorType
                }
            }
        }`;

    linkUrl (geoId) {
        return `#/data/geo/${geoId}`;
    }
}

export default new GeoUtil ();

// EOF