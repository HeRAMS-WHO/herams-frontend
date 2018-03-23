angular.module('app-herams').service('LayerPopupSvc', function($timeout,$compile,$log,commonSvc) {

    var cnt;

    return {
        addPopup: function(map, maplayer, layerdata) {

            maplayer.on('mouseover', function(e) {

                if ($('.entry-popup.layer' + cnt).length <= 0) {

                    var popup_content = '<entry-popup countryname="' + layerdata.name + '"></entry-popup>';

                    var popup = L.popup({className: 'entry-popup layer' + cnt, closeButton: false})
                        .setLatLng([layerdata.geodata.lat, layerdata.geodata.long])
                        .setContent(popup_content)
                        .openOn(map);

                    $timeout(function () {
                        var scope = angular.element('.home').scope();
                        $compile(popup._contentNode)(scope);
                    });

                }
            });

            maplayer.on('mouseout', function(e) {
                if ($('.entry-popup.layer'+cnt).length>0) {
                    // this.setStyle(styleNormal);
                    $('.entry-popup.layer'+cnt).remove();
                }
            });

            maplayer.on('click', function(e) {
                $log.info('Let s go to next screen!!');
                commonSvc.gotoOverview();
            });
        }
    }
});