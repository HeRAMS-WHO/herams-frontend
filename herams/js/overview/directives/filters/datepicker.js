'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:datepicker
 * @restrict E
 * @scope
 *   @param {dt} date
 * @description
 *   Lorem ipsum
 * @example
 *   <datepicker date="..." />
 */
angular.module('app-herams').directive('datepicker', function($log) {

    return {
        templateUrl: '/js/overview/directives/filters/datepicker.html',
        restrict: 'E',
        replace: true,
        scope:{
            dt:"=date"
        },
        controller: function($scope){

            $scope.showing = false;

            $scope.dateOptions = {
                formatYear: 'yyyy-MM-dd',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(),
                startingDay: 1
            };

            $scope.togglePicker = function() {
                $scope.showing = !$scope.showing;
            }
        }
    }

});
