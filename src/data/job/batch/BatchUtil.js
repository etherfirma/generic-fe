
class BatchUtil {
    findBatchesGql =  `query ($req: BatchFindRequest!) { 
            findBatches (req: $req) { 
                total 
                skip
                limit            
                results {                
                    id
                    importType
                    user { id name email } 
                    jobCount
                    malformed
                    jobsAdded
                    jobsAlready
                    jobsFailed
                    created                   
                }
            }
        }`;
}

export default new BatchUtil ();

// EOF