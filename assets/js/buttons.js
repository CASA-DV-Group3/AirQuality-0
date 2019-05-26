mymap.scrollWheelZoom.disable();

// click to zoom
mymap.on('dblclick', function() {
    if (mymap.scrollWheelZoom.enabled()) {
        mymap.scrollWheelZoom.disable();
    }
    else {
        mymap.scrollWheelZoom.enable();
    }
});


var quantileView = [],
    highClicked = false,
    midClicked = false,
    lowClicked = false;

// from https://github.com/CliffCloud/Leaflet.EasyButton
L.easyButton({
    id: "high",
    states: [{
        stateName: 'unchecked',        // name the state
        icon:      '&#919',               // and define its properties
        title:     'Highly Industrial Countries (Unchecked)',      // like its title
        onClick: function(btn, map) {       // and its callback
            var index = quantileView.indexOf(3);
            highClicked = true;
            if (index > -1) {
                quantileView.splice(index, 1);
                loadAirQualityData(quantileView);
            } else {
                quantileView.push(3)
                loadAirQualityData(quantileView);
            }
            btn.state('checked');
        }
    }, {
        stateName: 'checked',
        icon:      'fa-check',
        title:     'Highly Industrial Countries (Checked)',
        onClick: function(btn, map) {
            var index = quantileView.indexOf(3);
            highClicked = false;
            if (index > -1) {
                quantileView.splice(index, 1);
                loadAirQualityData(quantileView);
            } else {
                quantileView.push(3)
                loadAirQualityData(quantileView);
            }
            btn.state('unchecked');
        }
    }]

}).addTo(mymap);

L.easyButton({
    id: "mid",
    states: [{
        stateName: 'unchecked',        // name the state
        icon:      '&#x0039C;',               // and define its properties
        title:     'Moderately Industrial Countries (Unchecked)',      // like its title
        onClick: function(btn, map) {       // and its callback
            var index = quantileView.indexOf(2);
            midClicked = true;
            if (index > -1) {
                quantileView.splice(index, 1);
                loadAirQualityData(quantileView);
            } else {
                quantileView.push(2)
                loadAirQualityData(quantileView);
            }
            btn.state('checked');
        }
    }, {
        stateName: 'checked',
        icon:      'fa-check',
        title:     'Moderately Industrial Countries (Checked)',
        onClick: function(btn, map) {
            var index = quantileView.indexOf(2);
            midClicked = false;

            if (index > -1) {
                quantileView.splice(index, 1);
                loadAirQualityData(quantileView);
            } else {
                quantileView.push(2)
                loadAirQualityData(quantileView);
            }
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);

L.easyButton({
    id: "low",
    states: [{
        stateName: 'unchecked',        // name the state
        icon:      '&#x00139;',               // and define its properties
        title:     'Least Industrial Countries (Unchecked)',      // like its title
        onClick: function(btn, map) {       // and its callback
            var index = quantileView.indexOf(1);
            lowClicked = true;
            if (index > -1) {
                quantileView.splice(index, 1);
                loadAirQualityData(quantileView);
            } else {
                quantileView.push(1)
                loadAirQualityData(quantileView);
            }
            btn.state('checked');
        }
    }, {
        stateName: 'checked',
        icon:      'fa-check',
        title:     'Least Industrial Countries (Checked)',
        onClick: function(btn, map) {
            var index = quantileView.indexOf(1);
            lowClicked = false;
            if (index > -1) {
                quantileView.splice(index, 1);
                loadAirQualityData(quantileView);
            } else {
                quantileView.push(1)
                loadAirQualityData(quantileView);
            }
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);


// L.easyButton({
//     id: "playViz",
//     states: [{
//         stateName: 'unplayed',        // name the state
//         icon:      '&#x25b6;',               // and define its properties
//         title:     'Play Analysis',      // like its title
//         onClick: function(btn, map) {       // and its callback
//             document.getElementById('infoDiv').innerHTML = "<h3>Text about the map</h3><h4>This is the first Page of the story</h4><button class=\"btn btn-outline-info btn-sm\" onclick=\"mymap.setView(new L.LatLng(40.737, -73.923), 8);\">Zoom to Layer</button>";
//             if (!lowClicked) {
//                 low.click();
//             }
//
//             btn.state('played');
//         }
//     }, {
//         stateName: 'played',
//         icon:      'fa-pause',
//         title:     'Pause Analysis',
//         onClick: function(btn, map) {
//             document.getElementById('infoDiv').innerHTML = " <h3>Global Air Quality Monitoring</h3><br>" +
//                 "                                    <h5>To load the mointoring station data click on one of the industrial grouping buttons on the left-hand side</h5><br>" +
//                 "                                    Air Quality Index (AQI) is used in this for an explanation of AQI groupings, visit <a id=\"aqiHover\" href=\"#d\" onclick=\"window.open(\\'https://www.ourair.org/sbc/the-air-quality-index/\\')\"><b>AQI index</b></a>" +
//                 "                                    ";
//             if (lowClicked) {
//                 low.click();
//             }
//             mymap.setView([20, 24], 2);
//             btn.state('unplayed');
//         }
//     }]
// }).addTo(mymap);

var high = document.getElementById("high");
var mid = document.getElementById("mid");
var low = document.getElementById("low");

// for about page
function on() {
    document.getElementById("about").style.display = "block";
}
function off() {
    document.getElementById("about").style.display = "none";
}