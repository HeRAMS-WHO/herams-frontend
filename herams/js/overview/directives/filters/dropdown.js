'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:dropdown
 * @restrict E
 * @scope
 *   @param
 * @description
 *   Lorem ipsum
 * @example
 *   <dropdown  />
 */
angular.module('app-herams').directive('dropdown', function($log) {

    var lastOpened;

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
            $scope.select = function(val) {
               $scope.value = val;
            }
        },
        link: function($scope,elt,attr) {
            var e = elt.find('.filter-value'),
                container_cls = elt.parent().attr("class");

            var filters_popover = $('.filters-popover.'+container_cls);

            var display_type = (filters_popover.children().length>1)? "flex" : "block";

            e.on('click', function () {

                (filters_popover.css("display") == "none")? filters_popover.css("display",display_type):filters_popover.css("display","none");

                if (lastOpened) {
                    $(lastOpened).css("display","none");
                    lastOpened = null;
                }
                if (filters_popover.css("display") == display_type) lastOpened = filters_popover;

            })
        }
    }

});
