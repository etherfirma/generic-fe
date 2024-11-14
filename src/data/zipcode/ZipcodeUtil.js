

class ZipcodeUtil {
    findZipcodesGql = `query ($req: ZipcodeFindRequest!) { 
            findZipcodes (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    postalCode
                    countryCode 
                    placeName
                    adminCode1
                }
            }
        }`;
}

export default new ZipcodeUtil ();

// EOF