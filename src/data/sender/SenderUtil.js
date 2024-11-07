import "./css/SenderLink.css";

const senderLink = (sender) => {
    return (
        <span className="ThingLink" onClick={() => window.location.hash = `#/data/sender/${sender.id}`}>
            {sender.email}
        </span>
    )
};

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

export {
    senderLink
};

// EOF