'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:userpopover
 * @restrict E
 * @scope
 *   @param {type} description
 * @description
 *   Lorem ipsum
 * @example
 *   <userpopover />
 */
angular.module('app-herams').directive('userpopover', function(commonSvc) {

    return {
        templateUrl: '/js/common/directives/user_popover.html',
        restrict: 'E',
        replace: true,
        scope: false
    }

});

