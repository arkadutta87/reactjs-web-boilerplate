import _ from 'lodash';
import Events from 'events';
import Immutable from 'immutable';
import React from 'react';

export default class FluxStore {
    constructor(_key, _fluxContext, _fluxController) {
        this.data = null;
        this.key = _key;
        this.id = _key;
        this.fluxContext = _fluxContext;
        this.fluxController = _fluxController;
        this.eventEmitter = new Events.EventEmitter();

        if (typeof window !== 'undefined' && window.fluxStores && window.fluxStores[_key]) {
            const obj = window.fluxStores[_key];
            this.updateData(Immutable.fromJS(obj), true);
        }

        return this;
    }

    emit(event) {
        this.eventEmitter.emit(event);
    }

    addListener(event, listener) {
        //console.log('Adding listener: ', event, listener);
        this.eventEmitter.addListener(event, listener);
    }

    removeListener(event, listener) {
        //console.log('Removing listener: ', event, listener);
        this.eventEmitter.removeListener(event, listener);
    }

    emitUpdate(event) {
        if (event) {
            this.emit(`UPDATE:${event}`);
        }

        this.emit('update', event);
    }

    addUpdateListener(listener) {
        this.addListener('update', listener);
    }

    removeUpdateListener(listener) {
        this.removeListener('update', listener);
    }

    updateData(data, event, noEmit) {
        this.data = data;

        if (!noEmit) {
            this.emitUpdate(event);
        }

        return this;
    }

    _render() {
        return this.data && this.data.toJS();
    }
}