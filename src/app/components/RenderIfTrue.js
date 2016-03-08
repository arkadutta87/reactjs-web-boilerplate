import React from 'react';

export default (props) => (props.if ? props.children : <noscript/>);