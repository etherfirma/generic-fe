import classnames from "classnames";
import {Typography} from "@mui/material";

const EnumSlug = (type) => ({value}) => {
    return (
        <div className={classnames ("EnumSlug", type, `${type}-${value}`)}>
            {/*<span>⏺</span>*/}
            <span>◼</span>
            &nbsp;
            {value}
        </div>
    );
};

const JobState = EnumSlug ("JobState");

export {
    EnumSlug,
    JobState
};

// EOF