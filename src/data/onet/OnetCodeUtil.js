
class OnetCodeUtil {
    findOnetCodesGql =  `query ($req: OnetCodeFindRequest!) { 
            findOnetCodes (req: $req) { 
                total 
                skip
                limit            
                results {                
                    id
                    code
                    title
                    description 
                }
            }
        }`;
}

export default new OnetCodeUtil ();

// EOF