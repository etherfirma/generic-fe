
class SenderUtil {
    findSendersGql =  `query ($req: SenderFindRequest!) { 
            findSenders (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id
                    email
                    label
                    name
                }
            }
        }`;
}

export default new SenderUtil ();

// EOF