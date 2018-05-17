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

            // if ((val.dimensions == 0) && (val.answers != null)) $log.info(val.dimensions, ' - ', val.answers, ' - ', val.questions);

            // if ((val.dimensions == 1)) $log.info('-- ',val.dimensions, ' -- ', val.text, ' - ', val.questions);

            if ((val.dimensions == 0) && (val.answers != null)) {
                var o = {
                    code: val.title,
                    text: val.text,
                    answers: val.answers
                }
                rslt.push(o);
            } else if (val.dimensions == 1) {
                var tmp_code = val.title,
                    tmp_text = val.text;

                _.forEach(val.questions[0], function(qval, qkey) {
                    if (qval.answers != null) {
                        var o = {
                            code: tmp_code + "_" + qval.title,
                            text: tmp_text + ' - ' + qval.text,
                            answers: qval.answers
                        }
                        rslt.push(o);
                    }
                });
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

            /* ---------------------- Setting up / clearing data ---------------------- */

            var advanced_search_data = [];

            $scope.$watch('data', function(loaded) {
                if (loaded) {
                    _.forEach(loaded, function(value) {
                        advanced_search_data[value.title] = setQuestionSet(value);
                    });
                    filtersSvc.setAdvcdFltsData(advanced_search_data, filters_advanced);
                }
            });

            function getQuestions(grp_txt) {
                 return advanced_search_data[grp_txt];
            }
            $scope.getQuestions = getQuestions;

             $scope.$on('setFiltersCleared', function (event) {
                 filters_advanced = {};
                 if (filtersSvc.getAdvancedFiltersCnt()>0) {
                     filtersSvc.clearAdvancedFilters();
                 }
             });

            /* ---------------------- Selecting filters ---------------------- */

            function isSelected(qCode, aCode) {
                return (filters_advanced[qCode])? filters_advanced[qCode].indexOf(aCode) != -1 : false;
            }
            $scope.isSelected = isSelected;

            function check (qCode, aCode) {
                if (!filters_advanced[qCode]) filters_advanced[qCode] = [];
                filters_advanced[qCode].push(aCode);
            }
            function uncheck ( qCode, aCode) {
                _.pull(filters_advanced[qCode],aCode);
                if (filters_advanced[qCode].length<1) delete filters_advanced[qCode];
            }
            function checkItem(evt, qCode, aCode) {
                (isSelected(qCode, aCode))? uncheck(qCode, aCode) : check(qCode, aCode);
                filtersSvc.updtAdvancedFilters(filters_advanced);
                evt.stopPropagation();
            }
            $scope.checkItem = checkItem;

            function getGroupCnt(grp_txt) {
                var cnt = 0;

                var questions = $scope.getQuestions(grp_txt);
                _.forEach(_.map(questions,'code'), function(value) {
                    if (filters_advanced[value]) cnt += filters_advanced[value].length;
                });

                return (cnt == 0)? "" : "(" + cnt + ")";
            }
            $scope.getGroupCnt = getGroupCnt;

            function getQStatus(grptitle,qcode) {
                var q = _.find(advanced_search_data[grptitle],{'code': qcode});

                if (q.answers) {
                    var nbr_answers = q.answers.length;
                    if (filters_advanced[qcode]) {
                        if (filters_advanced[qcode].length == nbr_answers) {
                            return 1;
                        } else {
                            return 2;
                        }
                    } else {
                        return 0;
                    }
                }

            }
            $scope.getQStatus=getQStatus;

            function selectAllQ(evt,grptitle,qcode,status) {
                var q = _.find(advanced_search_data[grptitle],{'code': qcode});

                if (status>0) {
                    delete filters_advanced[qcode];
                } else {
                    filters_advanced[qcode] = _.map(q.answers,'code');
                }

                evt.stopPropagation();

            }
            $scope.selectAllQ=selectAllQ;


            /* ---------------------- Toggling filters display ---------------------- */

            $scope.greyoutCls = function(grptitle) {
                var cls = "";
                if (getQuestions(grptitle).length<1) cls += " greyed-out";
                return cls;
            }

            $scope.setGroupClass = function(grpid) {
                var cls = "cls_"+grpid;
                return cls;
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
