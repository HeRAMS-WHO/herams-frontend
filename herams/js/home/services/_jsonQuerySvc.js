'use strict';

angular.module('app-herams').service('jsonQuerySvc', function($log, $http){


    return {

        /**
         * Sends query to get result for the search page
         * @param csrfToken
         * @param query: the query in JSON format:
         * {
         *      text: '...'
         * }
         * @returns {Promise}
         */
        querySearch: function(csrfToken, query) {

            return $http({
                'method': 'POST',
                'url': '/api_search',
                'data': query,
                'headers': {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
        },


         /**
         * Sends GET query to get data accross the app
         * @param url: the url from which to get the data
         * @param csrfToken
         * @returns {Promise}
         */
        getQueryGen: function(url) {
           return $http({
                'method': 'GET',
                'url': url,
                'headers': {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
        },


        /**
         * Sends query to get result for the search page
         * @param csrfToken
         * @param query: the query in JSON format:
         * {
         *      text: '...'
         * }
         * @returns {Promise}
         */
        queryUserFeedback: function(url, data) {
            var sendD = {
                feedback_correct_parse : data,
            }
            return $http({
                'method': 'POST',
                'url': url,
                'data': sendD,
                'headers': {
                    'X-CSRFToken': localcsrfToken,
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            });
        }

   };
});
