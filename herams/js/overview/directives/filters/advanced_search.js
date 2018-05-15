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
angular.module('app-herams').directive('advancedSearch', function($log,filtersSvc) {

    var filters_advanced = {};

    function setQuestionSet(groupData) {
        var rslt = [];

        _.forEach(groupData.questions, function(val, key) {
            if (val.answers!=null) {
                var o = {
                    code: key,
                    text: val.text,
                    answers: val.answers
                }
                rslt.push(o);
            }
        });

        return rslt;
    }

    return {
        templateUrl: '/js/overview/directives/filters/advanced_search.html',
        restrict: 'E',
        replace: true,
        scope:{
            data: "="
        },
        controller: function($scope){

            /* ---------------------- Setting up data ---------------------- */

            var advanced_search_data = [];

            $scope.$watch('data', function(loaded) {
                if (loaded) {
                    _.forEach(loaded, function(value) {
                        advanced_search_data[value.title] = setQuestionSet(value);
                    });
                }
            });

            $scope.getQuestions = function(grp_txt) {
                 return advanced_search_data[grp_txt];
            }


            /* ---------------------- Selecting filters ---------------------- */

            function select (evt, qCode, aCode) {
                if (!filters_advanced[qCode]) filters_advanced[qCode] = [];
                filters_advanced[qCode].push(aCode);

                evt.stopPropagation();
            }
            function unselect (evt, qCode, aCode) {
                _.pull(filters_advanced[qCode],aCode);
                evt.stopPropagation();
            }
            function checkItem(evt, qCode, aCode) {
                (isSelected(qCode, aCode))? unselect(evt, qCode, aCode) : select(evt, qCode, aCode);
                filtersSvc.updtAdvancedFilters(filters_advanced);
            }
            $scope.checkItem = checkItem;

            function isSelected(qCode, aCode) {
                return (filters_advanced[qCode])? filters_advanced[qCode].indexOf(aCode) != -1 : false;
            }
            $scope.isSelected = isSelected;

            function getGroupCnt(grp_txt) {
                var cnt = 0;

                var questions = $scope.getQuestions(grp_txt);
                _.forEach(_.map(questions,'code'), function(value) {
                    if (filters_advanced[value]) cnt += filters_advanced[value].length;
                });

                return (cnt == 0)? "" : "(" + cnt + ")";
            }
            $scope.getGroupCnt = getGroupCnt;


            /* ---------------------- Toggling filters display ---------------------- */

            $scope.setGroupClass = function(grpid) {
                return "cls_"+grpid;
            }

            $scope.toggleQuestions = function(evt,grpid) {
                var elt = $(".group-question-list.cls_"+grpid);
                ($(elt).css("display") == "none")? $(elt).css("display","block") : $(elt).css("display","none");
            }

            $scope.toggleAnswers = function(evt,qcode) {
                var elt = $(".question-answers-list."+qcode);
                ($(elt).css("display") == "none")? $(elt).css("display","block") : $(elt).css("display","none");
            }

            $scope.isGrpOpened = function(grpid) {
                var elt = $(".group-question-list.cls_"+grpid);
                return ($(elt).css("display") == "block");
            }

         }

    }

});
