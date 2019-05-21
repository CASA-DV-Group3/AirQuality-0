
// basemap variables
var animap;
var bounds;
var zoomLat = 36.4156;
var zoomLng = 122.7590;
var zoomLevel = 6;
// layer variables
var marker;
var markerLayer;

// load data variables
var datas = [];
var data;
var data01;
var data02;
var data03;
var data04;
var data05;
var data06;
var data07;
var data08;
var data09;
var data10;
var data11;


// animation control variables
var counter = 0;
var n = 0;

// styling variables
// var color;
var color1 = '#74F051';
var color2 = '#E52E2D';

function preload() {
    // Preload geojson data from github
    data01 = loadJSON('../assets/data/stationData/STATIONdata2000_merged.geojson');
    data02 = loadJSON('../assets/data/stationData/STATIONdata2001_merged.geojson');
    data03 = loadJSON('../assets/data/stationData/STATIONdata2002_merged.geojson');
    data04 = loadJSON('../assets/data/stationData/STATIONdata2003_merged.geojson');
    data05 = loadJSON('../assets/data/stationData/STATIONdata2004_merged.geojson');
    data06 = loadJSON('../assets/data/stationData/STATIONdata2005_merged.geojson');
    data07 = loadJSON('../assets/data/stationData/STATIONdata2006_merged.geojson');
    data08 = loadJSON('../assets/data/stationData/STATIONdata2007_merged.geojson');
    data09 = loadJSON('../assets/data/stationData/STATIONdata2008_merged.geojson');
    data10 = loadJSON('../assets/data/stationData/STATIONdata2009_merged.geojson');
    data11 = loadJSON('../assets/data/stationData/STATIONdata2010_merged.geojson');
}

function setup() {
    // Create the base map
    bounds = L.latLngBounds(L.latLng(-90.0, 180.227), L.latLng(90.0, -180.125));
    animap = L.map('mapid', {
        maxBounds: bounds,
        maxZoom: 10,
        minZoom: 2}).setView([zoomLat, zoomLng], zoomLevel);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1IjoidWNmbnpseSIsImEiOiJjanZ4emd0NDkwMXViM3ltbnludjRyNHFuIn0.HqhJ2fe_OAaO_opl87cZbg'
    }).addTo(animap);
    // Set up the zoom events
        // disable scrollWheelZoom
    animap.scrollWheelZoom.disable();
        // enable click to zoom
    animap.on('dblclick', function() {
        if (animap.scrollWheelZoom.enabled()) {
            animap.scrollWheelZoom.disable();
        }
        else {
            animap.scrollWheelZoom.enable();
        }
    });
    // Initialise the layers
    markerLayer = L.layerGroup().addTo(animap);

    // Prepare the data
    datas.push(data01);
    datas.push(data02);
    datas.push(data03);
    datas.push(data04);
    datas.push(data05);
    datas.push(data06);
    datas.push(data07);
    datas.push(data08);
    datas.push(data09);
    datas.push(data10);
    datas.push(data11);

    // set up the color value
    color1 = color(color1);
    color2 = color(color2); // red, 200
}

function draw() {
    // set the refresh rate of the draw()
    // frameRate(30); // refresh every 1/30 second (30 times in 1 second)


    console.log(n);
    data = datas[n];
    runCounter();// switch data in datas

    // draw time counter and background box
    fill(color1);
    rectMode(CORNERS);
    rect(width*.95-50, 0, width*.95, 20);
    // fill(255);
    // textSize(20);
    // textAlign(LEFT, CENTER);
    // text(data.features[484].properties.time, width*.01, height*.93);

    if (markerLayer) {
        // markerLayer.remove();
        markerLayer.clearLayers();
    }

    // plot the points
    for (let station of data.features) {
        let aqi = station.properties.aqi;
        let r = sqrt(aqi/3);
        let colorp = lerpColor(color1,color2,aqi/200).toString('#rrggbb');
        L.circleMarker([station.geometry.coordinates[1], station.geometry.coordinates[0]], {
            radius: r,
            stroke: false,
            fillColor: colorp,
            fillOpacity: 0.5}).addTo(markerLayer);
    }

}


// counter loop
function runCounter() {
    if (n < 10) {
        n = n + 1;
    } else {
        // noLoop();
        n = 0;
    }
}
// function runCounter(k) {
//     if (counter < k) {
//         counter = counter + 1;
//     } else {
//         counter = 0;
//         if (n < 10) {
//             n = n + 1;
//         } else {
//             n = 0;
//             // n = 0;
//         }
//     }
// }