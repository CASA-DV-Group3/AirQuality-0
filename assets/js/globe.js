var osm = new og.layer.XYZ("OpenStreetMap", {
    isBaseLayer: true,
    url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    visibility: true,
    attribution: 'Data @ OpenStreetMap contributors, ODbL'
});

var globus = new og.Globe({
    "target": "globus",
    "name": "Earth",
    "terrain": new og.terrain.GlobusTerrain(),
    "layers": [osm],
    "autoActivated": true
});

new og.layer.Vector("Markers", {
    clampToGround: true
})
    .addTo(globus.planet)


globus.planet.viewExtentArr([5.54,45.141,5.93,45.23]);