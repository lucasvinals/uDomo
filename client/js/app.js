angular.module('uDomoApp').config(['$httpProvider, $compileProvider', 
	function ($httpProvider, $compileProvider) {
		$compileProvider.debugInfoEnabled(false);
		$httpProvider.useApplyAsync(true);
}]);

angular.module('uDomoApp', [
	'ui.router', 'routes', 'Patterns', 'Filters', 'Main', 'Home', 'Users', 'Readings',
	'Security', 'Areas', 'Scenes', 'Common', 'Devices',
	'NotFound'
	]);


