// static includes
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import 'velocity-animate';

if (!window.jQuery.Velocity) {
    window.jQuery.Velocity = window.Velocity;
}

import 'velocity-animate/velocity.ui.js';

import _ from 'lodash';

import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import FluxController from './../../lib/app/flux/FluxController';

import RestClient from './RestClient';

const DefaultProperties = {native: false, platform: 'browser'};

export default function (routes) {
    const fluxController = new FluxController(DefaultProperties);

    const fluxContext = fluxController.fluxContext;

    fluxContext.restClient = new RestClient({
        cookieUrl: '/',
        baseUrl: '',
        minErrorCode: 400,
        json: true,
        withCredentials: true
    });

    const createFluxComponent = (Component, props) => <Component {...props} fluxController={fluxController}/>;
    render((<Router history={browserHistory} createElement={createFluxComponent}>{routes}</Router>), document.getElementById('__page_root__'));
}