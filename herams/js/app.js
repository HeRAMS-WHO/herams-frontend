'use strict';

/**
 * @ngdoc overview
 * @name heramsApp
 * @description
 *
 * Main module of the application. Bootstraps the application
 */
window.appVersion = 'v1.0';


/* --- temporary --- */
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

/*

angular.module('phc_dashboard').run(
    //**
     * When application bootstraps, checks if the user is authenticated, if not redirects to the login page
     *-/
    function($rootScope, $timeout, $state, $http, AuthenticationService) {
        $rootScope.LEVELS_CONFIG = {};

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            if (toState.name !== "login") {
                if (AuthenticationService.isAuthenticated()) {
                    $rootScope.user = AuthenticationService.userInfo;
                    if (toParams.lvl && typeof toParams[toParams.lvl] === 'undefined') {
                        toParams.lvl = 'Admin0';
                        toParams[toParams.lvl] = $rootScope.user.admin0_id;
                        $state.go(toState, toParams);
                    }
                    if (toParams.lvl === 'Admin0' && $rootScope.user.idStatesAuthorized.length === 1) {
                        toParams.lvl = fromParams.lvl || 'Admin1';
                        toParams[toParams.lvl] = $rootScope.user.idStatesAuthorized[0];
                        $state.go(toState, toParams);
                    }
                } else {
                    AuthenticationService.keepStateForRedirection(toState.name, toParams);
                    $timeout(function() {
                        $state.go('login');
                    });
                }
            }
        });

        $rootScope.disconnect = function() {
            AuthenticationService.logout();
            $state.go('login');
        };
    }
);
*/

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


angular.module('app-herams').run(
     // function($rootScope, $timeout, $state, $http, AuthenticationService) {
    function($rootScope, $timeout, $state) {
        $state.go('home');
    }
 );

