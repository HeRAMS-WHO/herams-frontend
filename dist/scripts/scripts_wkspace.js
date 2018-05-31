"use strict";window.appVersion="v1.0",angular.module("app-herams",["ui.router","ui.bootstrap","ngSanitize"]);var CONFIG={esriHTTP:{start:"https://extranet.who.int/maps/rest/services/WHE_BASEMAP/GLOBAL_ADM/MapServer/4/query?where=ADM0_NAME+IN+%28%27",end:"%27%29&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=ADM0_NAME%2C+ISO_2_CODE&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json"},home:{layersOpacity:.6,dfltColors:{layer_stroke_color:"#7b7b7b",layer_stroke_weight:1.5,layer_fill_color:"#ffffff"},centroidRadius:15},overview:{map:{zoom:5.4,lat:9.082,long:8.6753,basemaps:["https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"],layers:[{name:"Nigeria"}]}},charts:{common:{title:{align:"left"},exporting:{enabled:!1},yAxis:[{labels:{enabled:!1},title:{enabled:!1}}]},bar:{chart:{type:"bar",spacing:[0,0,0,0],marginRight:25,marginLeft:130,marginBottom:50,backgroundColor:"rgba(255, 255, 255, 0.0)",style:{fontFamily:"'Source Sans Pro',sans-serif"}},legend:{enabled:!1},tooltip:{backgroundColor:"rgba(66,66,74,1)",borderWidth:0,shadow:!1,style:{color:"#ffffff"},formatter:function(){return"<b>"+this.point.y+"</b>"},positioner:function(e,t,a){return{x:a.plotX+100,y:a.plotY-3}}},xAxis:{categories:["placeholder 1","placeholder 2","placeholder 3","placeholder 4"],labels:{style:{width:"100px",fontSize:"14px"}}},plotOptions:{bar:{pointWidth:10,align:"left",dataLabels:{enabled:!0,formatter:function(){return"<b>"+this.point.custom+"</b>"},style:{fontSize:"12px",fontWeight:"bold"}}}},series:[{data:[{y:30,custom:342,color:"#dc4a8b"},{y:4,custom:167,color:"#599d22"},{y:20,custom:210,color:"#52addc"},{y:10,custom:62,color:"#006958"}]}]},stacked:{chart:{type:"bar",marginLeft:0,marginRight:0,spacing:[0,0,0,0],backgroundColor:"rgba(255, 255, 255, 0.0)",style:{fontFamily:"'Source Sans Pro',sans-serif"}},tooltip:{backgroundColor:"rgba(66,66,74,1)",borderWidth:0,shadow:!1,style:{color:"#ffffff"},formatter:function(){return"<b>"+this.y+"%</b>"},positioner:function(e,t,a){var r=a.plotX-e-10,n=a.plotY-3;return{x:2<r?r:2,y:2<n?n:2}}},yAxis:[{labels:{enabled:!1},title:{enabled:!1}}],xAxis:{categories:["placeholder 1","placeholder 2","placeholder 3"],labels:{x:0,y:-6,align:"left",style:{width:"200px",fontSize:"12px"}}},plotOptions:{series:{stacking:"normal",pointWidth:6}},series:[{name:"#1 (test)",data:[50,10,5]}]},pie:{chart:{type:"pie",animation:!0,spacing:[0,0,0,0],style:{fontFamily:"'Source Sans Pro',sans-serif"}},exporting:{enabled:!1},credits:{enabled:!1},title:{text:"",align:"left"},legend:{floating:!0,maxHeight:100,verticalAlign:"top",y:100},plotOptions:{pie:{borderColor:"transparent",innerSize:"93%",enableMouseTracking:!0,dataLabels:{enabled:!1},showInLegend:!0}},tooltip:{enabled:!1},series:[{size:"100%",states:{hover:{enabled:!1}}}]},tooltip_pie:{backgroundColor:"rgba(66,66,74,1)",borderWidth:0,shadow:!1,style:{color:"#ffffff"},formatter:function(){var e=Math.pow(10,1),t=Math.round(this.point.percentage*e)/e;return"n = "+this.point.y+"<br/><b>"+t+"%</b>"},positioner:function(e,t,a){return{x:a.plotX+10,y:a.plotY-3}}},legend_cust:{align:"left",enabled:!0,symbolRadius:0,symbolWidth:8,symbolHeight:8,marginLeft:0,spacing:[0,0,0,0]}}};angular.module("app-herams").directive("userpopover",["commonSvc",function(e){return{templateUrl:"/js/common/directives/user_popover.html",restrict:"E",replace:!0,scope:!1}}]),angular.module("app-herams").factory("commonSvc",["$state","$http","$compile","$window","$log",function(e,r,a,t,n){var o={home:ENV_VARS.host+"home",overview:ENV_VARS.host+"categories"};return{deepCopy:function(e){return $.extend(!0,{},e)},loadData:function(e,t){var a={token:tokenConfig};return t&&(a=$.extend(a,t)),r({method:"POST",url:e,params:a})},isLocal:function(){return"localhost"==window.location.hostname},getWSPaths:function(e){return o[e]},home:function(){t.location="/"},gotoProject:function(e){t.location=this.isLocal?"overview.html":"/projects/"+e},showUsrProfile:function(){t.location="/user/settings/profile"},logout:function(){t.location="/site/logout"},setLoginPopover:function(t){t.logout=this.logout,t.viewProfile=this.showUsrProfile,$("#log").popover({container:$(".popover-base"),placement:"bottom",boundary:"window",content:'<span class="popover-spacer">this is a test</span>',html:!0}),$("#log").on("shown.bs.popover",function(){var e=a("<userpopover></userpopover>")(t);$(".popover-body").html(e)})},setUsrInfo:function(e,t){var a=t||{email:"hardtest@novel-t.ch",first_name:"Sam",last_name:"Petragallo"};e.usr_name=a.first_name+" "+a.last_name,e.usr_email=a.email},getWindowWdth:function(){var e=window,t=document,a=t.documentElement,r=t.getElementsByTagName("body")[0];return e.innerWidth||a.clientWidth||r.clientWidth}}}]),angular.module("app-herams").service("esriSvc",["$timeout","$log","$http","LayerPopupSvc",function(e,t,a,h){var g;function r(p,f){var e,t=(e=p.name,CONFIG.esriHTTP.start+e+CONFIG.esriHTTP.end);a({method:"GET",url:t,headers:{"Content-Type":"application/json;charset=UTF-8"}}).then(function(e){var t,a,r,n,o,i,s,l,c,u,d;t=e.data.features,a=p,r=f,n={type:"FeatureCollection"},o=t.map(function(e){return ArcgisToGeojsonUtils.arcgisToGeoJSON(e)}),n.features=o,i=n,s=a,c=(l=r)||CONFIG.home.dfltColors.layer_stroke_color,u=l||CONFIG.home.dfltColors.layer_fill_color,d=L.geoJSON(i,{style:{color:c,weight:CONFIG.home.dfltColors.layer_stroke_weight,fillOpacity:CONFIG.home.layersOpacity,fillColor:u}}).addTo(g),null!=s.stats&&h.addPopup(g,d,s)})}return{getEsriShape:function(e,t,a){g=e,r(t,a)}}}]),angular.module("app-herams").service("LayerPopupSvc",["$timeout","$compile","$log","commonSvc",function(o,i,e,a){return{addPopup:function(r,e,n){if(e.on("mouseover",function(e){if($(".entry-popup.layer"+void 0).length<=0){var t='<entry-popup countryname="'+n.name+'"></entry-popup>',a=L.popup({className:"entry-popup layer"+void 0,closeButton:!0}).setLatLng([n.geodata.lat,n.geodata.long]).setContent(t).openOn(r);o(function(){var e=angular.element(".home").scope();i(a._contentNode)(e)})}}),null!=n.pid){var t=n.pid;e.on("click",function(e){a.gotoProject(t)})}}}}]),angular.module("app-herams").controller("MainCtrl",["$scope","$compile","$log","$timeout","$uibModal","commonSvc","filtersSvc","HFMapSvc","chartsSvc",function(o,i,s,l,e,t,a,c,u){var d="No data available";function r(){$(".partners-list-grp").hide(),$(".partners-list").removeClass("fullHeight")}function p(){for(var e=0;e<o.charts.length;e++){$("#chart"+(e+1)).empty()}u.destroyCharts(),u.setCharts(o.charts),c.refreshLayout()}function f(e){return t.loadData(e,a.getHTTPFilters())}function h(e){return""!=e.ws_chart_url&&""!=e.ws_map_url}o.charts={},o.categories=[],o.catIDSelect=[0,0,0],o.catNameSelect=["","",""],o.catMenuON=["","",""],o.mapdata={},o.tables=[],o.tmpFilters=[],o.getAdvancedFiltersCnt=a.getAdvancedFiltersCnt,o.home=function(){t.home()},f(t.getWSPaths("overview")).then(function(e){o.categories=e.data.results.categories,t.setUsrInfo(o,e.data.results.userinfo),t.setLoginPopover(o)}).catch(function(e){s.info("There has been an error Overview Data")}).then(function(e){t.loadData("https://herams-dev.westeurope.cloudapp.azure.com/aping/global-filters").then(function(e){a.setFiltersData(e.data.results),o.states=a.getStatesList(),o.hftypes=a.getHFTypesList(),o.surveysDates=a.getDatesList();var t=a.getDate();o.date=t}).catch(function(e){s.info("There has been an error loading Filters")}).then(function(e){t.loadData("https://herams-dev.westeurope.cloudapp.azure.com/aping/filters?pid=374").then(function(e){a.setAdvcdFltsData(e.data.groups)}).catch(function(e){s.info("There has been an error loading Filters")}).then(function(e){s.info("load filters finally")}),s.info("load filters finally")}),m(o.categories[0])}),o.launchLayout=m,$(".partners-list-btn").click(function(){$(".partners-list-grp").show(),$(".partners-list").addClass("fullHeight"),$(".partners-list-cache").click(function(){$(".partners-list-grp").hide(),$(".partners-list").removeClass("fullHeight")})}),$(window).scroll(r),o.setBreadcrumbs=function(){var e=o.catNameSelect[1];return o.catNameSelect[2]&&(e+=" > "+o.catNameSelect[2]),e},o.hasData=h,o.isDisabled=function(e){return""==e.ws_chart_url&&""==e.ws_map_url&&null==e.aggregated};var g=0;function m(a,e){if(null==e&&(e=0),o.catIDSelect[e]!=a.id||g!=e)if(o.catIDSelect=["","",""],o.catNameSelect[e]=a.name,o.catIDSelect[e]=a.id,(n=g=e)<2&&(o.catNameSelect[2]="",n<1&&(o.catNameSelect[1]="")),h(a)){o.mapdata={},o.charts={},o.tables=[],$(".main-content").empty(),u.destroyCharts();var t=function(e){var t;switch(e){case"layout14":t="<layout14></layout14>";break;case"layout13":t="<layout13></layout13>"}return t}(a.layout),r=i(t)(o);$(".main-content").html(r),$(".main-content").hide(),$(".loading").show(),l(function(){var e,t;e=a.ws_chart_url,t=function(){f(a.ws_map_url).then(function(e){o.mapdata=e.data.results,c.createMap("mapid-wkspace",o.mapdata)}).catch(function(e){s.info("Error loading Map Data: ",e)}).then(function(){$(".loading").hide(),$(".main-content").show(),$(window).off("resize",p),$(window).resize(p),l(function(){p()},100)})},f(e).then(function(e){for(var t in o.charts=e.data.stats?e.data.stats:e.data,o.charts)"table"==o.charts[t].type&&o.tables.push(v(o.charts[t]))}).catch(function(e){s.info("Error loading Charts Data: ",e)}).then(function(e){t()})},1500)}else 0==a.aggregated?m(a.subcategories[0],e+1):($(".main-content").empty(),u.destroyCharts(),$(".main-content").html(d));var n;o.catMenuON[e]!=a.id?o.catMenuON[e]=a.id:o.catMenuON[e]=""}function v(e){var t={},a=e.rows;for(var r in t.name=e.name,t.cols=e.columns,t.rows=[],a){var n=[];for(var o in a[r])n.push(a[r][o]);t.rows.push(n)}return t}function n(){return t.loadData(t.getWSPaths("overview"),a.applyHTTPFilters(o.date)).then(function(e){o.categories=e.data.results.categories,o.catIDSelect=[0,0,0],o.catNameSelect=["","",""],o.catMenuON=["","",""]}).catch(function(e){s.info("There has been an error Overview Data")}).then(function(e){m(o.categories[0])})}function _(){a.clearFilters(),o.$broadcast("setFiltersCleared"),n()}o.applyFilters=n,o.clearSetFilters=_,o.clearMainFilters=function(){a.clearDate(),o.date=a.getDateGlobalValue(),_()}}]).directive("layout14",function(){return{templateUrl:"/js/overview/directives/layouts/layout_1_4.html",restrict:"E",replace:!0}}).directive("layout13",function(){return{templateUrl:"/js/overview/directives/layouts/layout_1_3.html",restrict:"E",replace:!0}}).directive("datavizTable",function(){return{templateUrl:"/js/overview/directives/dataviz/dataviz-table.html",restrict:"E",replace:!0}}),angular.module("app-herams").factory("chartsSvc",["$log","commonSvc",function(e,o){var t=[];function r(d,p){var e=new Highcharts.Chart(function(e,t){if("stacked"==t.type||"bar"==t.type){var a=o.deepCopy(CONFIG.charts.common),r=$.extend(o.deepCopy(a),CONFIG.charts.stacked),n=null!=t.total?t.title+'<span class="chart-title-total"> ('+t.total+")</span>":t.title;r.title.useHTML=!0,r.title.text=n,r.xAxis.categories=t.labels,r.series=t.series,"stacked"==t.type&&(r.colors=t.colors)}else a=o.deepCopy(CONFIG.charts.common),(r=$.extend(o.deepCopy(a),CONFIG.charts.pie)).title.text=t.title,r.tooltip=CONFIG.charts.tooltip_pie,r.series[0].data=t.data;return r.chart.renderTo=e,r.legend=CONFIG.charts.legend_cust,r}(d,p),function(e){var t,a,r,n,o,i,s,l,c,u;"pie"==p.type?(s=e,l=p.total,c='<span class="pieChartCenterTxt">'+l+"</span>",u=s.plotTop+.5*s.plotHeight,$(s.renderTo).append(c),(c=$(s.renderTo).find(".pieChartCenterTxt")).css("top",u),o=e,i=p.total,$(o.series[0].data).each(function(e,t){t.legendItem.on("click",function(){var e;t.sliced?i+=t.y:i-=t.y,t.slice(!t.sliced),e=i,$(o.renderTo).find(".pieChartCenterTxt").html(e)})})):"stacked"==p.type&&(t=e,a=d,r=$("#"+a).innerWidth(),n=$("#"+a).innerHeight()-30,t.setSize(r,n))});t.push(e)}return{setCharts:function(e){for(var t=0;t<e.length;t++){var a="chart"+(t+1);"table"!=e[t].type&&r(a,e[t])}},destroyCharts:function(){0<t.length&&function(){for(var e=0;e<t.length;e++)t[e].destroy();t=[]}()}}}]),angular.module("app-herams").factory("filtersSvc",["$log","commonSvc",function(e,t){var r={};function a(){r.location=[],r.date=m(),r.hftypes=[],r.advanced=[]}var n,o=[];function i(e){var t=_.filter(n,{geo_name:e}),a=t[0].geo_id;o.push(a),1==c(t[0].geo_level)&&-1==o.indexOf(t[0].parent_id)&&o.push(t[0].parent_id);var r=_.filter(n,{parent_id:a});0<r.length&&(o=o.concat(_.map(r,"geo_id")))}function s(e){var t=_.filter(n,{geo_name:e});_.pull(o,t[0].geo_id);var a=_.filter(n,{parent_id:t[0].geo_id});_.pullAll(o,_.map(a,"geo_id")),_.pull(o,t[0].parent_id);var r=_.filter(n,{geo_level:"1"});-1!=o.indexOf(r.geo_id)&&_.pull(o,r.geo_id)}function l(e,t){return 0==e.length?0:e.length==t.length?1:2}function c(e){var t=_.filter(n,{geo_level:e});return l(_.intersectionWith(_.map(t,"geo_id"),o,_.isEqual),t)}var u,d=[];function p(e){return _.find(u,{label:e})}var f,h,g=null;function m(){if(f)return null!=g?g:f[0]}function v(){var a=0;return _.forEach(h,function(e,t){a+=e.length}),a}return a(),{shared:{advanced_filters_src:null,advanced_filters_applied:null,LS_grps_data:null,LS_grps_titles:null},getDate:function(){return m()},clearDate:function(){g=null,g=m()},setFiltersData:function(e){e,r.advanced=[],n=e.locations,u=e.hf_types,f=e.dates},addFilter:function(e,t){switch(t){case"location":i(e);break;case"hf":a=e,d.push(p(a).code);break;case"date":g=e,r.date=g}var a},rmvFilter:function(e,t){switch(t){case"location":s(e);break;case"hf":a=e,_.pull(d,p(a).code);break;case"date":g=null,r.date=null}var a},getItemStatus:function(e,t){switch(t){case"location":return function(e){var t=_.find(n,{geo_name:e}).geo_id,a=_.filter(n,{parent_id:t});if(0<a.length){var r=_.intersectionWith(_.map(a,"geo_id"),o,_.isEqual);return l(r,a)}return-1!=o.indexOf(t)}(e);case"hf":return a=e,-1!=d.indexOf(p(a).code);case"date":return g==e}var a},getFilterGlobalValue:function(e){switch(e){case"location":return function(){if(o){if(1==o.length)return _.find(n,{geo_id:o[0]}).geo_name;var e=0<o.length?" (multi)":"";return 1==c("2")&&(e=" (all)"),"Location"+e}}();case"hf":return function(){if(d&&u){if(1==d.length)return _.find(u,{code:d[0]}).label;var e=0<d.length?" (multi)":"";return d.length==u.length&&(e=" (all)"),"Type"+e}}();case"date":return m()}},getStatesList:function(){var e=_.filter(n,{geo_level:"2"});return _.map(e,"geo_name")},getSubLocations:function(e){var t=_.filter(n,{geo_name:e})[0].geo_id,a=_.filter(n,{parent_id:t});return _.map(a,"geo_name")},getLevelLocationStatus:c,getLocationLevel:function(e){return _.filter(n,{geo_name:e})[0].geo_level},checkLocationLevel:function(e){var t=c(e),a=_.filter(n,{geo_level:e});1==t||2==t?(_.forEach(a,function(e){s(e.geo_name)}),_.pullAll(o,_.map(a,"geo_id")),-1!=o.indexOf(a[0].parent_id)&&_.pull(o,a[0].parent_id)):(_.forEach(a,function(e){i(e.geo_name)}),-1==(o=o.concat(_.map(a,"geo_id"))).indexOf(a[0].parent_id)&&o.push(a[0].parent_id))},getHFTypesList:function(){return _.map(u,"label")},getHFColor:function(e){return p(e).color},getDatesList:function(){return f},getDateGlobalValue:m,setAdvcdFltsData:function(e){var a={};_.forEach(e,function(e){var t,i;a[e.title]=(t=e,i=[],_.forEach(t.questions,function(e,t){if(0==e.dimensions&&null!=e.answers){var a={code:e.title,text:e.text,answers:e.answers};i.push(a)}else if(1==e.dimensions){var r=e.title,n=e.text;if(0<_.filter(e.answers,{code:"Y"}).length){var o=[];a={code:r,text:n},_.forEach(e.questions[0],function(e,t){var a={code:e.title,text:e.text};o.push(a)}),a.answers=o,i.push(a)}else _.forEach(e.questions[0],function(e,t){if(null!=e.answers){var a={code:r+"["+e.title+"]",text:n+" - "+e.text,answers:e.answers};i.push(a)}})}}),i)}),this.shared.advanced_filters_src=a,this.shared.advanced_filters_applied={};var t=[];_.forEach(e,function(e){t.push({title:e.title,id:e.id})}),this.shared.LS_grps_data=t,this.shared.LS_grps_titles=_.keys(a)},updtAdvancedFilters:function(e){h=e,this.shared.advanced_filters_applied=e},getAdvancedFiltersCnt:v,clearAdvancedFilters:function(){h={},this.shared.advanced_filters_applied={},a(),v()},clearFilters:function(){a(),this.shared.advanced_filters_applied={},o=[],d=[]},getHTTPFilters:function(){return{filters:r}},applyHTTPFilters:function(e){return r.date=e,r.location=o,r.hftypes=d,r.advanced=[],_.forEach(this.shared.advanced_filters_applied,function(e,t){var a={};a[t]=e.join(),r.advanced.push(a)}),{filters:r}}}}]),angular.module("app-herams").service("HFMapSvc",["$rootScope","$state","$timeout","$window","$compile","$log","esriSvc","commonSvc",function(e,t,a,r,n,o,i,s){var l,c,u;return{createMap:function(e,t){for(var a in c=CONFIG.overview.map,(l=L.map(e)).zoomControl.setPosition("topright"),c.basemaps)L.tileLayer(c.basemaps[a]).addTo(l);i.getEsriShape(l,c.layers[0]),function(e,t){var a=t.hf_list,r=t.config.colors,n=[];for(var o in a){var i=L.divIcon({className:"herams-marker-icon",html:'<i class="fas fa-circle" style="color:'+r[a[o].type]+'"></i>'});L.marker(a[o].coord,{icon:i}).addTo(e),n.push(a[o].coord)}var s=n.length<200?n.length:200;u=new L.LatLngBounds(n.slice(0,s)),e.fitBounds(u)}(l,t),this.refreshLayout()},refreshLayout:function(){var e=$(window).height()-280;e=550<e?e:550,$(".main-content").height(e),$(".map-container").height(e);var t=$(".map-container").innerHeight();$("#mapid-wkspace").height(t),l&&l.invalidateSize(),l&&l.fitBounds(u)}}}]),angular.module("app-herams").directive("hfmap",["$log",function(e){return{templateUrl:"/js/overview/directives/hf-map.html",restrict:"E",replace:!0,scope:!0,link:function(a){a.legend=[],a.$watch("mapdata",function(e){if(e.config)for(var t in e.config.legend)a.legend.push(e.config.legend[t])})}}}]),angular.module("app-herams").directive("advancedSearch",["$log","filtersSvc",function(u,d){var p={};return{templateUrl:"/js/overview/directives/filters/advanced_search.html",restrict:"E",replace:!0,scope:{data:"="},controller:["$scope",function(n){n.data=d.shared;var a={},r=0,o=0;function i(e,t){return a[e][t]}function s(e){var t;return a[e]||(o=0,a[t=e]={},_.forEach(d.shared.advanced_filters_src[t],function(e){a[t][e.code]=r+"-"+o,o++}),r++),d.shared.advanced_filters_src[e]}n.getQClass=i,n.getQuestions=s,n.$on("setFiltersCleared",function(e){p={},0<d.getAdvancedFiltersCnt()&&d.clearAdvancedFilters()});function l(e,t){return!!p[e]&&-1!=p[e].indexOf(t)}function c(e,t){var a=_.find(d.shared.advanced_filters_src[e],{code:t});if(a.answers){var r=a.answers.length;return p[t]?p[t].length==r?1:2:0}}n.trimQuestiontxt=function(e){var t=e.replace(/(<([^>]+)>)/gi,"");return t.length<=150?t:t.substr(0,150)+"[...]"},n.isSelected=l,n.checkItem=function(e,t,a){var r,n,o,i;l(t,a)?(o=t,i=a,_.pull(p[o],i),p[o].length<1&&delete p[o]):(n=a,p[r=t]||(p[r]=[]),p[r].push(n)),d.updtAdvancedFilters(p),e.stopPropagation()},n.getGroupCnt=function(e){var t=0,a=n.getQuestions(e);return _.forEach(_.map(a,"code"),function(e){p[e]&&(t+=p[e].length)}),0==t?"":" ("+t+")"},n.getQStatus=c,n.selectAllQ=function(e,t,a){var r=_.find(d.shared.advanced_filters_src[t],{code:a});0<c(t,a)?delete p[a]:p[a]=_.map(r.answers,"code"),d.updtAdvancedFilters(p),e.stopPropagation()},n.greyoutCls=function(e){var t="";return s(e).length<1&&(t+=" greyed-out"),t},n.setGroupClass=function(e){return"cls_"+e},n.toggleQuestions=function(e,t,a){if(0<s(a).length){var r=$(".group-question-list.filtermode.cls_"+t);"none"==$(r).css("display")?$(r).css("display","block"):$(r).css("display","none"),n.isExpanded||(n.isExpanded=!0)}},n.toggleAnswers=function(e,t,a){var r=i(t,a),n=$(".question-answers-list."+r);u.info("toggleAnswers / ",r,"\n - elt: ",n," - show: ",n.css("display")),"none"==$(n).css("display")?$(n).css("display","block"):$(n).css("display","none")},n.isGrpOpened=function(e){var t=$(".group-question-list.filtermode.cls_"+e);return"block"==$(t).css("display")},n.isExpanded=!1,n.expandAllGrps=function(){var e,t=$(".group-question-list.filtermode"),a=1==n.isExpanded?"none":"block";_.forEach(t,function(e){$(e).css("display",a)}),"block"==a&&(e=$(".question-answers-list"),_.forEach(e,function(e){$(e).css("display","block")})),n.isExpanded=!n.isExpanded},n.isQExpanded=function(e){var t=$(".question-answers-list."+e);return"block"==$(t).css("display")},n.setQChckBx=function(e,t){var a;switch(c(e,t)){case 0:a="img/filters/select_off.png";break;case 1:a="img/filters/select_all.png";break;case 2:a="img/filters/select_partial.png"}return a},n.setAChckBx=function(e,t){return l(e,t)?"img/filters/select_all.png":"img/filters/select_off.png"}}]}}]),angular.module("app-herams").directive("datepicker",["$log",function(e){return{templateUrl:"/js/overview/directives/filters/datepicker.html",restrict:"E",replace:!0,scope:{dt:"=date"},controller:["$scope",function(e){e.showing=!1,e.dateOptions={formatYear:"yyyy-MM-dd",maxDate:new Date,startingDay:1,showWeeks:!1},e.togglePicker=function(){e.showing=!e.showing}}]}}]),angular.module("app-herams").directive("dropdown",["$log","filtersSvc",function(e,t){var s;return{templateUrl:"/js/overview/directives/filters/dropdown.html",restrict:"E",replace:!0,scope:{icon:"@icon",value:"@value",type:"@type"},controller:["$scope",function(e){e.getValue=function(){return t.getFilterGlobalValue(e.type)}}],link:function(e,t,a){var r=t.find(".filter-value"),n=t.parent().attr("class"),o=$(".filters-popover."+n),i=1<o.children().length?"flex":"block";r.on("click",function(e){"none"==o.css("display")?o.css("display",i):o.css("display","none"),s&&($(s).css("display","none"),s=null),o.css("display")==i&&(s=o),e.stopPropagation(),$("ul.uib-datepicker-popup").remove()}),$("body").on("click",function(){s&&($(s).css("display","none"),s=null)})}}}]),angular.module("app-herams").directive("filtersPopover",["$log","filtersSvc",function(r,n){function i(e,t){$(t.itemClicked).parent().addClass("selected"),$(e).css("display","block");var a,r=$(t.itemClicked).attr("data-label");(a=e,angular.element($(a).find(".popover-hdr")).scope()).updtItems(n.getSubLocations(r))}return{templateUrl:"/js/overview/directives/filters/filters_popovers.html",restrict:"E",replace:!0,scope:{title:"@",openNext:"@",type:"@",items:"=",grouped:"=",singlechoice:"@"},controller:["$scope",function(a){a.updtItems=function(e){a.items=e},a.checkItem=function(e,t){n.getItemStatus(t,a.type)?n.rmvFilter(t,a.type):n.addFilter(t,a.type),e.stopPropagation()},a.isSelected=function(e){return n.getItemStatus(e,a.type)},a.getLevelStatus=function(){if(a.items){var e=n.getLocationLevel(a.items[0]);if(a.droplevel=e)return n.getLevelLocationStatus(e)}},a.checkLevel=function(e){var t=n.getLocationLevel(a.items[0]);t&&n.checkLocationLevel(t),e.stopPropagation()},a.getHFColor=n.getHFColor,a.setItemChckBx=function(e){var t;switch(r.info("setChckBx: ",e," - ",status),a.isSelected(e)){case 0:t="img/filters/select_off.png";break;case 1:t="img/filters/select_all.png";break;case 2:t="img/filters/select_partial.png"}return t},a.setChckBx=function(e){var t;switch(e){case 0:t="img/filters/select_off.png";break;case 1:t="img/filters/select_all.png";break;case 2:t="img/filters/select_partial.png"}return t}}],link:function(e,t,a){if(e.grouped){var r,n=e.openNext;if(n)var o=$(n).attr("title");else $(t).css("display","none");e.clickFilter=function(e){e.stopPropagation(),e.currentTarget!=r&&$(r).parent().removeClass("selected"),n?"block"==$(n).css("display")&&e.currentTarget==r?($(n).css("display","none"),$(e.currentTarget).parent().removeClass("selected"),r=null):(r=e.currentTarget,i(n,{itemClicked:e.currentTarget,title:o})):$(t).css("display","none")}}}}}]),angular.module("app-herams").directive("advancedFiltersList",["$log","$timeout","filtersSvc",function(t,e,a){return{templateUrl:"/js/overview/directives/filters/list_advanced_filters.html",restrict:"E",replace:!0,scope:!0,controller:["$scope",function(n){function o(e){var t=_.map(n.data.advanced_filters_src[e],"code"),a=_.keys(n.data.advanced_filters_applied);return _.intersectionWith(t,a,_.isEqual)}n.data=a.shared,n.grpHasSelection=function(e){return 0<o(e).length},n.grpSelectCnt=function(e){var t=o(e),a=0;for(var r in t)a+=n.data.advanced_filters_applied[t[r]].length;return a},n.getQuestions=function(e){return t.info("List Advanced Filters:\n getQuestions(",e,") : ",n.data.advanced_filters_src[e]),n.data.advanced_filters_src[e]},n.isFilterQ=function(e){return null!=n.data.advanced_filters_applied[e]},n.isFilterA=function(e,t){return-1!=n.data.advanced_filters_applied[e].indexOf(t)}}]}}]);