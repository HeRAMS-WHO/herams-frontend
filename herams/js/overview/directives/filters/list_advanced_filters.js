'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:advancedFiltersList
 * @restrict E
 * @scope
 *   @param
 * @description
 *   Lorem ipsum
 * @example
 *   <dropdown  />
 */
angular.module('app-herams').directive('advancedFiltersList', function($log,filtersSvc) {


    return {
        templateUrl: '/js/overview/directives/filters/list_advanced_filters.html',
        restrict: 'E',
        replace: true,
        controller: function($scope){
            $scope.data = filtersSvc.shared;

            $scope.getData = function() {
                return _.keys($scope.data.advanced_filters_src);
            }

            $scope.grpHasSelection = function(grp_txt) {
                var tmp = _.map($scope.data.advanced_filters_src[grp_txt],'code');
                var selectedQ = _.keys($scope.data.advanced_filters_applied);
                var intersect = _.intersectionWith(tmp, selectedQ, _.isEqual);

                return (intersect.length>0);
            }

            $scope.getQuestions = function(grp_txt) {
                return $scope.data.advanced_filters_src[grp_txt];
            }

            $scope.isFilterQ = function(qcode) {
                return ($scope.data.advanced_filters_applied[qcode]!=null);
            }

            $scope.isFilterA = function(qcode,acode) {
                return ($scope.data.advanced_filters_applied[qcode].indexOf(acode)!=-1);
            }
        }

    }

});
