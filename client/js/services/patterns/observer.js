function ObserverFactory() {
  class ObserverPattern {
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
  /**
   * Return an instance of the pattern
   */
  return new ObserverPattern();
}

export default angular.module('uDomo.Patterns').factory('ObserverFactory', ObserverFactory);
