'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:filtersSvc
 * @description
 *   This service provides a set of methods to handle filters
 */
angular.module('app-herams').factory('filtersSvc', function($log,commonSvc) {

/*
            var test = _.find($scope.filters.location.values, { 'label': 'Ekiti' });
            $log.info('$scope.filters Ekiti : ', test);

            var test2 = _.map($scope.filters.location.values, 'label');
            $log.info('$scope.filters State labels : ', test2);
*/

        var appFilters,
            location_fltrs;

        var filters_selection = {};

        /* LOCATION filters methods */
        function getStatesList() {
            var states = _.filter(location_fltrs.geo_list, { 'geo_level': 1 });
            return _.map(states, 'geo_name');
        }

        function addLocation(geo_name) {
            var data = _.filter(location_fltrs.geo_list, { 'geo_name': geo_name });
            filters_selection[0].values.push(data[0].geo_id);

            /* select all child locations */
            var children = _.filter(location_fltrs.geo_list, { 'parent_id': data[0].geo_id });
            filters_selection[0].values = filters_selection[0].values.concat( _.map(children, 'geo_id'));
            $log.info('select ',geo_name, ' - children: ',children.length, ' -> ',filters_selection[0].values);


            getLevelLocationStatus(1);
        }

        function rmvLocation(geo_name) {
            var data = _.filter(location_fltrs.geo_list, { 'geo_name': geo_name });
            _.pull(filters_selection[0].values,data[0].geo_id);

            $log.info('remove ',geo_name, ' - ',data[0].geo_id, ' -> ',filters_selection[0]);

            /* remove all child locations */
            var children = _.filter(location_fltrs.geo_list, { 'parent_id': data[0].geo_id });
            _.pullAll(filters_selection[0].values, _.map(children, 'geo_id'));
            $log.info('select ',geo_name, ' - children: ',children.length, ' -> ',filters_selection[0].values);
        }

        function getSubLocations(geo_name) {
            var data = _.filter(location_fltrs.geo_list, { 'geo_name': geo_name });
            var geoID = data[0].geo_id;

            var sublocs = _.filter(location_fltrs.geo_list, { 'parent_id': geoID });
            $log.info('sublocs ',sublocs);
            return _.map(sublocs, 'geo_name');
        }

        function getLocationStatus(geo_name) {
            var data = _.filter(location_fltrs.geo_list, { 'geo_name': geo_name });
            var geoID = data[0].geo_id;

            return (filters_selection[0].values.indexOf(geoID) != -1);
        }

        function getLevelLocationStatus(level) {
            var data = _.filter(location_fltrs.geo_list, { 'geo_level': level });
            var dataIDs = _.map(data,'geo_id');

           var rslt = _.intersectionWith(_.map(data,'geo_id'),filters_selection[0].values, _.isEqual);
           $log.info('getLevelLocationStatus : ',(rslt.length == data.length));

           return (rslt.length == data.length);
        }


        /* FILTERS SELECTION */
        function initSelection(data) {
            var filters = [];

            var location = {
                id: data.location.id,
                values: (data.location.selection!=null) ? data.location.selection : []
            };
            filters.push(location);

            var dates = {
                id: data.date.id,
                values: (data.date.selection!=null) ? data.date.selection : []
            };
            filters.push(dates);

            var hftypes = {
                id: data.hf_types.id,
                values: (data.hf_types.selection!=null) ? data.hf_types.selection : []
            };
            filters.push(hftypes);

            filters_selection = filters;
        }

        function addFilter(item_label,type) {
            if (type == "location") addLocation(item_label);
        }

        function rmvFilter(item_label,type) {
            if (type == "location") rmvLocation(item_label);
        }

        function getItemStatus(item_label,type) {
            if (type == "location") return getLocationStatus(item_label);
        }


    return {

        setFiltersData: function(data) {
            appFilters = data;
            location_fltrs = data.location;
            initSelection(data);
        },

        getFiltersSelection: function() {
            return filters_selection;
        },

        getStatesList: getStatesList,
        addFilter: addFilter,
        rmvFilter: rmvFilter,
        getSubLocations: getSubLocations,

        getItemStatus: getItemStatus,
        getLevelLocationStatus: getLevelLocationStatus
    }
});
