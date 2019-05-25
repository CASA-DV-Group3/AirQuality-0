// basemap variables
var key = 'pk.eyJ1IjoidWNmbnpseSIsImEiOiJjanZ4emd0NDkwMXViM3ltbnludjRyNHFuIn0.HqhJ2fe_OAaO_opl87cZbg';
// world view
var zoomLat = 20;
var zoomLng = -10;
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
var aqi;
var time;

// animation control variables
var counter = 0;
var n = 0;

// mousePressed - flyTo function control variables
// var pressC = 0;
// var locs = [
//     [18, 30],
//     [18.5797, 48.2197],
//     [-94.1777, 40.9867],
//     [93.8556, 20.9441],
//     [112.4017, 31.5683],
//     [120.9162, 31.2243]
// ];
// var zooms = [1.5, 4, 4, 4, 4, 8];
// World - [18, 30], 1.5
// Europe - [18.5797, 48.2197], 4
// North America (US) - [-94.1777, 40.9867], 4
// South Asia (India & China) - [93.8556, 20.9441], 4
// East Asia (China & Japan) - [112.4017, 31.5683], 4
// City (Shanghai) - [120.9162, 31.2243], 8


// styling variables
// var color;
var color50 = '#74F051';
var color100 = '#d1ca1f';
var color150 ='#ca5c3b' ;
var color200 = '#E52E2D';
var color300 = '#8a2c59';
var color300plus = '#6d1682';
var colorp;
// size variable
var r;

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
    canvas = createCanvas(windowWidth, windowHeight).parent("map");
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
        mbmap.keyboard.disable();
        // mbmap.removeLayer("settlement-label");
        // mbmap.removeLayer("settlement-subdivision-label");
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
    color50 = color(color50);
    color100 = color(color100);
    color150 = color(color150);
    color200 = color(color200);
    color300 = color(color300);
    color300plus = color(color300plus);

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

    // plot the points
    for (let station of data.features) {
        aqi = station.properties.aqi;
        // colorp = lerpColor(color0,color200,aqi/200);
        // r = sqrt(aqi);
        if (aqi <= 50) {
            colorp = color50;
            r = 5;
        } else if (aqi <= 100) {
            colorp = color100;
            r = 10;
        } else if (aqi <= 150) {
            colorp = color150;
            r = 15;
        } else if (aqi <= 200) {
            colorp = color200;
            r = 20;
        } else if (aqi <= 300) {
            colorp = color300;
            r = 25;
        } else {
            colorp = color300plus;
            r = 30;
        }
        colorp.setAlpha(150);
        fill(colorp)
        noStroke();
        let position = animap.latLngToPixel(station.geometry.coordinates[1], station.geometry.coordinates[0]);
        ellipse(position.x,position.y,r,r);
    }

    // draw time counter and background box on the Upper-Right
    fill(52, 51, 50, 180);
    rectMode(CORNERS);
    // rect(width-270, 0, width-20, 40);
    rect(0,0,305,40);
    time = data.features[484].properties.time;
    fill(255);
    textSize(18);
    textFont('Helvetica');
    textAlign(LEFT, CENTER);
    text("Local Time: ", 10, 20);
    text(time, 110, 20);
    // text(data.features[484].properties.time, width-250, 20);
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

// // when mouse is pressed (Double Clicked), fly to different region (zoom: 4)
// function mousePressed() {
//     try {
//         if (pressC < 6) {
//             mbmap.flyTo({
//                 center: locs[pressC],
//                 zoom: zooms[pressC]
//             });
//             pressC = pressC + 1;
//         } else {
//             pressC = 0;
//         }
//     } catch (e) {}
// }
document.getElementById("world").addEventListener("click", function () {
    mbmap.flyTo({
        center: [-10, 20],
        zoom: 1.5
    });
})
document.getElementById("europe").addEventListener("click", function () {
    // time = data.features[484].properties.time;
    fill(255);
    textSize(18);
    textFont('Helvetica');
    textAlign(LEFT, CENTER);
    text("Local Time: ", 10, 40);
    text(time, 110, 40);
    mbmap.flyTo({
        center: [10.5797, 48.2197],
        zoom: 4
    });
})
document.getElementById("north america").addEventListener("click", function () {
    mbmap.flyTo({
        center: [-103, 40],
        zoom: 4
    });
})
document.getElementById("south asia").addEventListener("click", function () {
    mbmap.flyTo({
        center: [90, 22],
        zoom: 4
    });
})
document.getElementById("east asia").addEventListener("click", function () {
    mbmap.flyTo({
        center: [115, 32],
        zoom: 4
    });
})
