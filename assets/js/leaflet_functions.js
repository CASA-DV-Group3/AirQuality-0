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


// Function for mapping colors to the currency values returned from the API for each country
function getColor(d) {
    return d > 200 ? '#540018' :
        d > 150 ? '#800026' :
            d > 100 ? '#BD0026' :
                d > 50 ? '#E31A1C' :
                    d > 20 ? '#FC4E2A' :
                        d > 10 ? '#FD8D3C' :
                            d > 1 ? '#FEB24C' :
                                 '#d3d1c6';
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
            fillColor: getColor(row['properties']['aqi']),
            color: "#000000",
            weight: 0.1,
            opacity: 1,
            fillOpacity: 0.5
        };
        if (cityList.includes(row['properties']['city'].toLowerCase())) {
            console.log(row['properties']['city']);
        } else {
            let marker = L.circleMarker([lat, lng], geojsonMarkerOptions).addTo(mymap).bindPopup("<div>The Air Quality is:<br>Bar graph</div>");
        }

    });
}

