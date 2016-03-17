import React from 'react';

const RenderIfTrue = (props) => (props.if ? props.children : <noscript/>);

RenderIfTrue.propTypes = {
    if: React.PropTypes.bool.isRequired
};

export default RenderIfTrue;