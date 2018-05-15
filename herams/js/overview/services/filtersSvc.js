'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:filtersSvc
 * @description
 *   This service provides a set of methods to handle filters
 */
angular.module('app-herams').factory('filtersSvc', function($log,commonSvc) {

        var appFilters;

        var dflt_notset_display = "not set",
            dflt_multi_display = "multi";


        /* ---------------------- FILTERS SELECTION ---------------------- */

        var filters_selection = {};

        function initSelection(data) {
            filters_selection["location"] = [];
            filters_selection["dates"] = [];
            filters_selection["hftypes"] = [];
        }

        function addFilter(item_label,type) {

            switch(type) {
                case "location":
                    addLocation(item_label);
                    break;
                case "hf":
                    addHF(item_label);
                    break;
                default:
                    break;
            }
        }

        function rmvFilter(item_label,type) {

            switch(type) {
                case "location":
                    rmvLocation(item_label);
                    break;
                case "hf":
                    rmvHF(item_label);
                    break;
                default:
                    break;
            }
        }

        function getItemStatus(item_label,type) {

            switch(type) {
                case "location":
                    return getLocationStatus(item_label);
                    break;
                case "hf":
                    return getHFStatus(item_label);
                    break;
                default:
                    break;
            }
        }

        function getFilterGlobalValue(type) {

            switch(type) {
                case "location":
                    return getLocationGlobalValue();
                    // return type + " - nc"
                    break;
                case "hf":
                    return getHFGlobalValue();
                    break;
                default:
                    break;
            }

            return type + " - nc";
        }

        /* ---------------------- LOCATION filters methods ---------------------- */

        var location_fltrs,
            states_geolevel = '2' ;

        function getStatesList() {
            var states = _.filter(location_fltrs, { 'geo_level': states_geolevel });
            return _.map(states, 'geo_name');
        }

        function addLocation(geo_name) {
            var data = _.filter(location_fltrs, { 'geo_name': geo_name });
            filters_selection["location"].push(data[0].geo_id);

            /* select all child locations */
            var children = _.filter(location_fltrs, { 'parent_id': data[0].geo_id });
            filters_selection["location"] = filters_selection["location"].concat( _.map(children, 'geo_id'));

        }

        function rmvLocation(geo_name) {
            var data = _.filter(location_fltrs, { 'geo_name': geo_name });
            _.pull(filters_selection["location"],data[0].geo_id);

            /* remove all child locations */
            var children = _.filter(location_fltrs, { 'parent_id': data[0].geo_id });
            _.pullAll(filters_selection["location"], _.map(children, 'geo_id'));

            _.pull(filters_selection["location"],data[0].parent_id);
        }

        function getSubLocations(geo_name) {
            var data = _.filter(location_fltrs, { 'geo_name': geo_name });
            var geoID = data[0].geo_id;

            var sublocs = _.filter(location_fltrs, { 'parent_id': geoID });
            return _.map(sublocs, 'geo_name');
        }

        function setStatusCode(rsltArr, compareArr) {
            var rtrn;

           if (rsltArr.length == 0) {
               rtrn = 0;
           } else if (rsltArr.length == compareArr.length) {
               rtrn = 1;
           } else {
               rtrn = 2;
           }

           return rtrn;
        }

        function getLocationStatus(geo_name) {
            var data = _.find(location_fltrs, { 'geo_name': geo_name });
            var geoID = data.geo_id;
            var children = _.filter(location_fltrs, { 'parent_id': geoID });

            if (children.length > 0) {

                var rslt = _.intersectionWith(_.map(children,'geo_id'), filters_selection["location"], _.isEqual);
                return setStatusCode(rslt, children);

            } else {
                return (filters_selection["location"].indexOf(geoID) != -1);
            }

        }

        function getLevelLocationStatus(level) {
            var data = _.filter(location_fltrs, { 'geo_level': level });
            var dataIDs = _.map(data,'geo_id');

            var rslt = _.intersectionWith(_.map(data,'geo_id'),filters_selection["location"], _.isEqual);

            return setStatusCode(rslt, data);
        }

        function checkLocationLevel(level) {
            var status = getLevelLocationStatus(level);
            var children = _.filter(location_fltrs, { 'geo_level': level });

            if ((status == 1) || (status == 2)) {

                /* REMOVE all related selection */
                _.forEach(children, function(item) {
                    rmvLocation(item.geo_name);
                });
                _.pullAll(filters_selection["location"], _.map(children, 'geo_id'));

            } else {

                /* ADD all related selection */
                _.forEach(children, function(item) {
                    addLocation(item.geo_name);
                });
                filters_selection["location"] = filters_selection["location"].concat( _.map(children, 'geo_id'));


                /* handling parent id in selection */
                filters_selection["location"].push(children[0].parent_id);

            }
        }

        function getLocationGlobalValue() {
            if (filters_selection["location"]) {

                 if (filters_selection["location"].length<1) {
                    return dflt_notset_display;

                }  else if (filters_selection["location"].length>1) {

                     $log.info('getLevelLocationStatus(\'1\') = ',getLevelLocationStatus('1'));
                     $log.info('getLevelLocationStatus(\'2\') = ',getLevelLocationStatus('2'));

                     if (getLevelLocationStatus('1') == 1) {
                         return "Nigeria";
                     } else if (getLevelLocationStatus('2') == 1) {
                         return "Borno";
                     } else {
                        return dflt_multi_display;
                     }
                } else {
                    return _.find(location_fltrs, { 'geo_id': filters_selection["location"][0] }).geo_name;
                }
            }
        }

        /* ---------------------- HF Filters methods ---------------------- */

        var hftype_fltrs;

        function getHFTypesList() {
            return _.map(hftype_fltrs, 'label');
        }

        function getHFData(hf_name) {
            return _.find(hftype_fltrs, { 'label': hf_name });
        }

        function addHF(hf_name) {
            filters_selection["hftypes"].push(getHFData(hf_name).code);
        }

        function rmvHF(hf_name) {
            _.pull(filters_selection["hftypes"],getHFData(hf_name).code);
        }

        function getHFStatus(hf_name) {
            return (filters_selection["hftypes"].indexOf(getHFData(hf_name).code) != -1);
        }

        function getHFColor(hf_name) {
            return getHFData(hf_name).color;
        }

        function getHFGlobalValue() {
            if (filters_selection["hftypes"]) {

                 if (filters_selection["hftypes"].length<1) {
                    return dflt_notset_display;

                }  else if (filters_selection["hftypes"].length>1) {
                    return dflt_multi_display;

                } else {
                    return _.find(hftype_fltrs, { 'code': filters_selection["hftypes"][0] }).label;
                }
            }
        }

        /* ---------------------- Advanced Filters methods ---------------------- */
        var advanced_filters;

        function updtAdvancedFilters(data) {
            advanced_filters = data;
        }

        function getAdvancedFiltersCnt() {
            var cnt = 0;

            _.forEach(advanced_filters, function(value,key) {
                cnt += value.length;
            });

            return cnt;
        }


    return {

        setFiltersData  : function(data) {
            appFilters = data;

            location_fltrs = data.locations;
            hftype_fltrs = data.hf_types;

            initSelection(data);
        },

        addFilter       : addFilter,
        rmvFilter       : rmvFilter,
        getItemStatus   : getItemStatus,
        getFilterGlobalValue: getFilterGlobalValue,

        getStatesList   : getStatesList,
        getSubLocations : getSubLocations,
        getLevelLocationStatus: getLevelLocationStatus,
        getLocationLevel: function(geo_name) {
            var locationData = _.filter(location_fltrs, { 'geo_name': geo_name });
            return locationData[0].geo_level;
        },
        checkLocationLevel: checkLocationLevel,

        getHFTypesList  : getHFTypesList,
        getHFColor      : getHFColor,

        updtAdvancedFilters: updtAdvancedFilters,
        getAdvancedFiltersCnt: getAdvancedFiltersCnt
    }
});
