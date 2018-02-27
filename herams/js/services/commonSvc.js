'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:commonSvc
 * @description
 *   This service provides a set of common handful methods
 */
angular.module('app-herams').service('commonSvc', function($log) {

    return {

        /**
        * @name commonSvc.deepCopy(OBJ)
        * @description
        *   returns a deep copy of an object
        */
        deepCopy: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }
});
