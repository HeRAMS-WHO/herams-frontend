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
angular.module('app-herams').directive('dropdown', function($log,filtersSvc) {

    var lastOpened;

    return {
        templateUrl: '/js/overview/directives/filters/dropdown.html',
        restrict: 'E',
        replace: true,
        scope:{
            icon: "@icon",
            value: "@value",
            type: "@type"
        },
        controller: function($scope){
            $scope.getValue = function() {
                return filtersSvc.getFilterGlobalValue($scope.type);
            }
         },
        link: function($scope,elt,attr) {
            var e = elt.find('.filter-value'),
                container_cls = elt.parent().attr("class");

            var filters_popover = $('.filters-popover.'+container_cls);

            var display_type = (filters_popover.children().length>1)? "flex" : "block";

            e.on('click', function (evt) {

                (filters_popover.css("display") == "none")? filters_popover.css("display",display_type):filters_popover.css("display","none");

                if (lastOpened) {
                    $(lastOpened).css("display","none");
                    lastOpened = null;
                }
                if (filters_popover.css("display") == display_type) lastOpened = filters_popover;

                evt.stopPropagation();

                $('ul.uib-datepicker-popup').remove();

            });

            $('body').on('click', function () {
                if (lastOpened) {
                    $(lastOpened).css("display","none");
                    lastOpened = null;
                }
            });

        }
    }

});
