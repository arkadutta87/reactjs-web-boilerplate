import _ from 'lodash';

import React from 'react';

export default {

    contextTypes: {
        fluxController: React.PropTypes.object.isRequired
    },

    showLoading() {
        this.emit('data.loading.start');
    },

    hideLoading() {
        this.emit('data.loading.end');
    },

    showModal(name, data) {
        this.emit(`show.modal.${name}`, data);
    },

    hideModal(name, data) {
        this.emit(`hide.modal.${name}`, data);
    },

    toast(text, duration) {
        this.emit('toast', {text, duration: duration || 400});
    },

    emit(event, data) {
        this.getEventEmitter().emit(event, data);
    },

    addListener(event, listener) {
        if (!this.eventListeners) {
            this.eventListeners = {};
        }

        this.eventListeners[event] = listener;
        this.getEventEmitter().addListener(event, listener);
    },

    removeListener(event, listener) {
        this.getEventEmitter().removeListener(event, listener);
        delete this.eventListeners[event];
    },

    getEventEmitter() {
        return this.getFluxController().eventEmitter;
    },

    getFluxController() {
        return this.props.fluxController || this.context.fluxController;
    },

    getFluxContext() {
        return this.getFluxController().fluxContext;
    },

    getAppProperties() {
        return this.getFluxController().appProperties;
    },

    registerStore(key, config) {
        if (!this.stores) {
            this.stores = {};
        }

        this.stores[key] = config || {};
    },

    registerStores(storeConfigs) {
        _.map(storeConfigs, (config, key) => this.registerStore(key, config));
    },

    getStoresDataAsState() {
        const state = {};
        _.forEach(this.stores, (config, key) => {
            state[config.dataKey || 'data'] = this.getStoreData(key);
        });

        return state;
    },

    storeUpdateHandlerWrapper(key, config) {
        return () => {
            if (!this.getStore(key)) {
                return;
            }

            const data = this.getStoreData(key);

            if (config.updateHandler) {
                // call update handler if defined
                config.updateHandler(data);
            } else {
                this.setState({[config.dataKey || 'data']: data});
            }
        };
    },

    componentWillMount() {
        //console.log('Mounting component: ', this);
        _.map(this.stores, (config, key) => {
            const handler = config._storeUpdateHandlerWrapper = this.storeUpdateHandlerWrapper(key, config);
            this.getStore(key).addUpdateListener(handler);
        });
    },

    componentWillUnmount() {
        _.map(this.stores, (storeConfig, storeKey) => {
            const handler = storeConfig._storeUpdateHandlerWrapper;
            this.getStore(storeKey).removeUpdateListener(handler);

            // TODO: probably set some variable that tells store can be removed on unmount...
            // remove the  stores here... TODO: test...
            //this.getFluxController().removeStore(storeKey);
        });

        // remove the registered event listeners here
        _.map(this.eventListeners, (listener, event) => this.removeListener(event, listener));
    },

    componentWillReceiveProps(nextProps, oldProps) {
        if (!_.isEqual(nextProps, oldProps)) {
            this.setState(this.getStoresDataAsState());
        }
    },

    shouldComponentUpdate(nextProps, nextState) {
        return _.some(this.props, (value, key) => value !== nextProps[key])
          || _.some(nextProps, (value, key) => value !== this.props[key])
          || _.some(this.state, (value, key) => value !== nextState[key])
          || _.some(nextState, (value, key) => !this.state && !_.isUndefined(value) || value !== this.state[key]);
    },

    getStore(key) {
        return this.getFluxController().getStore(key);
    },

    createStore(definition, key) {
        return this.getFluxController().createStore(definition, key);
    },

    removeStore(key) {
        return this.getFluxController().removeStore(key);
    },

    getStoreData(key) {
        const store = this.getStore(key);
        return !!store ? store.data : null;
    }
};
