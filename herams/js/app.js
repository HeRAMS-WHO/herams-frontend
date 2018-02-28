'use strict';

/**
 * @ngdoc overview
 * @name heramsApp
 * @description
 *
 * Main module of the application. Bootstraps the application
 */
window.appVersion = 'v1.0';


/* --- if geoserver - hsdf model --- */
var APP_CONFIG = {
  "geoserver": {
    "protocol": "http",
    "host": "phcpm.novel-t.ch",
    "port": "",
    "context": "geoserver",
    "user": "bm92ZWx0Om5vdmVsdA==",
    "defaultStore": "hsdf"
  }
}


angular.module('app-herams', [
    'ui.router',
    // 'angular-md5',
    'ui.bootstrap'
    // 'ui.select'
]);

/*  ---------------------------------------------------
 *  ---------------- From HSDF - start ----------------
 *   ---------------------------------------------------
 */
angular.module('app-herams').filter('unique', function() {
    return function(collection) {
        var result = [];

        angular.forEach(collection, function(item, key) {
            if (collection.indexOf(item) === key) {
                result.push(item);
            }
        });
        return result;
    };
});


angular.module('app-herams').filter('uniqueObjects', function() {
    return function(collection, property) {
        var result = [];
        var keys = [];

        angular.forEach(collection, function(item) {
            var key = item[property];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                result.push(item);
            }
        });
        return result;
    };
});

angular.module('app-herams').config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + APP_CONFIG.geoserver.user;
}]);

/*  ---------------------------------------------------
 *  ---------------- From HSDF - end ----------------
 *   ---------------------------------------------------
 */

angular.module('app-herams').config(['$stateProvider', '$urlRouterProvider',
    /**
     * Configures the routes using ui.router module
     * @param  {Service} $stateProvider
     * @param  {Service} $urlRouterProvider
     */
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            });
    }
]);


angular.module('app-herams')
    .run(function($rootScope, $timeout, $state) {
        $state.go('home');
    });

