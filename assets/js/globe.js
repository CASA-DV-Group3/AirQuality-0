// adapted from: https://jorin.me/d3-canvas-globe-hover/
// Configuration

// GLOBALS
var countries,
    points,
    countryList,
    land,
    first = true,
    graticule = d3.geoGraticule10();

function loadData(cb) {
    d3.json('../assets/data/world-110m.json', function(error, worldShape) {
        if (error) throw error;
        localStorage.setItem("worldShape", JSON.stringify(worldShape));

        cb(worldShape, countries);
    });

    d3.json('../assets/data/airpollutionDeaths.geojson', function(error, airPolDeaths) {
        if (error) throw error;
        localStorage.setItem("airPol", JSON.stringify(airPolDeaths));
        cb(airPolDeaths, countries);
    });
};


function loadAll(year) {
    if (document.getElementById('globe')) {
        d3.select("canvas").remove()
        d3.select("globe").remove();

    }

    var year = year;
    document.getElementById('canvasid').innerHTML = '<canvas id="globe" style="height: 100%; width: 100%;"></canvas>'; // replaces the inner HTML of #someBox to a canvas

    // ms to wait after dragging before auto-rotating
    var rotationDelay = 3000;
    // scale of the globe (not the canvas element)
    var scaleFactor = 0.9;
    // autorotation speed
    var degPerSec = 6;
    // start angles
    var angles = { x: -20, y: 40, z: 0};
    // colors
    var colorWater = 'rgba(66,142,255,0.62)';
    var colorLand = '#447139'
    var colorPoint = '#6d1371';
    var colorGraticule = 'rgba(204,204,204,0)';
    var colorCountry = 'rgba(1,0,9,0.2)';

    // year for data

    // Handler

    function enter(country) {

        current.text(country && country.properties.name || 'Please Hover Over a Country')
        let countryName = country.properties.name;
        let airPol = JSON.parse(localStorage.getItem("airPol"));
        let countrySubset = []
        airPol.features.forEach(function(val) {
            if (val.properties.country == countryName) {
                countrySubset.push(val)
            }
        });
        plotCountryAirPol(countrySubset);

    }

    function plotCountryAirPol(data) {
        // document.getElementById('current').innerHTML = "Hello";
        // set the dimensions and margins of the graph
        var margin = {top: 5, right: 5, bottom: 50, left: 40},
            width = 300 - margin.left - margin.right,
            height = 130 - margin.top - margin.bottom;

        // parse the date / time
        var parseTime = d3.timeParse("%y");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);


        // define the line
        var valueline = d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.deaths_per1000); });


        var svg = d3.select('#current').append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");



        data.forEach(function(d) {
            d.date = parseTime(d.year);
            d.deaths = +d.deaths_per1000;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.deaths; })]);

        // Add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

    }

    function leave(country) {
        current.text('Please Hover Over a Country')
    }

    // Variables

    var current = d3.select('#current'),
        canvas = d3.select('#globe'),
        context = canvas.node().getContext('2d'),
        water = {type: 'Sphere'},
        projection = d3.geoOrthographic().precision(0.1),
        path = d3.geoPath(projection).context(context),
        v0, // Mouse position in Cartesian coordinates at start of drag gesture.
        r0, // Projection rotation as Euler angles at start.
        q0, // Projection rotation as versor at start.
        lastTime = d3.now(),
        degPerMs = degPerSec / 1000,
        width, height,
        autorotate, now, diff, rotation,
        currentCountry;
    var geoGenerator = d3.geoPath()
        .projection(projection)
        .context(context);

    // Functions

    function setAngles() {
        var rotation = projection.rotate()
        rotation[0] = angles.y
        rotation[1] = angles.x
        rotation[2] = angles.z
        projection.rotate(rotation)
    }

    function scale() {
        width = document.documentElement.clientWidth
        height = document.documentElement.clientHeight
        canvas.attr('width', width).attr('height', height)
        projection
            .scale((scaleFactor * Math.min(width, height)) / 2)
            .translate([width / 2, height / 2])
        render()
    }

    function startRotation(delay) {
        autorotate.restart(rotate, delay || 0)
    }

    function stopRotation() {
        autorotate.stop()
    }

    function dragstarted() {
        v0 = versor.cartesian(projection.invert(d3.mouse(this)))
        r0 = projection.rotate()
        q0 = versor(r0)
        stopRotation()
    }

    function dragged() {
        var v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)))
        var q1 = versor.multiply(q0, versor.delta(v0, v1))
        var r1 = versor.rotation(q1)
        projection.rotate(r1)
        render()
    }

    function dragended() {
        startRotation(rotationDelay)
    }

    function render() {
        // for (var obj of canvas.getObjects()) {
        //     delete obj._cacheCanvas;
        // }
        // context.clear();

        context.clearRect(0, 0, width, height)
        fill(water, colorWater)
        stroke(graticule, colorGraticule)
        fill(land, colorLand)
        for (let i = 0; i < points.length; i++) {
            fillPoints(points[i], colorPoint, true)
        }

        if (currentCountry) {
            fill(currentCountry, colorCountry)
        }
    }

    function fill(obj, color) {
        context.beginPath()
        path(obj)
        context.fillStyle = color
        context.fill()
    }

    function fillPoints(obj, color) {
        var rad = getRadius(obj.properties.deaths_per1000);
        var apCol = getAPColor(obj.properties.deaths_per1000);
        var circle = d3.geoCircle().center([obj.geometry.coordinates[0], obj.geometry.coordinates[1]]).radius(rad);
        context.beginPath();
        // context.strokeStyle = apCol;
        geoGenerator(circle());
        context.fillStyle = apCol;
        context.stroke();
        context.fill();
    }

    function getRadius(d) {
        return  d > 100 ? 5 :
            d > 80 ? 4 :
                d > 60 ? 3 :
                    d > 40 ? 2 :
                        d > 20 ? 1 :
                            0.5;
    }

    function getAPColor(d) {
        return  d > 100 ? '#0c000e' :
            d > 80 ? '#40393c'  :
                d > 60 ? '#5e5e5e'  :
                    d > 40 ? '#807e7d'  :
                        d > 20 ? '#aaaaaa'  :
                            '#c6b9c8' ;
    }

    function stroke(obj, color) {
        context.beginPath()
        path(obj)
        context.strokeStyle = color
        context.stroke()
    }

    function rotate(elapsed) {
        now = d3.now()
        diff = now - lastTime
        if (diff < elapsed) {
            rotation = projection.rotate()
            rotation[0] += diff * degPerMs
            projection.rotate(rotation)
            render()
        }
        lastTime = now
    }

    function getCurrentData(data, year) {
        let returnData = [];
        data["features"].forEach(function(row){
            if (row["properties"]["year"] == year) {
                returnData.push(row);
            }
        })
        return returnData
        // function for getting current year of data
    }


    // https://github.com/d3/d3-polygon
    function polygonContains(polygon, point) {
        var n = polygon.length
        var p = polygon[n - 1]
        var x = point[0], y = point[1]
        var x0 = p[0], y0 = p[1]
        var x1, y1
        var inside = false
        for (var i = 0; i < n; ++i) {
            p = polygon[i], x1 = p[0], y1 = p[1]
            if (((y1 > y) !== (y0 > y)) && (x < (x0 - x1) * (y - y1) / (y0 - y1) + x1)) inside = !inside
            x0 = x1, y0 = y1
        }
        return inside
    }

    function mousemove() {
        var c = getCountry(this)
        if (!c) {
            if (currentCountry) {
                leave(currentCountry)
                currentCountry = undefined
                render()
            }
            return
        }
        if (c === currentCountry) {
            return
        }
        currentCountry = c
        render()
        enter(c)
    }

    function getCountry(event) {
        var pos = projection.invert(d3.mouse(event));
        return countries[0].features.find(function(f) {
            return f.geometry.coordinates.find(function(c1) {
                return polygonContains(c1, pos) || c1.find(function(c2) {
                    return polygonContains(c2, pos)
                })
            })
        })
    }

    function loadCanvas(year)
    {
        year = year || 1990;
        if (first) {
            loadData(function(world, cList) {
                countryList = cList;
                try {
                    land = topojson.feature(world, world.objects.land)
                    countryList = cList
                } catch (e) {
                    // this is for loading the point data
                    world = getCurrentData(world, year); // subset the data
                    let pointList = [];
                    world.forEach(function(pnt){
                        point = topojson.feature(world, pnt.geometry)
                        point['properties'] = pnt.properties
                        pointList.push(point)
                    });
                    points = pointList;
                }

                window.addEventListener('resize', scale)
                scale()
                autorotate = d3.timer(rotate)
                first = false
            });

        } else {
            // let worldShp = JSON.parse(localStorage.getItem("worldShape"));
            let airPol = JSON.parse(localStorage.getItem("airPol"));

            // land = topojson.feature(worldShp, worldShp.objects.land)
            airPol = getCurrentData(airPol, year); // subset the data
            let pointList = [];
            airPol.forEach(function(pnt){
                point = topojson.feature(airPol, pnt.geometry)
                point['properties'] = pnt.properties
                pointList.push(point)
            });
            points = pointList;

            window.addEventListener('resize', scale)
            scale()
            autorotate = d3.timer(rotate)
            }

        }

    loadCanvas(year)
    // Initialization
    setAngles()

    canvas
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )
        .on('mousemove', mousemove)


}
