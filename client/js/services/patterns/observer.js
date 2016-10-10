/******************************* Design Pattern: Observer.  *************************/
angular.module('Patterns', []).factory('Observer', () => {
	
    class ObserverPattern{

        /* Init the pattern */
        constructor(){
            this.Observers = [];
        }

        /* Register an observer (callback function) */
        subscribe(observer){
            //if(!this.Observers.filter((obs) => obs === observer).length){
                this.Observers.push(observer); 
            //}
        }

        /* Quit an observer (callback function) */
        unsubscribe(observer){
            this.Observers = this.Observers.filter((o) => o != observer);
        }

        /* Reset the observers to make a clean exit */
        unsubscribeAll(){
            this.Observers = [];
        }

        /* Listener. Call when something changes.. Ex: CRUD operations */
        notify(){
            angular.forEach(this.Observers, (observer) => {
              observer();
            });
        }
    }

    /* Return an instance of the pattern */
    return new ObserverPattern();
});
/***********************************************************************************/