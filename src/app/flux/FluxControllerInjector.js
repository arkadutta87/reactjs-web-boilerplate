import React from 'react';

export default {
    propTypes: {
        fluxController: React.PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
    },

    childContextTypes: {
        fluxController: React.PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
    },

    getChildContext() {
        return {
            fluxController: this.props.fluxController
        };
    }

};