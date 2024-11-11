const EnumSlug = (type) => ({value}) => {
    return (
        <div className={classnames (type, `${type}-${value}`)}>
            <span>⏺</span>
            &nbsp;
            {value}
        </div>
    );
};

const ClaimStatus = EnumSlug ("ClaimStatus");
const ResourceStatus = EnumSlug ("ResourceStatus");
const ResourceLicense = EnumSlug ("ResourceLicense");
const MediaType = EnumSlug ("MediaType");
const OrganizationType = EnumSlug ("OrganizationType");

export {
    ClaimStatus,
    ResourceStatus,
    ResourceLicense,
    MediaType,
    OrganizationType
};

// EOF