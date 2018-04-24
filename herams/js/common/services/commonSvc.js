'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:commonSvc
 * @description
 *   This service provides a set of common handful methods
 */
angular.module('app-herams').service('commonSvc', function($state,$http,$compile,$window,$log) {

    return {

        /* - ARRAYS DEEP COPY (charts config) -*/
        deepCopy: function(obj) {
            return $.extend(true, {}, obj);
        },

        /* - GET REQUESTS -*/
        loadData: function(url) {
            return $http({
                'method': 'GET',
                'url': url,
                'headers': {
                    // 'heramsToken': tokenConfig,
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
        },

        /* NAVIGATION / ROUTING -*/
        home: function() {
            // $state.go('home');
            // $window.location = "index.html";
            $window.location = "/";
        },

        gotoProject: function() {
            // $state.go('overview');
            $window.location = "overview.html";
            // $window.location = "/projects/374";
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
