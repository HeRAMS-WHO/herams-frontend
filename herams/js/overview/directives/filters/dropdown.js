'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:dropdown
 * @restrict E
 * @scope
 *   @param {dt} date
 * @description
 *   Lorem ipsum
 * @example
 *   <dropdown  />
 */
angular.module('app-herams').directive('dropdown', function($log) {

    return {
        templateUrl: '/js/overview/directives/filters/dropdown.html',
        restrict: 'E',
        replace: true,
        scope:{
            src: "@icon",
            value: "@value",
            items: "="
        },
        controller: function($scope){
            // $scope.items = ["val 1","val 2","val 3","val 4","val 5","val 6"];

            $log.info('$scope.items: ',$scope.items);

            $scope.select = function(val) {
               $scope.value = val;
            }
        }
    }

});
