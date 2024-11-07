import React, { Component } from 'react';

class Loading extends Component {
    render () {
        const { show } = this.props;
        if (show) {
            return (
                <div className="fa-2x" style={{ color: "cornflowerblue" }}>
                    <i className="fas fa-sync fa-spin"></i>
                </div>
            );
        } else {
            return null;
        }
    }
}

Loading.defaultProps = {
    size: 128,
    show: false
};
function TinyLoading () {
    return (
        <i className="fas fa-redo-alt fa-spin" style={{ color: "lightgray" }}></i>
    );
}
export default Loading;

export {
    TinyLoading
};

// EOF
