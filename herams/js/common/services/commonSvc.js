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
            $window.location = "index.html";
            // $window.location = "/";
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

        setLoginPopover: function(scope) {
            $log.info(' !! setLoginPopover !! - ');

            scope.logout = this.logout;
            scope.viewProfile = this.showUsrProfile;

            $('#log').popover({
                container: $('.popover-base'),
                placement: 'bottom',
                boundary: 'window',
                // appendToBody: true,
                content: function() {
                    var template = "<userpopover></userpopover>";
                    var linkFn = $compile(template);
                    var content = linkFn(scope);

                    return content;
                },
                html: true
            });

        }
    }
});
