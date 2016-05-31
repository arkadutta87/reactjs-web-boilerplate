// static includes
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import 'velocity-animate';

if (!window.jQuery.Velocity) {
    window.jQuery.Velocity = window.Velocity;
}

import 'velocity-animate/velocity.ui.js';

import React from 'react';
import { render } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';

import FluxController from './../../lib/app/flux/FluxController';

import RestClient from './RestClient';

const DefaultProperties = {native: false, platform: 'browser'};

export default function (routesBuilder) {
    const fluxController = new FluxController(DefaultProperties);

    const routes = routesBuilder(fluxController.appProperties);

    const fluxContext = fluxController.fluxContext;

    fluxContext.restClient = new RestClient({
        cookieUrl: '/',
        baseUrl: '',
        minErrorCode: 400,
        json: true,
        withCredentials: true
    });

    const history = useRouterHistory(createHistory)({
        basename: fluxController.appProperties && fluxController.appProperties.get('baseUrl') || '/'
    });

    const createFluxComponent = (Component, props) => <Component {...props} fluxController={fluxController}/>;
    render((<Router history={history} createElement={createFluxComponent}>{routes}</Router>), document.getElementById('__page_root__'));
}