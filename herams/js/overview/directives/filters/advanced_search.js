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

    var advanced_filters_applies = {};

    function trimHTML(str) {
        var regex = /(<([^>]+)>)/ig;
        return str.replace(regex, "");
    }

 /*   function setQuestionSet(groupData) {
        var rslt = [];

        _.forEach(groupData.questions, function(val, key) {

            // if ((val.dimensions == 0) && (val.answers != null)) $log.info(val.dimensions, ' - ', val.answers, ' - ', val.questions);
            // if ((val.dimensions == 1)) $log.info('-- ',val.dimensions, ' -- ', val.text, ' - ', val.answers, ' - ', val.questions);

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

                var yesnoQ = (_.filter(val.answers,{'code':"Y"}).length > 0);

                if (!yesnoQ) {
                    _.forEach(val.questions[0], function(qval, qkey) {
                        if (qval.answers != null) {
                            var o = {
                                code: tmp_code + "[" + qval.title + "]",
                                text: tmp_text + ' - ' + qval.text,
                                answers: qval.answers
                            }
                            rslt.push(o);
                        }
                    });
                } else {
                    // $log.info('yesnoQ - ', val.questions);
                    var tmp_answers = [];
                    var o = {
                        code: tmp_code,
                        text: tmp_text
                    }

                    _.forEach(val.questions[0], function(qval, qkey) {
                        var oo = {
                            code: qval.title,
                            text: qval.text
                        }
                        tmp_answers.push(oo);
                    });

                    o.answers = tmp_answers;
                    rslt.push(o);
                }
            }
        });


        return rslt;
    }
*/
    return {
        templateUrl: '/js/overview/directives/filters/advanced_search.html',
        restrict: 'E',
        replace: true,
        scope:{
            data: "="
        },
        controller: function($scope){

            /* ---------------------- Setting up / clearing data ---------------------- */

            $scope.data = filtersSvc.shared;

            var questionsCls = {},
                grpCnt = 0, qCnt = 0;

            function setQClass(grp_txt){
                qCnt=0;
                questionsCls[grp_txt] = {};
                _.forEach(filtersSvc.shared.advanced_filters_src[grp_txt], function(question) {
                  questionsCls[grp_txt][question.code] = grpCnt + "-" + qCnt;
                  qCnt++;
                });
                grpCnt++;
            }

            function getQClass(grp_title,qcode) {
                return questionsCls[grp_title][qcode];
            }
            $scope.getQClass = getQClass;


            function getQuestions(grp_txt) {
                if (!questionsCls[grp_txt]) setQClass(grp_txt);
                return filtersSvc.shared.advanced_filters_src[grp_txt];
            }
            $scope.getQuestions = getQuestions;

            $scope.$on('setFiltersCleared', function (event) {
                 advanced_filters_applies = {};
                 if (filtersSvc.getAdvancedFiltersCnt()>0) {
                     filtersSvc.clearAdvancedFilters();
                 }
             });

            var maxLength = 150;

            $scope.trimQuestiontxt = function(qTxt) {
                var trimmed = trimHTML(qTxt);
                return (trimmed.length <= maxLength)? trimmed : trimmed.substr(0, maxLength) + "[...]";
            }


            /* ---------------------- Filter filters ---------------------- */

/*
            $scope.filtrsSrch = "";

            $scope.$watch('filtrsSrch',function(newVal) {
                var tmp = _.filter(data_safe_copy, function(o) {
                    var title = o.title.toLowerCase();
                    return title.indexOf(newVal.toLowerCase())!=-1;
                });

                $scope.data = tmp;
            });
*/



            /* ---------------------- Selecting filters ---------------------- */

            function isSelected(qCode, aCode) {
                return (advanced_filters_applies[qCode])? advanced_filters_applies[qCode].indexOf(aCode) != -1 : false;
            }
            $scope.isSelected = isSelected;

            function check (qCode, aCode) {
                if (!advanced_filters_applies[qCode]) advanced_filters_applies[qCode] = [];
                advanced_filters_applies[qCode].push(aCode);
            }
            function uncheck ( qCode, aCode) {
                _.pull(advanced_filters_applies[qCode],aCode);
                if (advanced_filters_applies[qCode].length<1) delete advanced_filters_applies[qCode];
            }
            function checkItem(evt, qCode, aCode) {
                (isSelected(qCode, aCode))? uncheck(qCode, aCode) : check(qCode, aCode);
                filtersSvc.updtAdvancedFilters(advanced_filters_applies);
                evt.stopPropagation();
            }
            $scope.checkItem = checkItem;

            function getGroupCnt(grp_txt) {
                var cnt = 0;

                var questions = $scope.getQuestions(grp_txt);
                _.forEach(_.map(questions,'code'), function(value) {
                    if (advanced_filters_applies[value]) cnt += advanced_filters_applies[value].length;
                });

                return (cnt == 0)? "" : " (" + cnt + ")";
            }
            $scope.getGroupCnt = getGroupCnt;

            function getQStatus(grptitle,qcode) {
                var q = _.find(filtersSvc.shared.advanced_filters_src[grptitle],{'code': qcode});

                if (q.answers) {
                    var nbr_answers = q.answers.length;
                    if (advanced_filters_applies[qcode]) {
                        if (advanced_filters_applies[qcode].length == nbr_answers) {
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

/*
            function selectAllQ(evt,grptitle,qcode,status) {
                var q = _.find(filtersSvc.shared.advanced_filters_src[grptitle],{'code': qcode});

                if (status>0) {
                    delete advanced_filters_applies[qcode];
                } else {
                    advanced_filters_applies[qcode] = _.map(q.answers,'code');
                }

                filtersSvc.updtAdvancedFilters(advanced_filters_applies);

                evt.stopPropagation();

            }
            $scope.selectAllQ=selectAllQ;
*/

            function selectAllQ(evt,grptitle,qcode) {
                var q = _.find(filtersSvc.shared.advanced_filters_src[grptitle],{'code': qcode});

                var status = getQStatus(grptitle,qcode);

                if (status>0) {
                    delete advanced_filters_applies[qcode];
                } else {
                    advanced_filters_applies[qcode] = _.map(q.answers,'code');
                }

                filtersSvc.updtAdvancedFilters(advanced_filters_applies);

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

            $scope.toggleQuestions = function(evt,grpid,grptitle) {
                if (getQuestions(grptitle).length>0) {
                    var elt = $(".group-question-list.filtermode.cls_"+grpid);
                    ($(elt).css("display") == "none")? $(elt).css("display","block") : $(elt).css("display","none");
                    if (!$scope.isExpanded) $scope.isExpanded = true;
                }
            }

            $scope.toggleAnswers = function(evt,grptitle,qcode) {

                var qCls = getQClass(grptitle,qcode);
                var elt = $(".question-answers-list."+qCls);

                $log.info('toggleAnswers / ',qCls, '\n - elt: ',elt, ' - show: ',elt.css("display"));

                ($(elt).css("display") == "none")? $(elt).css("display","block") : $(elt).css("display","none");
            }

            $scope.isGrpOpened = function(grpid) {
                var elt = $(".group-question-list.filtermode.cls_"+grpid);
                return ($(elt).css("display") == "block");
            }

            $scope.isExpanded = false;
            $scope.expandAllGrps = function() {
                var grp_divs = $(".group-question-list.filtermode"),
                    new_status = ($scope.isExpanded==true)? "none" : "block";

                _.forEach(grp_divs, function(grp_div) {
                    $(grp_div).css("display",new_status);
                })

                if (new_status == "block") expandQuestions();

                $scope.isExpanded = !$scope.isExpanded;
            }

            function expandQuestions() {
                var qDivs = $(".question-answers-list");
                _.forEach(qDivs, function(q_div) {
                    $(q_div).css("display","block");
                })
            }

            $scope.isQExpanded = function(qcode) {
                var elt = $(".question-answers-list."+qcode);
                return ($(elt).css("display") == "block");
            }


            /* ---------------------- UI / checkboxes ---------------------- */

            function setQChckBx(grp_title,qcode) {
                var status = getQStatus(grp_title,qcode),
                    rslt;

                switch(status) {
                    case 0:
                        rslt = "img/filters/select_off.png";
                        break;
                    case 1:
                        rslt = "img/filters/select_all.png";
                        break;
                    case 2:
                        rslt = "img/filters/select_partial.png";
                        break;
               }

               return rslt;
            }
            $scope.setQChckBx = setQChckBx;

            function setAChckBx (qcode,acode) {
                return (!isSelected(qcode,acode))? "img/filters/select_off.png" : "img/filters/select_all.png";
            }
            $scope.setAChckBx = setAChckBx;

         }

    }

});
