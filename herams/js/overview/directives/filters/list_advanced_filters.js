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
angular.module('app-herams').directive('advancedFiltersList', function($log,$timeout,filtersSvc) {


    return {
        templateUrl: '/js/overview/directives/filters/list_advanced_filters.html',
        restrict: 'E',
        replace: true,
        scope : true,
        controller: function($scope){

            $scope.data = filtersSvc.shared;

            function getIntersection(grp_txt) {
                var tmp = _.map($scope.data.advanced_filters_src[grp_txt],'code');
                var selectedQ = _.keys($scope.data.advanced_filters_applied);
                var intersect = _.intersectionWith(tmp, selectedQ, _.isEqual);

                return intersect;
            }

            $scope.grpHasSelection = function(grp_txt) {
                var intersect = getIntersection(grp_txt);
                return (intersect.length>0);
            }

            $scope.grpSelectCnt = function(grp_txt) {
                var intersect = getIntersection(grp_txt);

                var cnt = 0;
                for (var qcode in intersect) {
                    cnt += $scope.data.advanced_filters_applied[intersect[qcode]].length;
                };

                return cnt;
            }

            $scope.getQuestions = function(grp_txt) {
                $log.info('List Advanced Filters:\n getQuestions(',grp_txt,') : ',$scope.data.advanced_filters_src[grp_txt]);
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
