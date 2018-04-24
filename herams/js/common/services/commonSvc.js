'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:commonSvc
 * @description
 *   This service provides a set of common handful methods
 */
angular.module('app-herams').service('commonSvc', function($state,$http,$compile,$window,$log) {

    return {

        /**
        * @name commonSvc.deepCopy(OBJ)
        * @description
        *   returns a deep copy of an object
        */
        deepCopy: function(obj) {
            // return JSON.parse(JSON.stringify(obj));
            return $.extend(true, {}, obj);
        },

        loadData: function(url) {
            return $http({
                'method': 'GET',
                // 'method': 'JSONP',
                'url': url,
                'headers': {
                    // 'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
        },

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
            $log.info('show user profile');
            $window.location = "/user/settings/profile";
        },

        logout: function() {
            $log.info('show user profile');
            $window.location = "/user/logout";
        },

        getWindowWdth: function() {
            var w = window,
                d = document,
                e = d.documentElement,
                g = d.getElementsByTagName('body')[0];

            return  w.innerWidth || e.clientWidth || g.clientWidth;
            // * if height needed : * y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        },

        setLoginPopover: function(scope) {
            $log.info(' !! setLoginPopover !! - ');

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

        }
    }
});
