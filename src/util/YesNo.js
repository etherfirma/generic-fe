import React, { Component } from 'react';

class YesNo extends Component {
    render () {
        const { value, labelled, ...rest } = this.props;
        if (!! value) {
            return (
                <span style={{ color: 'green' }} {...rest}>
                    <i className="fas fa-check"></i>
                    {labelled && (
                        <>
                            &nbsp;{"" + value}
                        </>
                    )}
                </span>
            );
        } else {
            return (
                <span style={{ color: 'red' }} {...rest}>
                    <i className="fas fa-times" ></i>
                    {labelled && (
                        <>
                            &nbsp;{"" + value}
                        </>
                    )}
                </span>
            );
        }
    }
}

export default YesNo;

// EOF