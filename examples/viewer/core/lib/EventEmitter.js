// https://github.com/lucasmajerowicz/threejs-real-time-example/blob/master/app/js/Observable.js

export class EventEmitter {
    constructor() {
        this.observers = new Map();
    }

    on(label, callback) {
        this.observers.has(label) || this.observers.set(label, []);
        this.observers.get(label).push(callback);
    }

    unsubscribe(label) {
        this.observers.delete(label);
    }

    emit(label, e = {}) {
        const observers = this.observers.get(label);

        if (observers && observers.length) {
            observers.forEach((callback) => {
                callback(e);
            });
        }
    }

}