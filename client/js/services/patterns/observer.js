import angular from 'angular';
import { service } from 'ng-annotations';

@service('FactoryObserver')
export default class {
  constructor() {
    this.Observers = [];
  }
  /**
   * Register an observer (callback function)
   */
  subscribe(observer) {
    this.Observers.push(observer);
  }
  /**
   * Quit an observer (callback function)
   */
  unsubscribe(observer) {
    this.Observers = this.Observers.filter((obs) => obs !== observer);
  }
  /**
   * Reset the observers to make a clean exit
   */
  unsubscribeAll() {
    this.Observers = [];
  }
  /**
   * Listener. Call when something changes..
   * Ex: CRUD operations
   */
  notify() {
    angular.forEach(this.Observers, (observer) =>
      // const exec = observer();
      observer
    );
  }
}
