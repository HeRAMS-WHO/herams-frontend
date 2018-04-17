"use strict";


/**
 * @ngdoc controller
 * @name phc_dashboard.controller:BaseCtrl
 * @description
 *   This controller is used on all the pages except the HF card which doesn't inherit from base
 */
angular.module('app-herams').controller('MainCtrl', function($scope,$compile,$log,commonSvc,HFMapSvc) {

    $scope.categories = [];
    $scope.catIDSelect = null;
    $scope.mapdata = {};
    $scope.catdata = {};

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
            $log.info('load charts info: ',httpResponse.data.stats);
            $scope.catdata = httpResponse.data.stats;
        }

        function loadFailure(err) {
            $log.info('Error loading Charts Data: ',err);
        }

        function loadFinally(httpResponse) {
            $log.info('Ready to process after charts load');
        }
    }


    function setLayout(layoutType) {

        var rawLayout;
        switch(layoutType) {
            case "layout14":
                rawLayout = "<layout14 data='catdata' ng-cloak></layout14>";
                break;
            case "layout13":
                rawLayout = "<layout13 data='catdata' ng-cloak></layout13>";
                break;
        }
        return rawLayout

    }

    function launchLayout(scope,cat) {

         var rawlayout = setLayout(cat.layout);
         var linkFn = $compile(rawlayout);
         var layout = linkFn(scope);

        $('.main-content').html(layout);


        // layout / ws_chart_url / ws_map_url
        loadMapData(cat.ws_map_url);
        loadCharts(cat.ws_chart_url);

    }


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
