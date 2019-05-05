/*
* Contains functions needed for the globe
*/

var osm = new og.layer.XYZ("OpenStreetMap", {
    specular: [0.0003, 0.00012, 0.00001],
    shininess: 20,
    diffuse: [0.89, 0.9, 0.83],
    isBaseLayer: true,
    url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    visibility: true,
    attribution: 'Data @ OpenStreetMap contributors, ODbL'
});

var globus = new og.Globe({
    "target": "globus",
    "name": "Earth",
    "terrain": new og.terrain.GlobusTerrain(),
    "layers": [osm]
});

// add countries (Geo)JSON file with outline of countries
var countriesLayer = new og.layer.Vector("Countries", {
    'visibility': true,
    'isBaseLayer': false,
    'diffuse': [0, 0, 0],
    'ambient': [1, 1, 1]
});

countriesLayer.addTo(globus.planet);

// style the layer and zoom to extent on click
var f = countries[0].features;
for (var i = 0; i < f.length; i++) {
    var fi = f[i];
    countriesLayer.add(new og.Entity({
        'geometry': {
            'type': fi.geometry.type,
            'coordinates': fi.geometry.coordinates,
            'style': {
                'fillColor': "rgba(255,255,255,0.6)"
            }
        },
        'properties' : {
            'name' : fi.properties.ADMIN
        }
    }));
}

countriesLayer.events.on("mouseleave", function (e) {
    e.pickingObject.geometry.setFillColor(1, 1, 1, 0.6);
    e.pickingObject.geometry.setLineColor(0.2, 0.6, 0.8, 1.0);
});
countriesLayer.events.on("mouseenter", function (e) {
    e.pickingObject.geometry.bringToFront();
    e.pickingObject.geometry.setFillColor(1, 0, 0, 0.4);
    e.pickingObject.geometry.setLineColor(1, 0, 0, 1.0);
});
countriesLayer.events.on("lclick", function (e) {
    globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
});
countriesLayer.events.on("touchstart", function (e) {
    globus.planet.flyExtent(e.pickingObject.geometry.getExtent());
});

// box in top right corner
countriesLayer.events.on("mousemove", function (e) {
    if (e.pickingObject) {
        document.getElementById("layerName").innerHTML = e.pickingObject.properties.name;
    } else {
        document.getElementById("layerName").innerHTML = "";
    }
});


// fit to extent of json
// globus.planet.flyExtent(countriesLayer.getExtent());