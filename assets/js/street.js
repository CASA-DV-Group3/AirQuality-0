mapboxgl.accessToken = 'pk.eyJ1IjoidWN6bHFqdSIsImEiOiJjam4zOXRjMHUwY3htM3BteXgxazVxZ3QzIn0.mmRn_HjpXDzMJrKj1apGNQ';
var map = new mapboxgl.Map({
    container: 'streetview',
    style: 'mapbox://styles/uczlqju/cjv3rkko11j721fqr3s1xekl1',
    center: [-0.125, 51.515],
    zoom: 12,
    minZoom: 12,
    maxZoom: 15,
    pitch: 0,
    attributionControl: false
});



// Set default parameters of map-loading function
var layerField = 'NO2a_15';
var layerHeight = ['/', ['number', ['get', layerField], 0.2], 0.2];

map.on('load', function() {
    // Set global light properties which influence 3D layer shadows
    map.setLight({color: "#fff", intensity: 0.15, position: [1.15, 210, 30]});
    // Add standard navigation control
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Load the 3D employment hexagon layer as a fill-extrusion type
    map.addLayer({
        id: 'buildings',
        type: 'fill-extrusion',
        source: {
            type: 'vector',
            url: 'mapbox://uczlqju.avjs4m4m' // Your Mapbox tileset Map ID
        },
        'source-layer': 'MM_CentralLondonHeights', // name of tileset
        paint: {
            'fill-extrusion-color': '#919191',
            'fill-extrusion-height': ['/', ['number', ['get', 'relh2'], 1], 1],  //expression that controls the extrusion height based on attribute
            'fill-extrusion-opacity': 1,
            'fill-extrusion-opacity-transition': {  //Opacity transition adds a delay when changing the opacity for a smooth layer change effect
                duration: 1000,
                delay: 0
            }
        }
    });

    map.addLayer({
        id: 'airQuality',
        type: 'fill-extrusion',
        source: {
            type: 'vector',
            url: 'mapbox://uczlqju.9ukw2j2y' //  Mapbox tileset Map ID
        },
        'source-layer': 'AirQualityInv-5jeqo4', // name of tileset
        paint: {
            'fill-extrusion-color': {
                property: layerField,
                type: 'exponential',
                stops: [
                    [0, '#32e458'],
                    [10, '#32e458'],
                    [30, '#eab71f'],
                    [40, '#e55720'],
                    [80, '#bf1c1c'],
                    [100, '#800d2d'],
                    [800, '#441038']]
            },
            'fill-extrusion-height': layerHeight,  //expression that controls the extrusion height based on attribute
            'fill-extrusion-opacity': 0.8,
            'fill-extrusion-opacity-transition': {  //Opacity transition adds a delay when changing the opacity for a smooth layer change effect
                duration: 1000,
                delay: 0
            }
        }
    });

    map.addLayer({
        'id': 'labels',
        'type': 'symbol',
        source: {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-streets-v8'
        },
        'source-layer': 'place_label',
        'layout': {
            'text-field': '{name_en}',
            'text-font': ['Open Sans Bold', 'Roboto Medium'],
            'text-size': 12
        },
        'paint': {
            'text-color': 'rgba(0,0,0,0.6)',
        }
    });

    map.addSource('highPollutant', {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "marker-color": "#800000",
                        "marker-size": "medium",
                        "marker-symbol": "circle-stroked",
                        "name": "Euston Road"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -0.1329517364501953,
                            51.52646129946882
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "marker-color": "#800000",
                        "marker-size": "medium",
                        "marker-symbol": "",
                        "name": "Stand"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -0.12067794799804688,
                            51.51066556016948
                        ]
                    }
                },
                {
                    "type": "Feature",
                    "properties": {
                        "marker-color": "#800000",
                        "marker-size": "medium",
                        "marker-symbol": "",
                        "name": "Oxford Street"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -0.14453887939453125,
                            51.514925474796925
                        ]
                    }
                }
            ]
        }
    });

    // Add the makers of high pollution places
    map.addLayer({
        "id": "placemakers",
        "type": "circle",
        "source": "highPollutant",
        "filter": ["==", "$type", "Point"],
        'paint': {
            "circle-radius": 4,
            "circle-color": "#FFFFFF",
            "circle-stroke-width": 4,
            "circle-stroke-color": "#400600"
        }
    });

    map.addLayer({
        "id": "placename",
        "type": "symbol",
        "source": "highPollutant",
        "filter": ["==", "$type", "Point"],
        'layout': {
            'symbol-placement': "point",
            //'text-variable-anchor': "bottom",
            'text-offset':[0,-1.2],
            'text-field': '{name}',
            'text-font': ['Open Sans Bold', 'Roboto Medium'],
            'text-size': 16
        },
        'paint': {
            'text-color': 'rgba(255,255,255,0.91)',
            'text-halo-color': 'rgba(27,27,27,0.91)',
            'text-halo-width': 1
        }
    });


    var layerList = document.getElementsByClassName("collapsible");
    var yearList = document.getElementsByClassName("radiobutton");

    var buttonID = 'NO2a';

    for (var i = 0; i < layerList.length; i++) {
        var radioID;
        if (document.getElementById('2011').checked) {
            radioID = '2011';
        }
        else if (document.getElementById('2008').checked) {
            radioID = '2008';
        }
        else {
            radioID = '2015';
        }

        layerList[i].addEventListener('click', function(e) {
            buttonID = e.target.id;

            layerField = buttonID + "_" + radioID.substring(2);
            layerField = layerField.replace(/\s/g,'');

            if (buttonID === 'NOX'){
                layerHeight = ['/', ['number', ['get', layerField], 0.7], 0.7];
            }
            else if (buttonID === 'PM10a' || buttonID === 'PM25e'){
                layerHeight = ['/', ['number', ['get', layerField], 0.05], 0.05];
            }
            else {
                layerHeight = ['/', ['number', ['get', layerField], 0.2], 0.2];
            }
            var paintDesign = {
                property: layerField,
                type: 'exponential',
                stops: [
                    [0, '#32e458'],
                    [10, '#32e458'],
                    [30, '#eab71f'],
                    [40, '#e55720'],
                    [80, '#bf1c1c'],
                    [100, '#800d2d'],
                    [800, '#441038']]
            };

            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            };

            map.setPaintProperty('airQuality','fill-extrusion-color', paintDesign);
            map.setPaintProperty('airQuality','fill-extrusion-height', layerHeight);
        })
    }




    for (var i = 0; i < yearList.length; i++) {

        yearList[i].addEventListener('click', function(e) {
            let radioID = e.target.id;

            layerField = buttonID + "_" + radioID.substring(2);
            layerField = layerField.replace(/\s/g,'');

            if (buttonID === 'NOX'){
                layerHeight = ['/', ['number', ['get', layerField], 0.7], 0.7];
            }
            else if (buttonID === 'PM10a' || buttonID === 'PM25e'){
                layerHeight = ['/', ['number', ['get', layerField], 0.05], 0.05];
            }
            else {
                layerHeight = ['/', ['number', ['get', layerField], 0.2], 0.2];
            }

            var paintDesign = {
                property: layerField,
                type: 'exponential',
                stops: [
                    [0, '#32e458'],
                    [10, '#32e458'],
                    [30, '#eab71f'],
                    [40, '#e55720'],
                    [80, '#bf1c1c'],
                    [100, '#800d2d'],
                    [800, '#441038']]
            };

            map.setPaintProperty('airQuality','fill-extrusion-color', paintDesign);
            map.setPaintProperty('airQuality','fill-extrusion-height', layerHeight);
        })
    }

    // The action for view buttons
    document.getElementById("3D").addEventListener('click', function(e){
        let viewAngle = 50;
        let zoomSize = 13;
        let cor = [-0.12, 51.52];
        map.flyTo({
            centre: cor,
            zoom: zoomSize,
            pitch: viewAngle,
            speed: 0.2, // make the flying slow
            curve: 1, // change the speed at which it zooms out
        });
    });

    document.getElementById("top").addEventListener('click', function(e){
        let viewAngle = 0;
        let zoomSize = 12;
        let cor = [-0.115, 51.515];
        map.flyTo({
            centre: cor,
            zoom: zoomSize,
            pitch: viewAngle,
            speed: 0.2, // make the flying slow
            curve: 1, // change the speed at which it zooms out
        });
    });


});
