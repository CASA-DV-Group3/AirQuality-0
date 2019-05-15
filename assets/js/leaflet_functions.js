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


function loadAirQualityData() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/data/APIdata.geojson', false);
    xhr.send();
    let geojsonDATA = JSON.parse(xhr.responseText);

    geojsonDATA['features'].forEach(function(row){
        let lat = Number(row['geometry']['coordinates'][0]);
        let lng = Number(row['geometry']['coordinates'][1]);
        let geojsonMarkerOptions = {
            radius: Math.log(row['properties']['aqi'])**1.5,
            fillColor: "#ff7800",
            color: "#d98800",
            weight: 0,
            opacity: 1,
            fillOpacity: 0.5
        };
        let marker = L.circleMarker([lat, lng], geojsonMarkerOptions).addTo(mymap).bindPopup("<div>The Air Quality is:<br>Bar graph</div>");
    });
}
