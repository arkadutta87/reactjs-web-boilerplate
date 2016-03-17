import _ from 'lodash';
import Events from 'events';
import React from 'react';
import Immutable from 'immutable';

import { renderToString } from 'react-dom/server';

function stringify(obj) {
    return JSON.stringify(obj, (key, value) => {
        if (value instanceof Function || typeof value === 'function') {
            return value.toString();
        }
        if (value instanceof RegExp) {
            return `_PxEgEr_${value}`;
        }

        return value;
    });
}

export default class FluxController {
    constructor(appProperties) {
        if (!appProperties) {
            appProperties = {};
        }

        if (typeof window !== 'undefined' && window.fluxAppProperties) {
            appProperties = window.fluxAppProperties;
        }

        this.appProperties = Immutable.fromJS(appProperties);

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

    createStore(StoreClass, key, ...params) {
        let store = this.stores[key];
        if (!store) {
            store = this.stores[key] = new StoreClass(key, this.fluxContext, this, ...params);
        }

        return store;
    }

    renderToString() {
        const appProperties = stringify(this.appProperties.toJS());
        const storesData = stringify(_.map(this.stores, (store) => store._render()));

        const script = `
            function parse(str, date2obj) {
                var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;

                return JSON.parse(str, function (key, value) {
                  var prefix;

                  if (typeof value != 'string') {
                    return value;
                  }
                  if (value.length < 8) {
                    return value;
                  }

                  prefix = value.substring(0, 8);

                  if (iso8061 && value.match(iso8061)) {
                    return new Date(value);
                  }
                  if (prefix === 'function') {
                    return eval('(' + value + ')');
                  }
                  if (prefix === '_PxEgEr_') {
                    return eval(value.slice(8));
                  }

                  return value;
                });
            }

            window.fluxAppProperties = parse(${JSON.stringify(appProperties)});
            window.fluxStores = parse(${JSON.stringify(storesData)});
        `;

        const markup = (<script type="text/javascript" dangerouslySetInnerHTML={{__html: script}}></script>);

        return renderToString(markup);
    }
}
