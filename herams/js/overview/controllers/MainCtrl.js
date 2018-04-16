"use strict";


/**
 * @ngdoc controller
 * @name phc_dashboard.controller:BaseCtrl
 * @description
 *   This controller is used on all the pages except the HF card which doesn't inherit from base
 */
angular.module('app-herams').controller('MainCtrl', function($scope,commonSvc,$log,HFMapSvc) {

    $scope.categories = [];
    $scope.catIDSelect = null;

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

    function loadMapData(map_url) {
        return commonSvc.loadData(map_url).then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {
            $log.info('load map info: ',httpResponse.data.results);
        }
    }

    function loadCharts(charts_url) {
        return commonSvc.loadData(charts_url).then(loadSuccess)
                    .catch(loadFailure)
                    .then(loadFinally);

        function loadSuccess(httpResponse) {
            $log.info('load charts info: ',httpResponse.data.results);
        }
    }

    function launchLayout(cat) {

        // scope.heramdata =
        // layout / ws_chart_url / ws_map_url
        loadMapData(cat.ws_map_url);
        loadCharts(cat.ws_chart_url);

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

            launchLayout(scope.categories[0]);
            $log.info('loaded Overview Data correctly: ',httpResponse.data);
        }

        function loadFailure(httpResponse) {
            $log.info('There has been an error Overview Data');
        }

        function loadFinally(httpResponse) {
            $log.info('Overview - last but not least');
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
