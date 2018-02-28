'use strict';

/**
 * @ngdoc service
 * @name phc_dashboard.service:APIServices
 * @description
 *   This service is the only one point which acces to GeoServer.
 *   The structure is always the same for each exposed methods.
 *   It creates an object with the view name to be called and optionnaly filters (CQL_FILTER) or params (viewparams).
 *   Then it creates a key for handling a cache.
 *
 *  Note:
 *   Sometimes there is an additional attribute 'specificUserStore' which helps to know if we need to call a specific store on GeoServer (NMIS, SDI...)
 *   Because survey datas are not the same between all stores. So when data is not shared between store, we put this attribute on the request object.
 */
angular.module('phc_dashboard').factory('APIServices', function($q, $rootScope, $http, SEARCH_MAX_FEATURES) {

    var _cachedData = {};

    var buildCQLFilter = function(filters) {
        var result = '';
        if (filters) {
            result = '&CQL_FILTER=';
            for (var prop in filters) {
                if (typeof filters[prop] === 'object') {
                  result += ' AND ' + prop + ' in (\'' + filters[prop].join('\',\'') + '\')';
                } else {
                  result += ' AND ' + prop + '=\'' + filters[prop] + '\'';
                }
            }
            result = result.replace(' AND ', '');
        }
        return result;
    };

    var buildViewParams = function(params) {
        var result = '';
        if (params) {
            result = '&viewparams=';
            for (var prop in params) {
                var valueEscaped = ('' + params[prop]).split(',').join('\\,');
                valueEscaped = valueEscaped.split(':').join('\\:');
                result += ';' + prop + ':' + valueEscaped;
            }
            result = result.replace('=;', '=');
        }
        return result;
    };

    var callGeoServer = function(store, view, filters, maxFeatures) {
        var url = APP_CONFIG.geoserver.protocol + '://' + APP_CONFIG.geoserver.host + APP_CONFIG.geoserver.port + '/' + APP_CONFIG.geoserver.context;
        url += '/' + store + '/ows?service=WFS&version=1.0.0&request=GetFeature&outputFormat=application/json';
        if (maxFeatures) {
            url += '&maxFeatures=' + maxFeatures;
        }
        url += '&typeName=' + store + ':' + view + filters;
        return $http.get(url);
    }

    /**
     * Calls GetRecords through DreamFactory
     **/
    var call = function(store, request) {
        var filters = '';
        if (request.filters) {
            filters = buildCQLFilter(request.filters);
        } else if (request.params) {
            filters = buildViewParams(request.params);
        }
        return callGeoServer(store, request.view, filters, request.limit);
    };


    /**
     * Calls GetRecord after making sure the API is ready
     **/
    var doCallWhenReady = function(request, cacheKeySuffix) {
        var store = APP_CONFIG.geoserver.defaultStore;
        if (request.specificUserStore) {
            store = $rootScope.user.geoServerStore;
        }
        var cacheKey = store + '_' + cacheKeySuffix;
        return $q(function(resolve, reject) {
            if (typeof(_cachedData[cacheKey]) !== 'undefined' && _cachedData[cacheKey] !== null) {
                resolve(_cachedData[cacheKey]);
            } else {
                call(store, request).then(
                    function(result) {
                        if (cacheKeySuffix) {
                            _cachedData[cacheKey] = result.data;
                        }
                        resolve(result.data);
                    },
                    function(error) {
                        reject(error);
                    }
                );
            }
        });
    };

    return {
        getUserAuthorizedStates: function(user, password) {
            var viewName = 'uvw_login_geog_list';
            var request = {
                view: viewName,
                filters: {
                    'login': user,
                    'pwd': password
                }
            };

            var cacheKey = viewName + '_' + user + '_' + password;
            return doCallWhenReady(request, cacheKey);
        },

        getAdminsLevel: function() {
            var viewName = 'uvw_admin_level';
            var request = {
                view: viewName
            };

            var cacheKey = viewName;
            return doCallWhenReady(request, cacheKey);
        },

        getAdminNameById: function(id) {
            var viewName = 'ufn_get_admin_name_by_id';
            var request = {
                view: viewName,
                params: {
                    'geog_id': id
                }
            };

            var cacheKey = viewName + '_' + id;
            return doCallWhenReady(request, cacheKey);
        },

        getAdminsLayersFromParentId: function(id) {
            var viewName = 'uvw_admin_layer';
            var request = {
                view: viewName,
                filters: {
                    'geog_parent_id': id
                }
            };

            var cacheKey = viewName + '_' + id;
            return doCallWhenReady(request, cacheKey);
        },

        getAdminLayerFromId: function(id) {
            var viewName = 'uvw_admin_layer';
            var request = {
                view: viewName,
                filters: {
                    'geog_id': id
                }
            };

            var cacheKey = viewName + '_' + id;
            return doCallWhenReady(request, cacheKey);
        },

        getAdminsDataFromParentId: function(id) {
            var viewName = 'uvw_admin_geo_data';
            var request = {
                view: viewName,
                filters: {
                    'geog_parent_id': id
                }
            };

            var cacheKey = viewName + '_' + id;
            return doCallWhenReady(request, cacheKey);
        },

        getAdminsDataByCode: function(code) {
            var viewName = 'uvw_admin_geo_data';
            var request = {
                view: viewName,
                filters: {
                    'geog_code': code
                }
            };

            var cacheKey = viewName + '_' + code;
            return doCallWhenReady(request, cacheKey);
        },

        // Dashboard
        getIndicatorGroups: function() {
            var viewName = 'uvw_indicator_group_list';
            var request = {
                view: viewName
            };

            var cacheKey = viewName;
            return doCallWhenReady(request, cacheKey);
        },

        getIndicatorsFromGroupId: function(id) {
            var viewName = 'uvw_indicator_list';
            var request = {
                specificUserStore: true,
                view: viewName,
                filters: {
                    'indicator_group_id': id
                }
            };

            var cacheKey = viewName + '_' + id;
            return doCallWhenReady(request, cacheKey);
        },

        getIndicatorDataByIdAndGeog: function(indicatorId, geogId) {
            var viewName = 'ufn_get_indicator_data';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'indicator_id': indicatorId,
                    'geog_id': geogId
                }
            };

            var cacheKey = viewName + '_' + indicatorId + '_' + geogId;
            return doCallWhenReady(request, cacheKey);
        },


        getIndicatorDataByIdAndGeogParent: function(indicatorId, geogParentId) {
            var viewName = 'ufn_get_indicator_data_by_parent';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'indicator_id': indicatorId,
                    'geog_parent_id': geogParentId
                }
            };

            var cacheKey = viewName + '_' + indicatorId + '_' + geogParentId;
            return doCallWhenReady(request, cacheKey);
        },

        getPrimaryInformations: function(indicatorsGroupId, geogParentId) {
            var viewName = 'ufn_get_primary_indicators_data';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'indicator_group_id': indicatorsGroupId,
                    'geog_id': geogParentId
                }
            };

            var cacheKey = viewName + '_' + indicatorsGroupId + '_' + geogParentId;
            return doCallWhenReady(request, cacheKey);
        },

        getKeyValue: function(key) {
            var viewName = 'ufn_get_value_by_key';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'key': key
                }
            };

            var cacheKey = viewName + '_' + key;
            return doCallWhenReady(request, cacheKey);
        },

        /* Modal */
        getHFbyWardId: function(wardId) {
            var viewName = 'ufn_get_hf_per_admin3';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'admin3_id': wardId
                }
            };

            // var cacheKey = viewName;
            var cacheKey = viewName + '_' + wardId;
            return doCallWhenReady(request, cacheKey);
        },

        getHFDetailbyId: function(hfId) {
            var viewName = 'ufn_get_hf_general_info';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'hf_id': hfId
                }
            };

            var cacheKey = viewName + '_' + hfId;
            return doCallWhenReady(request, cacheKey);
        },

        getCategories: function() {
            var viewName = 'uvw_display_cat_list';
            var request = {
                specificUserStore: true,
                view: viewName
            };

            var cacheKey = viewName;
            return doCallWhenReady(request, cacheKey);
        },

        getSubCategories: function(categoryId) {
            var viewName = 'uvw_display_sub_cat_list';
            var request = {
                specificUserStore: true,
                view: viewName,
                filters: {
                    'cat_id': categoryId
                }
            };

            var cacheKey = viewName + '_' + categoryId;
            return doCallWhenReady(request, cacheKey);
        },

        getSubCategoryData: function(hfId, subCategoryId) {
            var viewName = 'ufn_get_hf_sub_cat_data';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'hf_id': hfId,
                    'display_sub_cat_id': subCategoryId
                }
            };

            var cacheKey = viewName + '_' + hfId + '_' + subCategoryId;
            return doCallWhenReady(request, cacheKey);
        },

        getSubCategoryDataSearch: function(subCategoryId) {
            var viewName = 'XXX';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'display_sub_cat_id': subCategoryId
                }
            };

            var cacheKey = viewName + '_' + subCategoryId;
            return doCallWhenReady(request, cacheKey);
        },

        getHfPictures: function(hfId) {
            var viewName = 'ufn_get_hf_images';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'hf_id': hfId
                }
            };

            var cacheKey = viewName + '_' + hfId;
            return doCallWhenReady(request, cacheKey);
        },

        getHfPicturesByElement: function(hfId, eltId) {
            var viewName = 'ufn_get_pictures_by_hf_and_elt';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'hf_id': hfId,
                    'elt_id': eltId
                }
            };

            var cacheKey = viewName + '_' + hfId + '_' + eltId;
            return doCallWhenReady(request, cacheKey);
        },

        getIndicatorClassBreaksByLvl: function(lvlId, indicatorId) {
            var viewName = 'ufn_get_indicator_class';
            var request = {
                view: viewName,
                params: {
                    'admin_lvl': lvlId,
                    'indicator_id': indicatorId
                }
            };

            var cacheKey = viewName + '_' + lvlId + '_' + indicatorId;
            return doCallWhenReady(request, cacheKey);
        },

        getMapLayers: function() {
            var viewName = 'uvw_map_layers';
            var request = {
                view: viewName
            };
            var cacheKey = viewName;
            return doCallWhenReady(request, cacheKey);
        },

        getHFs: function(adminKey, adminValue) {
            var viewName = 'uvw_hf';
            var request = {
                view: viewName,
                filters: {}
            };
            request.filters[adminKey] = adminValue;

            var cacheKey = viewName + '_' + adminKey + '_' + adminValue;
            return doCallWhenReady(request, cacheKey);
        },

        getTotalHFs: function(statesId) {
            var viewName = 'uvw_hf';
            var request = {
                view: viewName,
                filters: {
                  'admin1_id': statesId
                },
                specificUserStore: true,
                limit: 1
            };

            return doCallWhenReady(request);
        },

        getAnalysisCategories: function() {
            var viewName = 'uvw_analyses_cat_list';
            var request = {
                view: viewName
            };
            var cacheKey = viewName;
            return doCallWhenReady(request, cacheKey);
        },

        getAnalysisList: function(geogId) {
            var viewName = 'uvw_analyses_list';
            var request = {
                view: viewName,
                params: {
                    'geog_id': geogId
                }
            };
            var cacheKey = viewName + '_' + geogId;
            return doCallWhenReady(request, cacheKey);
        },

        // Search
        getDataElements: function() {
            var viewName = 'uvw_searchable_elements';
            var request = {
                specificUserStore: true,
                view: viewName
            };
            var cacheKey = viewName;
            return doCallWhenReady(request, cacheKey);
        },

        getDataElementsTop: function() {
            var viewName = 'uvw_searchable_elements_top_25';
            var request = {
                specificUserStore: true,
                view: viewName
            };
            var cacheKey = viewName;
            return doCallWhenReady(request, cacheKey);
        },

        getTypesOfHF: function() {
            var viewName = 'uvw_hf_type_list';
            var request = {
                view: viewName
            };
            var cacheKey = viewName;
            return doCallWhenReady(request, cacheKey);
        },

        getSearchableSubCategories: function(categoryId) {
            var viewName = 'uvw_searchable_display_sub_cat_list';
            var request = {
                specificUserStore: true,
                view: viewName,
                filters: {
                    'cat_id': categoryId
                }
            };

            var cacheKey = viewName + '_' + categoryId;
            return doCallWhenReady(request, cacheKey);
        },

        getSearchableSubCategoryData: function(subCategoryId) {
            var viewName = 'ufn_get_searchable_sub_cat_elements';
            var request = {
                specificUserStore: true,
                view: viewName,
                params: {
                    'display_sub_cat_id': subCategoryId
                }
            };

            var cacheKey = viewName + '_' + subCategoryId;
            return doCallWhenReady(request, cacheKey);
        },

        getSearchResult: function(name, type, location, criteria) {
            var viewName = 'ufn_get_search_result';
            var request = {
                specificUserStore: true,
                view: viewName,
                limit: SEARCH_MAX_FEATURES,
                params: {
                    'name': name,
                    'type': type,
                    'location': location,
                    'criteria': criteria
                }
            };

            return doCallWhenReady(request);
        }
    };
})
