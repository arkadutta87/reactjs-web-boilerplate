import React from 'react';

export default React.createClass({
    propTypes: {
        if: React.PropTypes.bool.isRequired
    },

    render() {
        return this.props.if ? this.props.children : <noscript/>;
    }
});