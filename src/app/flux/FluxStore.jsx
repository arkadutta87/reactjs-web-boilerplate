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

        const selector = '#' + _key;

        if (typeof window !== 'undefined' && $(selector).length && !(_.isEmpty($(selector).html()))) {
            const obj = JSON.parse($(selector).html());

            // TODO: we delete the DOM cache node...
            //$(selector).remove();
            this.updateData(Immutable.fromJS(obj.data), true);
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

    emitUpdate() {
        this.emit('update');
    }

    addUpdateListener(listener) {
        this.addListener('update', listener);
    }

    removeUpdateListener(listener) {
        this.removeListener('update', listener);
    }

    updateData(data, noEmit) {
        this.data = data;

        if (!noEmit) {
            this.emitUpdate();
        }

        return this;
    }

    _render() {
        const toSerialize = {
            data: this.data
        };

        return (<script type="application/json" id={this.id} dangerouslySetInnerHTML={{__html: JSON.stringify(toSerialize)}}></script>);
    }
}