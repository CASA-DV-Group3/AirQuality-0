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

function changeOpacity(d) {
    return d > 400 ? 1:
        d > 300 ? 0.8 :
            d > 200 ? 0.7 :
                d > 100 ? 0.6 :
                    d > 50 ? 0.5 :
                        0.3;
}

function subsetAirQualityData(data, qv) {
    var subsetData = [];
    var counter = 0;
    data['features'].forEach(function(feat) {
        if (feat['properties']['q_vals'] == qv) {
            subsetData[counter] = feat
            counter++
        }

    });
    return subsetData
}
var layerMarkers = L.layerGroup([]);


function loadNewData() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/data/testAPIdata.geojson', false);
    xhr.send();
    let geojsonDATA = JSON.parse(xhr.responseText);
    if (layerMarkers) {
        layerMarkers.remove()
    }
    // create marker layer group
    layerMarkers = L.layerGroup([]);
    geojsonDATA['features'].forEach(function(row){
        let lat = Number(row['geometry']['coordinates'][0]);
        let lng = Number(row['geometry']['coordinates'][1]);
        let geojsonMarkerOptions = {
            radius: Math.log(row['properties']['aqi']),
            fillColor: getColor(row['properties']['aqi']),
            color: "#000000",
            weight: 0.1,
            opacity: 1,
            fillOpacity: changeOpacity(row['properties']['aqi'])
        };

        let marker = L.circleMarker([lat, lng], geojsonMarkerOptions).bindPopup("<div id='graphpopup'>The Air Quality is:"+row['properties']['aqi']+"<br><button onclick='console.log('hello')'>A Button</button>Bar graph</div>");
        layerMarkers.addLayer(marker);
    });
    mymap.addLayer(layerMarkers);
}


function loadAirQualityData(qVal) {
    // qval is a list of quantile values based on the buttons that have been clicked
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/data/aqi_shape_q.geojson', false);
    xhr.send();
    let geojsonDATA = JSON.parse(xhr.responseText);
    var subsetData;
    if (layerMarkers) {
        layerMarkers.remove()
    }
    // create marker layer group
    layerMarkers = L.layerGroup([]);
    qVal.forEach(function (qv) {
        subsetData = subsetAirQualityData(geojsonDATA, qv);

        subsetData.forEach(function(row){
            let lat = Number(row['geometry']['coordinates'][1]);
            let lng = Number(row['geometry']['coordinates'][0]);
            let geojsonMarkerOptions = {
                radius: Math.log(row['properties']['aqi']),
                fillColor: getColor(row['properties']['aqi']),
                color: "#000000",
                weight: 0.1,
                opacity: 1,
                fillOpacity: changeOpacity(row['properties']['aqi'])
            };

            let marker = L.circleMarker([lat, lng], geojsonMarkerOptions).bindPopup("<div id='graphpopup'>The Air Quality is: "+row['properties']['aqi']+" AQI <br><button onclick='console.log('hello')'>A Button</button>Bar graph</div>");
            layerMarkers.addLayer(marker);
        });
    });
    mymap.addLayer(layerMarkers);
}


