/*
* Contains all needed functions for the main leaflet maps
*/

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


// TODO: make transfer of load data functions
function loadNewData() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/data/testAPIdata.geojson', false);
    xhr.send();
    let geojsonDATA = JSON.parse(xhr.responseText);
    if (layerMarkers) {
        layerMarkers.remove()
    }
    // create marker layer group
    layerMarkers = L.layerGroup([]);
    geojsonDATA['features'].forEach(function(row){
        let lat = Number(row['geometry']['coordinates'][0]);
        let lng = Number(row['geometry']['coordinates'][1]);
        let geojsonMarkerOptions = {
            radius: Math.log(row['properties']['aqi']),
            fillColor: getColor(row['properties']['aqi']),
            color: "#000000",
            weight: 0.1,
            opacity: 1,
            fillOpacity: changeOpacity(row['properties']['aqi'])
        };

        let marker = L.circleMarker([lat, lng], geojsonMarkerOptions).bindPopup("<div id='graphpopup'>The Air Quality is:"+row['properties']['aqi']+"<br><button onclick='console.log('hello')'>A Button</button>Bar graph</div>");
        layerMarkers.addLayer(marker);
    });
    mymap.addLayer(layerMarkers);
}


function loadAirQualityData(qVal) {
    // qval is a list of quantile values based on the buttons that have been clicked
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/data/aqi_shape_q.geojson', false);
    xhr.send();
    let geojsonDATA = JSON.parse(xhr.responseText);
    var subsetData;
    if (layerMarkers) {
        layerMarkers.remove()
    }
    // create marker layer group
    layerMarkers = L.layerGroup([]);
    qVal.forEach(function (qv) {
        subsetData = subsetAirQualityData(geojsonDATA, qv);

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

            let marker = L.circleMarker([lat, lng], geojsonMarkerOptions).bindPopup("<div id='graphpopup'>Station ID: " + row['properties']['station'] +"The Air Quality is: "+row['properties']['aqi']+" AQI <br><button onclick='mymap.setView([51.1, 0.12], 6);';>A Button</button>Bar graph</div>");
            layerMarkers.addLayer(marker);
        });
    });
    mymap.addLayer(layerMarkers);
}

function drawLineChart(date, cityname){
    // parse the date / time
    var parseTime = d3.timeParse("%H");

    // Get the data
    var airQuality = [];

    // Read in all records of an assigned date
    for (let hour=1; hour <24; hour+=2 ){
        let H = hour.toString();
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
        let jsonfilename = "assets/data/cityData/APIdata"+ D + H + ".geojson";
        let xhr = new XMLHttpRequest();
        xhr.open('GET', jsonfilename, false);
        xhr.send();
        let geojsonData = JSON.parse(xhr.responseText);
        //d3.json(jsonfilename, function(error, geojsonData) {
        //if (error) throw error;
        //})
        geojsonData["features"].forEach(function(row){
            if (row["properties"]["city"] === cityname) {
                row["properties"]["hour"] = hour;
                airQuality.push(row["properties"]);
            }
        });
    }


    var fields = ["aqi", "pm10", "pm25", "no2", "co", "so2", "o3"];

    // Check the time of data
    if (airQuality[0]["time"] === airQuality[1]["time"]){
        var errorMassage = "The historical data of this city is not available.";
        return errorMassage;
    }

    // format the data
    airQuality.forEach(function(element){
        element["hour"] = parseTime(element["hour"]);
        element["aqi"] = +element["aqi"];
        element["pm10"] = +element["pm10"];
        element["pm25"] = +element["pm25"];
        element["no2"] = +element["no2"];
        element["co"] = +element["co"];
        element["so2"] = +element["so2"];
        element["o3"] = +element["o3"];
    });

    // Sort the data according to GMT(BST)
    airQuality.sort(function(a, b){
        return a["hour"]-b["hour"];
    })

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
                .x(function(d) { return x(d.hour); })
                .y(function(d) { return y(d[contaminant]); });

            // append the svg object to the body of the page
            // appends a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var svg = d3.select("graphpopup").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


            // Scale the range of the data
            x.domain(d3.extent(airQuality, function(element) { return element["hour"]; }));
            y.domain([0, d3.max(airQuality, function(element) { return element[contaminant]; })]);

            // Add the valueline path.
            svg.append("path")
                .data([airQuality])
                .attr("class", "line")
                .attr("d", valueline);

            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add tags to axis
            //svg.append("text")
            //.attr("transform",
            //"translate(" + (width/2) + " ," +
            //(height + margin.top + 20) + ")")
            //.style("text-anchor", "middle")
            //.text("Time");

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(contaminant);
        }

    }
    return svg;

}



// // Trigger the function
// var date = 14;
// var cityname = "Shanghai";
// drawLineChart(date, cityname)

