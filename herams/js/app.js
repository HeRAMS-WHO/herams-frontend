'use strict';

/**
 * @ngdoc overview
 * @name heramsApp
 * @description
 *
 * Main module of the application. Bootstraps the application
 */
window.appVersion = 'v1.0';

angular.module('app-herams', [
    'ui.router',
    'ui.bootstrap',
    'ngSanitize'
]).config(['$provide', Decorate]);

/* Changes display of the Days in UI-Bootstrap calendar */
function Decorate($provide) {
  $provide.decorator('$locale', function ($delegate) {
    var value = $delegate.DATETIME_FORMATS;

    value.SHORTDAY = [
        "S",
        "M",
        "T",
        "W",
        "T",
        "F",
        "S"
    ];

    return $delegate;
  });
};
