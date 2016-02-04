import React from 'react';

export default {
    propTypes: {
        fluxController: React.PropTypes.object.isRequired
    },

    childContextTypes: {
        fluxController: React.PropTypes.object.isRequired
    },

    getChildContext() {
        return {
            fluxController: this.props.fluxController
        };
    }

};