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

        function initSelection() {
            filters_selection["location"] = [];
            filters_selection["date"] = null;
            filters_selection["hftypes"] = [];
            filters_selection["advanced"]=[];
        }

        function addFilter(item_label,type) {

            switch(type) {
                case "location":
                    addLocation(item_label);
                    break;
                case "hf":
                    addHF(item_label);
                    break;
                case "date":
                    addDate(item_label);
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
                case "date":
                    rmvDate(item_label);
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
                case "date":
                    return getDateStatus(item_label);
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
                case "date":
                    return getDateGlobalValue();
                    break;
                default:
                    break;
            }

            return type + " - nc";
        }

        /* ---------------------- LOCATION filters methods ---------------------- */

        var location_fltrs,
            states_geolevel = '2',
            applied_location_fltrs = [];

        function getStatesList() {
            var states = _.filter(location_fltrs, { 'geo_level': states_geolevel });
            return _.map(states, 'geo_name');
        }

        function addLocation(geo_name) {
            var data = _.filter(location_fltrs, { 'geo_name': geo_name });
            applied_location_fltrs.push(data[0].geo_id);

            /* select all child locations */
            var children = _.filter(location_fltrs, { 'parent_id': data[0].geo_id });
            applied_location_fltrs = applied_location_fltrs.concat( _.map(children, 'geo_id'));
        }

        function rmvLocation(geo_name) {
            var data = _.filter(location_fltrs, { 'geo_name': geo_name });
            _.pull(applied_location_fltrs,data[0].geo_id);

            /* remove all child locations */
            var children = _.filter(location_fltrs, { 'parent_id': data[0].geo_id });
            _.pullAll(applied_location_fltrs, _.map(children, 'geo_id'));

            _.pull(applied_location_fltrs,data[0].parent_id);
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

                var rslt = _.intersectionWith(_.map(children,'geo_id'), applied_location_fltrs, _.isEqual);
                return setStatusCode(rslt, children);

            } else {
                return (applied_location_fltrs.indexOf(geoID) != -1);
            }

        }

        function getLevelLocationStatus(level) {
            var data = _.filter(location_fltrs, { 'geo_level': level });
            var dataIDs = _.map(data,'geo_id');

            var rslt = _.intersectionWith(_.map(data,'geo_id'),applied_location_fltrs, _.isEqual);

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
                _.pullAll(applied_location_fltrs, _.map(children, 'geo_id'));

            } else {

                /* ADD all related selection */
                _.forEach(children, function(item) {
                    addLocation(item.geo_name);
                });
                applied_location_fltrs = applied_location_fltrs.concat( _.map(children, 'geo_id'));


                /* handling parent id in selection */
                applied_location_fltrs.push(children[0].parent_id);

            }
        }

        function getLocationGlobalValue() {
            if (applied_location_fltrs) {

                 if (applied_location_fltrs.length<1) {
                    return dflt_notset_display;

                }  else if (applied_location_fltrs.length>1) {

                     // $log.info('getLevelLocationStatus(\'1\') = ',getLevelLocationStatus('1'));
                     // $log.info('getLevelLocationStatus(\'2\') = ',getLevelLocationStatus('2'));

                     if (getLevelLocationStatus('1') == 1) {
                         return "Nigeria";
                     } else if (getLevelLocationStatus('2') == 1) {
                         return "Borno";
                     } else {
                        return dflt_multi_display;
                     }
                } else {
                    return _.find(location_fltrs, { 'geo_id': applied_location_fltrs[0] }).geo_name;
                }
            }
        }

        /* ---------------------- HF Filters methods ---------------------- */

        var hftype_fltrs,
            applied_hftype_fltrs = [];

        function getHFTypesList() {
            return _.map(hftype_fltrs, 'label');
        }

        function getHFData(hf_name) {
            return _.find(hftype_fltrs, { 'label': hf_name });
        }

        function addHF(hf_name) {
            applied_hftype_fltrs.push(getHFData(hf_name).code);
        }

        function rmvHF(hf_name) {
            _.pull(applied_hftype_fltrs,getHFData(hf_name).code);
        }

        function getHFStatus(hf_name) {
            return (applied_hftype_fltrs.indexOf(getHFData(hf_name).code) != -1);
        }

        function getHFColor(hf_name) {
            return getHFData(hf_name).color;
        }

        function getHFGlobalValue() {
            if (applied_hftype_fltrs) {

                 if (applied_hftype_fltrs.length<1) {
                    return dflt_notset_display;

                }  else if (applied_hftype_fltrs.length>1) {
                    return dflt_multi_display;

                } else {
                    return _.find(hftype_fltrs, { 'code': applied_hftype_fltrs[0] }).label;
                }
            }
        }

        /* ---------------------- Dates Filters methods ---------------------- */

        var dates_fltrs,
            applied_date;

        function getDatesList() {
            return dates_fltrs;
        }

        function getDateGlobalValue() {
            if (dates_fltrs) {
                return (applied_date)? applied_date : dates_fltrs[0];
            }
        }

        function getDateStatus(date) {
            return (applied_date == date);
        }

        function addDate(date) {
            applied_date = date;
            filters_selection["date"] = applied_date;
        }

        function rmvDate() {
            applied_date = null;
            filters_selection["date"] = null;
        }


        /* ---------------------- MAIN FILTERS METHODS ---------------------- */

        function clearFilters () {
            initSelection();
            //
            this.shared.advanced_filters_src = null;
            this.shared.advanced_filters_applied = null;
            //
            applied_location_fltrs = [];
            applied_hftype_fltrs = [];
            //
            reset();
        }

        /* ---------------------- Advanced Filters methods ---------------------- */

        var advanced_filters_src,
            advanced_filters_applied;

        function setAdvcdFltsData(src, applied) {
            this.shared.advanced_filters_src = src;
            this.shared.advanced_filters_applied = applied;
        }

        function updtAdvancedFilters(data) {
            // $log.info('updtAdvancedFilters: ', data,' / advanced_filters_applied: ', advanced_filters_applied);
            $log.info('------------- updtAdvancedFilters -------------');
            advanced_filters_applied = data;
            this.shared.advanced_filters_applied = data;
            $log.info('updtAdvancedFilters: ', this.shared.advanced_filters_applied);
        }

        function getAdvancedFiltersCnt() {
            var cnt = 0;

            _.forEach(advanced_filters_applied, function(value,key) {
                cnt += value.length;
            });

            return cnt;
        }

        function clearAdvancedFilters() {

            // $log.info('this.shared.advanced_filters_applied: ', this.shared.advanced_filters_applied);
            $log.info('------------- clearAdvancedFilters -------------');

            advanced_filters_applied = {};
            this.shared.advanced_filters_applied = {};

            initSelection();

            getAdvancedFiltersCnt();
        }


        /* ---------------------- Advanced Filters methods ---------------------- */

        function reset() {

            /* By default, check all locations of the Workspace */
            for (var i in location_fltrs) {
                addLocation(location_fltrs[i]["geo_name"]);
            }

            /* By default, check all HF types of the Workspace */
            for (var i in hftype_fltrs) {
                addHF(hftype_fltrs[i]["label"]);
            }

            addDate(dates_fltrs[0]);

        }

        function applyHTTPFilters(date) {

            filters_selection["location"] = applied_location_fltrs;
            filters_selection["hftypes"] = applied_hftype_fltrs;
            filters_selection["advanced"] = [];

            _.forEach(this.shared.advanced_filters_applied, function(value, key) {
                var tmp = {};
                tmp[key] = value.join();
                filters_selection["advanced"].push(tmp);
            });

            var o = {
                filters: filters_selection
            };

            return o;
        }

        function getHTTPFilters() {

            var o = {
                filters: filters_selection
            };

            return o;
        }

        initSelection();


    return {
        shared: {
            advanced_filters_src    :null,
            advanced_filters_applied: null
        },
        setFiltersData  : function(data) {
            appFilters = data;

            this.shared.advanced_filters_src    = data;
            this.shared.advanced_filters_applied = null;
            filters_selection["advanced"]       = [];

            location_fltrs = data.locations;
            hftype_fltrs   = data.hf_types;
            dates_fltrs    = data.dates;

            reset();
            // filters_selection["dates"] = data["dates"];

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

        getDatesList    : getDatesList,
        getDateGlobalValue : getDateGlobalValue,

        setAdvcdFltsData        : setAdvcdFltsData,
        updtAdvancedFilters     : updtAdvancedFilters,
        getAdvancedFiltersCnt   : getAdvancedFiltersCnt,
        clearAdvancedFilters    : clearAdvancedFilters,
        clearFilters            : clearFilters,

        getHTTPFilters   : getHTTPFilters,
        applyHTTPFilters : applyHTTPFilters
    }
});
