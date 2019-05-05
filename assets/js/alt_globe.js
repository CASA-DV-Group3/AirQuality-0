// source https://bl.ocks.org/john-guerra/43c7656821069d00dcbc
const width = 960;
const height = 500;
const config = {
    speed: 0.001,
    verticalTilt: -30,
    horizontalTilt: 0
}
let locations = [];
const svg = d3.select('svg')
    .attr('width', width).attr('height', height);
const markerGroup = svg.append('g');
const projection = d3.geoOrthographic();
const initialScale = projection.scale();
const path = d3.geoPath().projection(projection);
const center = [width/2, height/2];

// Define color scale
var color = d3.scaleLinear()
    .domain([1, 20])
    .clamp(true)
    .range(['#fff', '#409A99']);

// Get province name
function nameFn(d){
    return d && d.properties ? d.properties.ADMIN : null;
}

// Get province name length
function nameLength(d){
    var n = nameFn(d);
    return n ? n.length : 0;
}

// Get province color
function fillFn(d){
    return color(nameLength(d));
}


function mouseover(d){
    // Highlight hovered province
    d3.select(this).style('fill', 'orange');
    //
    // // Draw effects
    // textArt(nameFn(d));
}

function mouseout(d){
    // Reset province color
    svg.selectAll('path')
        .style('fill', function(d){return fillFn(d);});
}



drawGlobe();
drawGraticule();
enableRotation();

function drawGlobe() {
    d3.queue()
        .defer(d3.json, './world-110m.json')
        // .defer(d3.json, './countries.geojson')
        .await((error, worldData, locationData) => {
            // svg.selectAll(".segment")
            //     .data(topojson.feature(worldData, worldData.objects.countries).features)
            //     .enter().append("path")
            //     .attr("class", "segment")
            //     .attr("d", path)
            //     .style("stroke", "#888")
            //     .style("stroke-width", "1px")
            //     .style("fill", (d, i) => '#e5e5e5')
            //     .style("opacity", ".7");
            // locations = locationData[0];
            var features = countries[0].features;

            // Update color scale domain based on data
            color.domain([0, d3.max(features, nameLength)]);

            // Draw each province as a path
            svg.selectAll('path')
                .data(features)
                .enter().append('path')
                .attr('d', path)
                .attr('vector-effect', 'non-scaling-stroke')
                .style('fill', fillFn)
                .on('mouseover', mouseover)
                .on('mouseout', mouseout)
            // .on('click', clicked);
        });
}


function drawGraticule() {
    const graticule = d3.geoGraticule()
        .step([10, 10]);

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("fill", "#fff")
        .style("stroke", "#ccc");
}

function enableRotation() {
    d3.timer(function (elapsed) {
        projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
        svg.selectAll("path").attr("d", path);
    });
}