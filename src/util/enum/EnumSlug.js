import classnames from "classnames";
import {Typography} from "@mui/material";

const EnumSlug = (type) => ({value}) => {
    return (
        <div className={classnames("EnumSlug", type, `${type}-${value}`)}>
            {/*<span>⏺</span>*/}
            {/*<span>◼</span>*/}
            <i className="fas fa-circle"></i>
            &nbsp;
            {value}
        </div>
    );
};

const JobState = EnumSlug ("JobState");
const TaskState = EnumSlug ("TaskState");
const GeoType = EnumSlug ("GeoType");
const ConnectorType = EnumSlug ("ConnectorType");

export {
    EnumSlug,
    ConnectorType,
    JobState,
    GeoType,
    TaskState
};

// EOF