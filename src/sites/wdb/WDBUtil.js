
class WDBUtil {
    findWDBsGql =  `query ($req: WorkforceDevelopmentBoardFindRequest!) { 
            findWorkforceDevelopmentBoards (req: $req) { 
                total 
                skip
                limit            
                results { 
                    id           
                     wdbName
                     city
                     state
                     geo { id key }         
                }
            }
        }`;
}

export default new WDBUtil ();

// EOF