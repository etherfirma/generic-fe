
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
                }
            }
        }`;
}

export default new WDBUtil ();

// EOF