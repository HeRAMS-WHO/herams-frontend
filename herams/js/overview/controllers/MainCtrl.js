"use strict";


/**
 * @ngdoc controller
 * @name phc_dashboard.controller:BaseCtrl
 * @description
 *   This controller is used on all the pages except the HF card which doesn't inherit from base
 */
angular.module('app-herams')
    .controller('MainCtrl', function($scope,$compile,$log,commonSvc,HFMapSvc,chartsSvc) {

        /* - SCOPE VARS - */
        $scope.categories = [];
        $scope.catIDSelect = null;
        $scope.catNameSelect = null;
        $scope.mapdata = {};
        $scope.catdata = {};

        $scope.tableData = [];

        /* - SCOPE METHODS - */
        $scope.date = new Date();

        /* ui-router */
        $scope.home = function() {
            commonSvc.home();
        };

        /* Data Load */
        $scope.init = function() {
            init($scope);
        }

        /* layout launch */
        $scope.launchLayout = function(cat) {
            $scope.catIDSelect = cat.id;
            launchLayout($scope,cat);
        }

        /* - MISC SETUP CALLS - */
        setPartnersClick();
        commonSvc.setLoginPopover($scope);


        /* - WINDOW EVENTS - */
        function scrollPartners() {
            $('.partners-list-grp').hide();
            $('.partners-list').removeClass('fullHeight');
        }

        function resizer() {

            for (var i=0;i<$scope.catdata.length;i++) {
                var targ = '#chart'+(i+1);
                $( targ ).empty();
            }

            chartsSvc.destroyCharts();
            chartsSvc.setCHarts($scope.catdata);

            HFMapSvc.refreshLayout();
        }


        /* - LOADs - */

        function init(scope) {
             return commonSvc.loadData('https://herams-dev.westeurope.cloudapp.azure.com/aping/categories').then(loadSuccess)
                        .catch(loadFailure)
                        .then(loadFinally);

            function loadSuccess(httpResponse) {
                scope.categories = httpResponse.data;
                $scope.catIDSelect = scope.categories[0].id;
            }

            function loadFailure(httpResponse) {
                $log.info('There has been an error Overview Data');
            }

            function loadFinally(httpResponse) {
                launchLayout(scope,scope.categories[0]);
             }
        }

        function loadMapData(map_url) {
            return commonSvc.loadData(map_url).then(loadSuccess)
                        .catch(loadFailure)
                        .then(loadFinally);

            function loadSuccess(httpResponse) {
                $log.info('load map info: ',httpResponse.data.results);

                $scope.mapdata = httpResponse.data.results;
                HFMapSvc.createMap('mapid',$scope.mapdata);
            }

            function loadFailure(err) {
                $log.info('Error loading Map Data: ',err);
            }

            function loadFinally() {
                $log.info('Ready to process after map load');

                $(window).off('resize', resizer);
                $(window).resize(resizer);

                resizer();
            }
        }

        function loadCharts(charts_url,callback) {
            return commonSvc.loadData(charts_url).then(loadSuccess)
                        .catch(loadFailure)
                        .then(loadFinally);

            function loadSuccess(httpResponse) {
                $log.info('load charts info: ',httpResponse.data.stats);
                $scope.catdata = (httpResponse.data.stats)? httpResponse.data.stats : httpResponse.data;

                for (var i in $scope.catdata) {
                    if ($scope.catdata[i].type == "table") $scope.tableData.push(processTableData($scope.catdata[i]));
                }
            }

            function loadFailure(err) {
                $log.info('Error loading Charts Data: ',err);
            }

            function loadFinally(httpResponse) {
                callback();
            }
        }


        /* - UI - */
        function setPartnersClick() {

            /* Partners */
            $('.partners-list-btn').click(function() {
                $('.partners-list-grp').show();
                $('.partners-list').addClass('fullHeight');
                $('.partners-list-cache').click(function() {
                    $('.partners-list-grp').hide();
                    $('.partners-list').removeClass('fullHeight');
                });
            });

            $(window).scroll(scrollPartners);

        }

        function getLayout(layoutType) {

            var rawLayout;
            switch(layoutType) {
                case "layout14":
                    rawLayout = "<layout14></layout14>";
                    break;
                case "layout13":
                    rawLayout = "<layout13></layout13>";
                    break;
            }
            return rawLayout

        }

        function launchLayout(scope,cat) {

            // DEBUG
            $log.info('launchLayout : ', cat.name);

            // RESETS
            $scope.mapdata = {};
            $scope.catdata = {};
            $scope.tableData = [];
            $( ".main-content" ).empty();
            chartsSvc.destroyCharts();

            scope.catdata = {};
            scope.catNameSelect = cat.name;

            // LAYOUTS (as directives)
             var rawlayout = getLayout(cat.layout);
             var linkFn = $compile(rawlayout);
             var layout = linkFn(scope);

            $('.main-content').html(layout);


            // LOADS
            var f = function() {
                loadMapData(cat.ws_map_url)
            }
            loadCharts(cat.ws_chart_url,f);

        }


        /* - LAYOUTS DATA - */
        function processTableData(data) {

            var table_data = {},
                table_rows = data.rows;

            // table_data.col_names = Object.getOwnPropertyNames(table_rows[0]);
            table_data.cols = data.columns

            table_data.rows = [];
            for (var i in table_rows) {
                var tmp = [];
                for(var o in table_rows[i]) {
                    tmp.push(table_rows[i][o]);
                }
                table_data.rows.push(tmp);
            }

            return table_data;
        }


    })
    .directive('layout14', function($timeout,$log) {

        return {
            templateUrl: '/js/overview/directives/layouts/layout_1_4.html',
            restrict: 'E',
            replace: true
         }

    })
    .directive('layout13', function($timeout,$log) {

        return {
            templateUrl: '/js/overview/directives/layouts/layout_1_3.html',
            restrict: 'E',
            replace: true
         }

    })
    .directive('datavizTable', function() {

        return {
            templateUrl: '/js/overview/directives/dataviz/dataviz-table.html',
            restrict: 'E',
            replace: true
         }

    });
