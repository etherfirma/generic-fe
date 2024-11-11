import classnames from "classnames";
import {Typography} from "@mui/material";

const EnumSlug = (type) => ({value}) => {
    return (
        <div className={classnames ("EnumSlug", type, `${type}-${value}`)}>
            <span>⏺</span>
            &nbsp;
            {value}
        </div>
    );
};

// const ClaimStatus = EnumSlug ("ClaimStatus");
// const ResourceStatus = EnumSlug ("ResourceStatus");
// const ResourceLicense = EnumSlug ("ResourceLicense");
// const MediaType = EnumSlug ("MediaType");
// const OrganizationType = EnumSlug ("OrganizationType");

export {
    EnumSlug,
};

// EOF