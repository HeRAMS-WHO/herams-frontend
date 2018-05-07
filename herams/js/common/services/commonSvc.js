'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:commonSvc
 * @description
 *   This service provides a set of common handful methods
 */
angular.module('app-herams').factory('commonSvc', function($state,$http,$compile,$window,$log) {

    var ws_paths = {
        home: ENV_VARS.host+'home',
        overview_dev: ENV_VARS.host+'categories',
        overview: 'config/test_nav.json'
    }

    return {

        /* - ARRAYS DEEP COPY (charts config) -*/
        deepCopy: function(obj) {
            return $.extend(true, {}, obj);
        },

        /* - GET REQUESTS -*/
        loadData: function(url,params) {
            var dfltParams = {
                    'token': tokenConfig
                };

            if (params) dfltParams = $.extend(dfltParams,params);

            return $http({
                'method': 'GET',
                'url': url,
                'params': dfltParams,
                'headers': {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
        },

        /* NAVIGATION / ROUTING -*/

        isLocal: function() {
            return (window.location.hostname == 'localhost');
        },

        getWSPaths: function(page) {
            return ws_paths[page];
        },

        home: function() {
            $window.location = "/";
        },

        gotoProject: function(projectID) {
            $window.location = (this.isLocal)? "overview.html" : "/projects/"+projectID;
        },

        showUsrProfile: function() {
            $window.location = "/user/settings/profile";
        },

        logout: function() {
            // $log.info('show user profile');
            $window.location = "/site/logout";
        },

        /* LOGIN / USR POPOVER -*/
        setLoginPopover: function(scope) {

            scope.logout = this.logout;
            scope.viewProfile = this.showUsrProfile;

            $('#log').popover({
                container: $('.popover-base'),
                placement: 'bottom',
                boundary: 'window',
                content: '<span class="popover-spacer">this is a test</span>',
                html: true
            });

            $('#log').on('shown.bs.popover', function () {

                var template = "<userpopover></userpopover>";
                var linkFn = $compile(template);
                var content = linkFn(scope);

                $('.popover-body').html(content);
            })

        },

        setUsrInfo: function(scope,obj) {

            var usrData = (obj)? obj : {email:"hardtest@novel-t.ch",first_name:"Sam",last_name:"Petragallo"};

            scope.usr_name = usrData.first_name + ' ' + usrData.last_name;
            scope.usr_email = usrData.email;
        },

        /* Cross Browser window's size */
        getWindowWdth: function() {
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0];

            return  w.innerWidth || e.clientWidth || g.clientWidth;
            // * if height needed : * y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        }
    }
});
