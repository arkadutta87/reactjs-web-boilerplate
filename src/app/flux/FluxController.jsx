import _ from 'lodash';
import Events from 'events';
import React from 'react';
import Immutable from 'immutable';

import { renderToString } from 'react-dom/server';

export default class FluxController {
    constructor(appProperties) {
        this.appProperties = !!appProperties ? Immutable.fromJS(appProperties) : Immutable.Map();
        this.fluxContext = {};
        this.stores = {};
        this.eventEmitter = new Events.EventEmitter();
    }

    getStore(key) {
        return this.stores[key];
    }

    removeStore(key) {
        delete this.stores[key];
    }

    createStore(StoreClass, key) {
        let store = this.stores[key];
        if (!store) {
            store = this.stores[key] = new StoreClass(key, this.fluxContext, this);
        }

        return store;
    }

    renderToString() {
        const markup = (<div id="__flux_stores__">
            {_.map(this.stores, (store) => store._render())}
        </div>);

        return renderToString(markup);
    }
}
