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
    return  d > 300 ? '#8e6464' :
                d > 200 ? '#cf00ff' :
                    d > 150 ? '#fd0011' :
                        d > 100 ? '#ff8900' :
                            d > 50 ? '#fcfb0e' :
                                    '#1dff00';
}


function loadAirQualityData() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/data/aqi_shape.geojson', false);
    xhr.send();
    let geojsonDATA = JSON.parse(xhr.responseText);

    geojsonDATA['features'].forEach(function(row){
        let lat = Number(row['geometry']['coordinates'][1]);
        let lng = Number(row['geometry']['coordinates'][0]);
        let geojsonMarkerOptions = {
            radius: Math.log(row['properties']['aqi']),
            fillColor: getColor(row['properties']['aqi']),
            color: "#000000",
            weight: 0.1,
            opacity: 1,
            fillOpacity: 0.5
        };

        if (cityList.includes(row['properties']['station'].toLowerCase())) {
            let squareMarker = L.shapeMarker([lat, lng], {
                shape: "square",
                radius: Math.log(row['properties']['aqi'])**1.5,
                fillColor: getColor(row['properties']['aqi']),
                color: "#000000",
                weight: 0.5,
                opacity: 1,
                fillOpacity: 0.5
            }).addTo(mymap).bindPopup("<div>The Air Quality is:<br>Bar graph<br>View More</div>");

        } else {
            let marker = L.circleMarker([lat, lng], geojsonMarkerOptions).addTo(mymap).bindPopup("<div>The Air Quality is:<br>Bar graph</div>");
        }

    });
}

