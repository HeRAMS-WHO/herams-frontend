'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:commonSvc
 * @description
 *   This service provides a set of common handful methods
 */
angular.module('app-herams').service('commonSvc', function($state,$http,$log) {

    return {

        /**
        * @name commonSvc.deepCopy(OBJ)
        * @description
        *   returns a deep copy of an object
        */
        deepCopy: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },

        loadData: function(url) {
            return $http({
                'method': 'GET',
                'url': url,
                'headers': {
                    // 'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
        },

        home: function() {
            $state.go('home');
        },

        overview: function() {
            $state.go('overview');
        }
    }
});
