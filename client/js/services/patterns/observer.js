import { service } from 'ng-annotations';

@service('FactoryObserver')
export default class {
  constructor() {
    this.Observers = [];
  }
  /**
   * Register an observer (callback function)
   */
  Subscribe(observer) {
    this.Observers.push(observer);
  }
  /**
   * Quit an observer (callback function)
   */
  Unsubscribe(observer) {
    this.Observers = this.Observers.filter((obs) => obs !== observer);
  }
  /**
   * Reset the observers to make a clean exit
   */
  UnsubscribeAll() {
    this.Observers = [];
  }
  /**
   * Listener. Call when something changes..
   * Ex: CRUD operations
   */
  Notify() {
    angular.forEach(this.Observers, (observer) =>
      // const exec = observer();
      observer
    );
  }
}
