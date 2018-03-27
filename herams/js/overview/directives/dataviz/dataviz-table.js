'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:datavizTable
 * @restrict E
 * @scope
 *   @param {type} description
 * @description
 *
 * @example
 *   <dataviz-table />
 */
angular.module('app-herams').directive('datavizTable', function() {

    return {
        templateUrl: '/js/overview/directives/dataviz/dataviz-table.html',
        restrict: 'E',
        replace: true,
        scope: {}
     }

});

