function uDomoConfig($httpProvider, $compileProvider) {
  if (PRODUCTION) {
    $compileProvider.debugInfoEnabled(false);
    $httpProvider.useApplyAsync(true);
  }
}

export default angular.module('uDomoApp').config([ '$httpProvider', '$compileProvider', uDomoConfig ]);
