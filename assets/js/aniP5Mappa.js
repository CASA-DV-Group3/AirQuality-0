// basemap variables
var key = 'pk.eyJ1IjoidWNmbnpseSIsImEiOiJjanZ4emd0NDkwMXViM3ltbnludjRyNHFuIn0.HqhJ2fe_OAaO_opl87cZbg';
// world view
var zoomLat = 30;
var zoomLng = 18;
var zoomLevel = 1.5;
// var zoomLat = 31.2243;
// var zoomLng = 120.9162;
// var zoomLevel = 8;
var mapStyle = 'mapbox://styles/mapbox/dark-v9';
const mappa = new Mappa('MapboxGL', key);
var canvas;
var animap; // Mappa object
var mbmap; // MapboxGL object

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

// mousePressed - flyTo function control variables
var pressC = 0;
var locs = [
    [18, 30],
    [18.5797, 48.2197],
    [-94.1777, 40.9867],
    [93.8556, 20.9441],
    [112.4017, 31.5683],
    [120.9162, 31.2243]
];
var zooms = [1.5, 4, 4, 4, 4, 8];
// World - [18, 30], 1.5
// Europe - [18.5797, 48.2197], 4
// North America (US) - [-94.1777, 40.9867], 4
// South Asia (India & China) - [93.8556, 20.9441], 4
// East Asia (China & Japan) - [112.4017, 31.5683], 4
// City (Shanghai) - [120.9162, 31.2243], 8


// styling variables
// var color;
var color1 = '#74F051';
var color2 = '#E52E2D';

// button variables
var button;

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
    // Create basemap and canvas
    canvas = createCanvas(windowWidth, windowHeight);
    animap = mappa.tileMap({
        lat: zoomLat,
        lng: zoomLng,
        zoom: zoomLevel,
        studio: false, // false to use non studio styles
        style: mapStyle
    });
    animap.overlay(canvas);
    // console.log(animap);

    // Need setTimeout function to define the mapbox object (animap.map), otherwise it will be undefined
    setTimeout(function() {
        mbmap = animap.map;
        mbmap.scrollZoom.disable();
        mbmap.keyboard.disableRotation();
        mbmap.removeLayer("settlement-label");
        mbmap.removeLayer("settlement-subdivision-label");
    }, 5000);

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

    // button = createButton('Fly');
    // button.position(width-250, 60);
    // button.mousePressed(FlyToRegion);
}

function draw() {
    // clear all the drawings on the canvas first
    clear();

    // set the refresh rate of the draw()
    // frameRate(30); // refresh every 1/30 second (30 times in 1 second)

    // console.log(n);
    data = datas[n];
    runCounter(5);// switch data in datas

    // draw time counter and background box on the Upper-Right
    fill(10, 200);
    rectMode(CORNERS);
    rect(width-270, 0, width-20, 40);
    // rect(width*0, height*.90, width*.16, height);
    fill(255);
    textSize(20);
    textAlign(LEFT, CENTER);
    text(data.features[484].properties.time, width-250, 20);

    // plot the points
    for (let station of data.features) {
        let aqi = station.properties.aqi;
        let r = sqrt(aqi);
        let colorp = lerpColor(color1,color2,aqi/200);
        colorp.setAlpha(100);
        fill(colorp)
        noStroke();
        let position = animap.latLngToPixel(station.geometry.coordinates[1], station.geometry.coordinates[0]);
        ellipse(position.x,position.y,r,r);
    }

}


// counter loop to control the update rate
function runCounter(k) {
    if (counter < k) {
        counter = counter + 1;
    } else {
        counter = 0;
        // clear();
        if (n < 10) {
            n = n + 1;
        } else {
            n = 0;
        }
    }
}
// function runCounter() {
//     if (n < 10) {
//         n = n + 1;
//         // clear();
//     } else {
//         // noLoop();
//         n = 0;
//     }
// }

// when mouse is pressed (Double Clicked), fly to different region (zoom: 4)
function mousePressed() {
    try {
        if (pressC < 6) {
            mbmap.flyTo({
                center: locs[pressC],
                zoom: zooms[pressC]
            });
            pressC = pressC + 1;
        } else {
            pressC = 0;
        }
    } catch (e) {}
}