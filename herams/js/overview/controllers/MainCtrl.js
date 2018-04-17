"use strict";


/**
 * @ngdoc controller
 * @name phc_dashboard.controller:BaseCtrl
 * @description
 *   This controller is used on all the pages except the HF card which doesn't inherit from base
 */
angular.module('app-herams').controller('MainCtrl', function($scope,$log,commonSvc,HFMapSvc) {

    $scope.categories = [];
    $scope.catIDSelect = null;
    $scope.mapdata = {};

    /* - CONTROLLER'S METHODS - */
    function setUI() {

        $(window).on('resize pageshow', function () {
            HFMapSvc.refreshLayout();
        });

        /* Partners */
        $('.partners-list-btn').click(function() {
            $('.partners-list-grp').show();
            $('.partners-list').addClass('fullHeight');
            $('.partners-list-cache').click(function() {
                $('.partners-list-grp').hide();
                $('.partners-list').removeClass('fullHeight');
            });
        });

        $(window).scroll(function() {
            $('.partners-list-grp').hide();
            $('.partners-list').removeClass('fullHeight');
        });

    }

    function loadMapData(scope,map_url) {
        return commonSvc.loadData(map_url).then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {
            $log.info('load map info: ',httpResponse.data.results);

            $scope.mapdata = httpResponse.data.results;
            HFMapSvc.createMap('mapid',$scope.mapdata);

            $log.info('load map info: ',$scope.dataforMap);
        }

        function loadFailure(err) {
            $log.info('Error loading Map Data: ',err);
        }

        function loadFinally() {
            $log.info('Ready to process after map load');
        }
    }

    function loadCharts(charts_url) {
        return commonSvc.loadData(charts_url).then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {
            $log.info('load charts info: ',httpResponse.data.results);
        }

        function loadFailure(err) {
            $log.info('Error loading Charts Data: ',err);
        }

        function loadFinally(httpResponse) {
            $log.info('Ready to process after charts load');
        }
    }

    function launchLayout(scope,cat) {

        // scope.heramdata =
        // layout / ws_chart_url / ws_map_url
        loadMapData(scope,cat.ws_map_url);
        // loadCharts(cat.ws_chart_url);

    }


    function init(scope) {
        //https://herams-dev.westeurope.cloudapp.azure.com/aping/categories
        // return commonSvc.loadData('config/overview_data.json').then(loadSuccess)
        return commonSvc.loadData('https://herams-dev.westeurope.cloudapp.azure.com/aping/categories').then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {

            // scope.heramdata = httpResponse.data.results;
            scope.categories = httpResponse.data;
            $scope.catIDSelect = scope.categories[0].id;
            $log.info('loaded Overview Data correctly: ',httpResponse.data);

            // launchLayout(scope.categories[0]);
        }

        function loadFailure(httpResponse) {
            $log.info('There has been an error Overview Data');
        }

        function loadFinally(httpResponse) {
            $log.info('Overview - last but not least');
            launchLayout(scope,scope.categories[0]);
        }
    }


    /* - MISC SETUP CALLS - */
    setUI();


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


});
