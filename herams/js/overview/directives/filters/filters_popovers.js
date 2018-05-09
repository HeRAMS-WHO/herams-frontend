'use strict';

/**
 * @ngdoc directive
 * @name app-herams.directive:filters-popover
 * @restrict E
 * @scope
 *   @param
 * @description
 *   Lorem ipsum
 * @example
 *   <dropdown  />
 */
angular.module('app-herams').directive('filtersPopover', function($log) {

    function getNextPopoverScope (openNext) {
        return angular.element($(openNext).find('.popover-hdr')).scope();
    }

    function openPopover(popoverId,params) {

        $(popoverId).css("display","block");

        var scp = getNextPopoverScope(popoverId);
        scp.title = params.title + ' / ' + $(params.itemClicked).attr('data-label');

        $(params.itemClicked).parent().addClass('selected');

    }

    return {
        templateUrl: '/js/overview/directives/filters/filters_popovers.html',
        restrict: 'E',
        replace: true,
        scope:{
            title:"@",
            openNext:"@",
            items: "=",
            grouped:"="
        },
        controller: function ($scope){
        },
        link: function($scope,elt,attr) {

            if ($scope.grouped) {

                var nextPopoverID = $scope.openNext,
                    lastClicked;

                if (!nextPopoverID)  {
                    $(elt).css("display","none");
                } else {
                    var titleNext = $(nextPopoverID).attr("title");
                }

                $scope.clickFilter = function(evt) {

                    if (evt.currentTarget != lastClicked) $(lastClicked).parent().removeClass('selected');

                    if (!nextPopoverID) {
                        $(elt).css("display","none");
                    } else {
                        if (($(nextPopoverID).css("display") == "block") && (evt.currentTarget == lastClicked)) {
                            $(nextPopoverID).css("display","none");
                            $(evt.currentTarget).parent().removeClass('selected');
                            lastClicked = null;
                        } else {
                            lastClicked = evt.currentTarget;
                            openPopover(nextPopoverID, {
                                itemClicked: evt.currentTarget,
                                title: titleNext
                            });
                        }
                    }
                }
            }

            $scope.checkItem = function(evt) {

                if ($(evt.currentTarget).find('.checked').css("display") == "none"){

                    $(evt.currentTarget).find('.checked').css("display","block");
                    $(evt.currentTarget).find('.unchecked').css("display","none");

                } else {

                    $(evt.currentTarget).find('.checked').css("display","none");
                    $(evt.currentTarget).find('.unchecked').css("display","block");

                }

            }
        }
    }

});
