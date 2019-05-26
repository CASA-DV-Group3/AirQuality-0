/*
* Contains all needed functions for the main leaflet maps
*/

var title = "<h1>Invisible Cities</h1> <h3 class=\"title text-center\">World Air Quality</h3> <button type=\"button\" onclick=\"getStory('1');\" class=\"btn btn-outline-info\">Begin</button>"
// Function for mapping colors to the currency values returned from the API for each country
function getColor(d) {
    return  d > 300 ? '#8e6464' :
                d > 200 ? '#cf00ff' :
                    d > 150 ? '#fd0011' :
                        d > 100 ? '#ff8900' :
                            d > 50 ? '#fcfb0e' :
                                    '#1dff00';
}

function changeOpacity(d) {
    return d > 400 ? 1:
        d > 300 ? 0.8 :
            d > 200 ? 0.7 :
                d > 100 ? 0.6 :
                    d > 50 ? 0.5 :
                        0.3;
}


function subsetAirQualityData(data, qv) {
    var subsetData = [];
    var counter = 0;
    data['features'].forEach(function(feat) {
        if (feat['properties']['q_vals'] == qv) {
            subsetData[counter] = feat
            counter++
        }

    });
    return subsetData
}

var layerMarkers = L.layerGroup([]);


function loadAirQualityData(qVal) {
    // qval is a list of quantile values based on the buttons that have been clicked
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/data/stationData/STATIONdata2010_merged.geojson', false);
    xhr.send();
    let geojsonDATA = JSON.parse(xhr.responseText);
    var subsetData;
    if (layerMarkers) {
        layerMarkers.remove()
    }
    // create marker layer group
    layerMarkers = L.layerGroup([]);
    qVal.forEach(function (qv) {
        subsetData  = subsetAirQualityData(geojsonDATA, qv);

        subsetData.forEach(function(row){
            let lat = Number(row['geometry']['coordinates'][1]);
            let lng = Number(row['geometry']['coordinates'][0]);
            let geojsonMarkerOptions = {
                radius: Math.log(row['properties']['aqi']),
                fillColor: getColor(row['properties']['aqi']),
                color: "#000000",
                weight: 0.1,
                opacity: 1,
                fillOpacity: changeOpacity(row['properties']['aqi'])
            };
            let timeDate;
            try {
                timeDate = row['properties']['time'].split('T')
            } catch(e) {
                timeDate = ["date unknown", "time unknown"]
            }
            let so2 = row['properties']['so2'];
                no2 = row['properties']['no2'];
            if (so2 < 0) {
                so2 = "No Data Available"
            }

            if (no2 < 0) {
                no2 = "No Data Available"
            }
            let markerPopup = "<div id='graphpopup' style='width: 40vh;'><b>Station:</b> " + row['properties']['station'] +"<br><b>Station ID:</b> " + row['properties']['id'] +"<br><b>Latest Date: </b>" + timeDate[0] + "<br><b>Latest Time: </b>" + timeDate[1] + "<br><b>Current Air Quality Levels:</b><br><b style='color: #750082;'>AQI:</b> "+ row['properties']['aqi'] +" <br><b style='color: #208182;'>NO2: </b>" + no2 + "<br><b style='color: #822a1d;'>SO2: </b>" + so2 + "<br><div id='graphHere"+ row['properties']['id'] + "'>The Graph Goes Here</div><br></div>"
            //TODO: chose better style and add button
            // <button class='btn btn-light' onclick='mymap.setView([51.1, 0.12], 6);';>Load more data</button>
            let marker = L.circleMarker([lat, lng], geojsonMarkerOptions).bindPopup(markerPopup);
            let uniqueIDNumber = row['properties']['id'];
            marker.on('click', onMarkerClick );
            function onMarkerClick(e) {
                var popup = e.target.getPopup();
                var chart_div = document.getElementById("graphpopup");
                popup.setContent( chart_div );

                let uniqId = $('#graphpopup > div')[0];
                uniqId.innerHTML = "Loading 24hr graph for this station..."
                uniqId = "#" + uniqId.id.toString();
                drawLineChart(20, uniqueIDNumber, uniqId)
            }
            layerMarkers.addLayer(marker);
        });
    });
    mymap.addLayer(layerMarkers);
}

function drawLineChart(date, uniqId, divID){
    // parse the date / time
    var parseTime = d3.timeParse("%B %d, %Y");
    var formatTime = d3.timeFormat("%H:%M");

    // Get the data
    var airQuality = [];

    // Read in all records of an assigned date
    for (var i=0; i <11; i++ ){
        let H = i.toString();
        let D = date.toString();
        if(H.length < 2){
            H = "0" + H;
        }
        if(D.length < 2){
            D = "0" + D;
        }

        // define the file name
        // Change the path when necessary
        // Attention: use "\\" instead of "\"
        let jsonfilename = "assets/data/stationData/STATIONdata"+ D + H + "_merged.geojson";

        let xhr = new XMLHttpRequest();
        xhr.open('GET', jsonfilename, false);
        xhr.send();
        let geojsonData = JSON.parse(xhr.responseText);
        //d3.json(jsonfilename, function(error, geojsonData) {
        //if (error) throw error;
        //})
        geojsonData["features"].forEach(function(row){
            if (row["properties"]["id"] === uniqId) {
                let strList = row["properties"]["time"].split("T");
                row["properties"]["hour"] = strList[1];
                row["properties"]["order"] = i;
                airQuality.push(row["properties"]);
            }
        });
    };


    var theId = $('#graphpopup > div')[0];
    theId.innerHTML = ""
    // a error report
    var errorMassage = "The historical data of this city is not available.";
    if (airQuality.length === 0){
        theId.innerHTML = "Sorry no available data!"
        return errorMassage;
    }


    var fields = ["aqi"]//, "pm10", "pm25", "no2", "co", "so2", "o3"];

    // Check the time of data
    if (airQuality[0]["time"] === airQuality[1]["time"]){
        theId.innerHTML = "Data is not up to date, so not displaying here!"
        return errorMassage;
    }

    // format the data
    airQuality.forEach(function(element){
        var T = parseTime(element["hour"]);
        element["hour"] = formatTime(T);
        element["aqi"] = +element["aqi"];
        // element["pm10"] = +element["pm10"];
        // element["pm25"] = +element["pm25"];
        // element["no2"] = +element["no2"];
        // element["co"] = +element["co"];
        // element["so2"] = +element["so2"];
        // element["o3"] = +element["o3"];
    });

    // Sort the data according to GMT(BST)
    airQuality.sort(function(a, b){
        return a["order"]-b["order"];
    });

    // Creat chart for every contaminant
    for (let i=0; i<fields.length; i++){
        let contaminant = fields[i];
        if (airQuality[0][contaminant] < 0
            && airQuality[1][contaminant] < 0
            && airQuality[0][contaminant] === airQuality[1][contaminant] ){

        }

        else{
            // set the dimensions and margins of the graph
            var margin = {top: 5, right: 5, bottom: 50, left: 40},
                width = 300 - margin.left - margin.right,
                height = 130 - margin.top - margin.bottom;

            // set the ranges
            var x = d3.scaleTime().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);

            // define the line
            var valueline = d3.line()
                .x(function(d) { return x(d['order']); })
                .y(function(d) { return y(d[contaminant]); });

            // append the svg object to the body of the page
            // appends a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3.select(divID).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


            // Scale the range of the data
            x.domain(d3.extent(airQuality, function(element) { return element["order"]; }));
            y.domain([0, d3.max(airQuality, function(element) { return element[contaminant]; })]);

            // Add the valueline path.
            svg.append("path")
                .data([airQuality])
                .attr("class", "line")
                .attr("d", valueline);
            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(11).tickValues([0,1,2,3,4,5,6,7,8,9,10,11]).tickFormat(function (d) {
                    if (d === 0) return -11; // No label for '0'
                    else if (d < 0) d = -d; // No nagative labels
                    return -(11 - d);
                }));  //.tickFormat(d3.format(".0f")));//.ticks(5).tickFormat(d3.timeFormat("%H")));

            // Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0f")));

            // Add tags to axis
            svg.append("text")
            .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Hours ago");

            // svg.selectAll(".dot")
            //     .data([airQuality])
            //     .enter()
            //     .append("circle") // Uses the enter().append() method
            //     .attr("class", "dot") // Assign a class for styling
            //     .attr("cx", function(d) { return x(d.order) })
            //     .attr("cy", function(d) { return y(d.aqi) })
            //     .attr("r", 5);
            //
            //
            // svg.selectAll(".text")
            //     .data([airQuality])
            //     .enter()
            //     .append("text") // Uses the enter().append() method
            //     .attr("class", "label") // Assign a class for styling
            //     .attr("x", function(d, i) { return x(d.order) })
            //     .attr("y", function(d) { return y(d.aqi) })
            //     .attr("dy", "-5")
            //     .text(function(d) {return d.aqi; });

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(contaminant.toUpperCase());

        }

    }
    return svg;

}



// // Trigger the function
// var date = 14;
// var cityname = "Shanghai";
// drawLineChart(date, cityname)

