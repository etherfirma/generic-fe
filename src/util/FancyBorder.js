import React, {Component} from "react";
import "./css/FancyBorder.css";

/**
 * Simulate the form wrapper that Material-UI uses to decorate form controls.
 */

class FancyBorder extends Component {
    render () {
        const { error, label, helperText, children, ...extra } = this.props;
        let className = "FancyBorder";
        if (error) {
            className += " Error";
        }
        return (
            <div className={className} {...extra}>
                <fieldset>
                    <legend>
                        {label}
                    </legend>
                    <div>
                        {children}
                    </div>
                </fieldset>
                {helperText && (
                    <div className={"FancyBorder-helperText"}>
                        {helperText}
                    </div>
                )}
            </div>
        );
    }
}

export default FancyBorder;

// EOF