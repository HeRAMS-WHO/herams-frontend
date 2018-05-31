'use strict';

/**
 * @ngdoc service
 * @name app-herams.service:filtersSvc
 * @description
 *   This service provides a set of methods to handle filters
 */
angular.module('app-herams').factory('filtersSvc', function($log,commonSvc) {

        var appFilters;

        /* ---------------------- FILTERS SELECTION ---------------------- */

        var filters_selection = {};

        function initSelection() {
            filters_selection["location"] = [];
            filters_selection["date"] = getDateGlobalValue();
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

            // return type + " - nc";
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
            var data = _.filter(location_fltrs, { 'geo_name': geo_name }),
                geoId = data[0].geo_id;

            applied_location_fltrs.push(geoId);

            // check if level is all checked
            // if so, add parent_id to the filters
            if ((getLevelLocationStatus(data[0].geo_level) == 1) && (applied_location_fltrs.indexOf(data[0].parent_id)==-1))
                applied_location_fltrs.push(data[0].parent_id);

            /* select all child locations */
            var children = _.filter(location_fltrs, { 'parent_id': geoId });
            if (children.length>0) applied_location_fltrs = applied_location_fltrs.concat( _.map(children, 'geo_id'));

        }

        function rmvLocation(geo_name) {

            var data = _.filter(location_fltrs, { 'geo_name': geo_name });
            _.pull(applied_location_fltrs,data[0].geo_id);

            /* remove all child locations */
            var children = _.filter(location_fltrs, { 'parent_id': data[0].geo_id });
            _.pullAll(applied_location_fltrs, _.map(children, 'geo_id'));

            _.pull(applied_location_fltrs,data[0].parent_id);

            /* remove top level from list */
            var top_level_loc = _.filter(location_fltrs, { 'geo_level': '1' });
            if (applied_location_fltrs.indexOf(top_level_loc.geo_id) != -1) _.pull(applied_location_fltrs,top_level_loc.geo_id);

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
           } else {
               (rsltArr.length == compareArr.length)? rtrn = 1 : rtrn = 2;
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
            var rslt = _.intersectionWith(_.map(data,'geo_id'),applied_location_fltrs, _.isEqual);

            return setStatusCode(rslt, data);
        }

        function checkLocationLevel(level) {
            var status = getLevelLocationStatus(level);
            var level_locations = _.filter(location_fltrs, { 'geo_level': level });

            if ((status == 1) || (status == 2)) {

                /* REMOVE all related selection */
                _.forEach(level_locations, function(item) {
                    rmvLocation(item.geo_name);
                });
                _.pullAll(applied_location_fltrs, _.map(level_locations, 'geo_id'));

                /* handling parent id in selection */
                if (applied_location_fltrs.indexOf(level_locations[0].parent_id) != -1) {
                    _.pull(applied_location_fltrs, level_locations[0].parent_id);
                }

            } else {

                /* ADD all related selection */
                _.forEach(level_locations, function(item) {
                    addLocation(item.geo_name);
                });
                applied_location_fltrs = applied_location_fltrs.concat( _.map(level_locations, 'geo_id'));

                /* handling parent id in selection */
                if (applied_location_fltrs.indexOf(level_locations[0].parent_id) == -1) applied_location_fltrs.push(level_locations[0].parent_id);

            }
        }

        function getLocationGlobalValue() {
            if (applied_location_fltrs) {

                if (applied_location_fltrs.length==1) return _.find(location_fltrs, { 'geo_id': applied_location_fltrs[0] }).geo_name;

                var cntStr = (applied_location_fltrs.length>0)? " (multi)" : "";
                if (getLevelLocationStatus('2') == 1) cntStr = " (all)";

                return "Location"+cntStr;

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


        function getHFStatusCode() {
            var rtrn;

           if (applied_hftype_fltrs.length == 0) {
               rtrn = 0;
           } else {
               (applied_hftype_fltrs.length == hftype_fltrs.length)? rtrn = 1 : rtrn = 2;
           }

           return rtrn;
        }


        function getHFColor(hf_name) {
            return getHFData(hf_name).color;
        }

        function getHFGlobalValue() {
            if ((applied_hftype_fltrs) && (hftype_fltrs)) {

                if (applied_hftype_fltrs.length==1) return _.find(hftype_fltrs, { 'code': applied_hftype_fltrs[0] }).label;

                var cntStr = (applied_hftype_fltrs.length>0)? " (multi)" : "";
                if (applied_hftype_fltrs.length == hftype_fltrs.length) cntStr = " (all)";
                return "Type"+cntStr;
            }
        }

        function checkAllHF() {

            if (applied_hftype_fltrs.length>0) {
                applied_hftype_fltrs = [];
            }  else {
                applied_hftype_fltrs = _.map(hftype_fltrs,'code');
            }

        }


        /* ---------------------- Dates Filters methods ---------------------- */

        var dates_fltrs,
            applied_date = null;

        function getDatesList() {
            return dates_fltrs;
        }

        function getDateGlobalValue() {
            // $log.info('getDateGlobalValue: ',_self);
            if (dates_fltrs) {
                return (applied_date!=null)? applied_date : dates_fltrs[0];
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
            //
            initSelection();
            //
            this.shared.advanced_filters_applied = {};
            //
            applied_location_fltrs = [];
            applied_hftype_fltrs = [];
            //
            // reset();
        }

        /* ---------------------- Advanced Filters methods ---------------------- */

        var advanced_filters_src,
            advanced_filters_applied;

        function setQuestionSet(groupData) {
            var rslt = [];

            _.forEach(groupData.questions, function(val, key) {

                // if ((val.dimensions == 0) && (val.answers != null)) $log.info(val.dimensions, ' - ', val.answers, ' - ', val.questions);
                // if ((val.dimensions == 1)) $log.info('-- ',val.dimensions, ' -- ', val.text, ' - ', val.answers, ' - ', val.questions);

                if ((val.dimensions == 0) && (val.answers != null)) {
                    var o = {
                        code: val.title,
                        text: val.text,
                        answers: val.answers
                    }
                    rslt.push(o);

                } else if (val.dimensions == 1) {

                    var tmp_code = val.title,
                        tmp_text = val.text;

                    var yesnoQ = (_.filter(val.answers,{'code':"Y"}).length > 0);

                    if (!yesnoQ) {
                        _.forEach(val.questions[0], function(qval, qkey) {
                            if (qval.answers != null) {
                                var o = {
                                    code: tmp_code + "[" + qval.title + "]",
                                    text: tmp_text + ' - ' + qval.text,
                                    answers: qval.answers
                                }
                                rslt.push(o);
                            }
                        });
                    } else {
                        // $log.info('yesnoQ - ', val.questions);
                        var tmp_answers = [];
                        var o = {
                            code: tmp_code,
                            text: tmp_text
                        }

                        _.forEach(val.questions[0], function(qval, qkey) {
                            var oo = {
                                code: qval.title,
                                text: qval.text
                            }
                            tmp_answers.push(oo);
                        });

                        o.answers = tmp_answers;
                        rslt.push(o);
                    }
                }
            });


            return rslt;
        }

        function setAdvcdFltsData(src){
            var tmp = {};
            _.forEach(src, function(value) {
                tmp[value.title] = setQuestionSet(value);
            });

            this.shared.advanced_filters_src = tmp;
            this.shared.advanced_filters_applied = {};

            var tmpGrps = [];
            _.forEach(src, function(value) {
              tmpGrps.push({
                  title: value.title,
                  id: value.id
              });
            });

            this.shared.LS_grps_data = tmpGrps;
            this.shared.LS_grps_titles = _.keys(tmp);
        }


        function updtAdvancedFilters(data) {
            advanced_filters_applied = data;
            this.shared.advanced_filters_applied = data;
        }

        function getAdvancedFiltersCnt() {
            var cnt = 0;

            _.forEach(advanced_filters_applied, function(value,key) {
                cnt += value.length;
            });

            return cnt;
        }

        function clearAdvancedFilters() {

            advanced_filters_applied = {};
            this.shared.advanced_filters_applied = {};

            initSelection();

            getAdvancedFiltersCnt();
        }


        /* ---------------------- Advanced Filters methods ---------------------- */

/*
        function reset() {

            /!* By default, check all locations of the Workspace *!/
            for (var i in location_fltrs) {
                addLocation(location_fltrs[i]["geo_name"]);
            }

            /!* By default, check all HF types of the Workspace *!/
            for (var i in hftype_fltrs) {
                addHF(hftype_fltrs[i]["label"]);
            }

            addDate(dates_fltrs[0]);

        }
*/

        function applyHTTPFilters(date) {

            filters_selection["date"] = date;
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
            advanced_filters_src    : null,
            advanced_filters_applied: null,
            LS_grps_data            : null,
            LS_grps_titles          : null
        },
        getDate: function() {
            return getDateGlobalValue();
        },
        clearDate: function() {
            applied_date = null;
            applied_date = getDateGlobalValue();
        },
        setFiltersData  : function(data) {
            appFilters = data;

            filters_selection["advanced"]       = [];

            location_fltrs = data.locations;
            hftype_fltrs   = data.hf_types;
            dates_fltrs    = data.dates;

            // reset();
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
        getHFStatusCode : getHFStatusCode,
        checkAllHF      : checkAllHF,

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
