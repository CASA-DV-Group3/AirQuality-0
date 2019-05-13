/*
* Contains all needed functions for the main leaflet maps
*/


function addControlPlaceholders(map) {
    var corners = map._controlCorners,
        l = 'leaflet-',
        container = map._controlContainer;

    function createCorner(vSide, hSide) {
        var className = l + vSide + ' ' + l + hSide;
        corners[vSide + hSide] = L.DomUtil.create('div', className, container);
    }

    createCorner('verticalcenter', 'left');
    createCorner('verticalcenter', 'right');
}

var district_boundary = new L.geoJson();
district_boundary.addTo(map);

$.ajax({
    dataType: "json",
    url: "data/district.geojson",
    success: function(data) {
        $(data.features).each(function(key, data) {
            district_boundary.addData(data);
        });
    }
}).error(function() {});