function addMapControls () {
    var info = L.control({position: 'bottomleft'});
    var legend = L.control({
        position: 'bottomright'
    });


    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'infoLegend'),
            // loop through the grades
            grades = [0,  50,100,150,200,300];
        div.style.textAlign = 'left';
        div.innerHTML += '<a id="aqiHover" href="#d" onclick="window.open(\'https://www.ourair.org/sbc/the-air-quality-index/\')"><b>Air Quality Metric</b></a><br>'
        // loop through our density intervals and generate a label with a colored square for each interval
        labels = ["Good","Moderate","Unhealthy to Sensitive Groups","Unhealthy","Very Unhealthy","Hazardous"];
        for (var i = 0; i < grades.length; i++) {
            var widthHeight = i*1.1+10;
            div.innerHTML += '<div id="aqiButton"><i style="background:' + getColor(grades[i]+0.0000001) + '"><img src="assets/img/circle_icon.png" height=' + '\''+ widthHeight+ '\'' + 'width=' + '\'' + widthHeight + '\'' + '></i>' + String(Number(grades[i])+1) + (grades[i + 1] ? '&ndash;' + grades[i + 1] + " (" + labels[i] + ")" +'<br></div>' : "+ (" + labels[i] + ")" + "</div>");

        }
        return div;
    };


    info.onAdd = function(map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this._div.id = "infoDiv";
        this._div.style.marginBottom = "0%";
        this._div.style.textAlign = "left";
        this.update();
        return this._div;
    };

// method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = '<h3>Global Air Quality Monitoring</h3>' +
            '<h5 class="text-light" style="text-align: left; font-size: 0.9rem"><i>\'Making the invisible visible\'</i></h5>' +
            '<p class="text-light">For this visualisation, live data from air quality monitoring stations across the world can be loaded onto the map using the buttons on the left.' +
            'These buttons are divided into three groups of % GDP that is accounted for by the industrial sector, which serve as a proxy for countries we expect to pollute more (World Bank, 2017). ' +
            'The data itself is a measure of the Air Quality Index (AQI) in a location, which contains a calculation determining the health <a href="#" class="text-light" data-toggle="tooltip" data-placement="top" title="Broadly determined by the WHO: Air Quality Guidelines set out in 2005"><u>risk</u></a>' +
            ' associated with the local concentrations of air pollutants (read more <a id="aqiHover" href="#d" onclick="window.open(\'https://www.ourair.org/sbc/the-air-quality-index/\')"><b>here</b></a>). ' +
            '<i>Click</i> on a monitoring station to view the last 24 hours worth of measurements.'
    };

    legend.addTo(mymap); // add the legend
    info.addTo(mymap); // add the legend
}
