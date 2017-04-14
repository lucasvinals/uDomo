const Common = angular.module('uDomo.Common');

Common.factory(
  'CommonFactory',
  [
    () => {
      class Log {
        constructor() {
          this.console = console;
        }
        'error'(message) {
          this.console.log(`%c${ message }`, 'color:red;font-weight:bold;');
        }
        success(message) {
          this.console.log(`%c${ message }`, 'color:green;font-weight:bold;');
        }
        warning(message) {
          this.console.log(`%c${ message }`, 'color:orange;font-weight:bold;');
        }
        info(message) {
          this.console.log(`%c${ message }`, 'color:blue;font-weight:bold;');
        }
      }

      window.log = new Log();

    // $rootScope.currentDevices = [];

    /**
     * Helper function to combine 2 arrays and then return one with no duplicates
     */
    // var objUnion = (array1, array2, matcher) => {
    //     return _.uniq(array1.concat(array2), false, matcher);
    // };

    /**
     * Returns the time since the given date.
     */
      function getTimeSince(last) {
        /**
         * Sooo dumb, I know, but eslint complains with 'magic-numbers' error.
         */
        const msInS = 1000;
        const secInMin = 60;
        const minInH = 60;
        const hInDay = 24;
        const total = Date.now() - last;
        const seconds = Math.floor((total / msInS) % secInMin);
        const minutes = Math.floor((total / msInS / secInMin) % minInH);
        const hours = Math.floor((total / (msInS * secInMin * minInH)) % hInDay);
        const days = Math.floor(total / (msInS * secInMin * minInH * hInDay));

        return { total, days, hours, minutes, seconds };
      }
      /**
       * Create a new string GUID-like
       */
      function createGUID() {
        function fourChars() {
          const HEX = 16;
          const MAXNUM = 0x10000;
          return Math.floor((1 + Math.random()) * MAXNUM)
                      .toString(HEX)
                      .substring(1);
        }
        return [
          fourChars(),
          fourChars(),
          '-',
          fourChars(),
          '-',
          fourChars(),
          '-',
          fourChars(),
          '-',
          fourChars(),
          fourChars(),
          fourChars(),
        ].join('');
      }

      return {
        newID: () => createGUID(),
        // checkLogged: () => checkLoggedUser(),
        since: (val) => getTimeSince(val),
        // concatenate: (args) => objUnion(args[0], args[1], args[2]),
        // activeDevices: (ind) => $rootScope.currentDevices[ind],
      };
    },
  ]
);
