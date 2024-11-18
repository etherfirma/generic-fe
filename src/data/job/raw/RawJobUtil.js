
class RawJobUtil {
    findRawJobsGql =  `query ($req: RawJobFindRequest!) { 
            findRawJobs (req: $req) { 
                total 
                skip
                limit            
                results {                
                    id
                    jobKey
                    batchId
                    blob 
                }
            }
        }`;
}

export default new RawJobUtil ();

// EOF