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


var quantileView = [];

// from https://github.com/CliffCloud/Leaflet.EasyButton
L.easyButton({
    id: "high",
    states: [{
        stateName: 'unchecked',        // name the state
        icon:      '&#919',               // and define its properties
        title:     'Highly Industrial Countries (Unchecked)',      // like its title
        onClick: function(btn, map) {       // and its callback
            var index = quantileView.indexOf(3);

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


L.easyButton({
    id: "playViz",
    states: [{
        stateName: 'unplayed',        // name the state
        icon:      '&#x25b6;',               // and define its properties
        title:     'Play',      // like its title
        onClick: function(btn, map) {       // and its callback
            console.log("Hello");
            btn.state('played');
        }
    }, {
        stateName: 'played',
        icon:      'fa-pause',
        title:     'Pause',
        onClick: function(btn, map) {
            console.log("Hello");
            btn.state('unplayed');
        }
    }]
}).addTo(mymap);