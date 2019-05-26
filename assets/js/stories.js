var storyLine = [
    {year: 2019, text: "Second inquest into death of Ella Kissi-Debrah in London reveals reluctant action despite awareness," +
            "'There is momentum for change and it is fundamental that air pollution is brought down to within lawful limits.'"},
    {year: 2017, text:"New Delhi in India bans fireworks during Diwali to prevent a repeat of the \"airpocalypse\" the previous " +
            "year caused by the extra smoke and chemicals."},
    {year: 2015, text:"Chai Jing's self-funded 'Under the Dome' documentary features a mother’s worries about raising her new-born daughter in the polluted air of a major Chinese city."},
    {year: 2005, text:"The World Health Organisation introduces the <i>Global Air Quality Guidelines</i> which serves as a guide for harmful effects, and the safe concentrations, of human-produced air pollutants in a region."},
    {year: 1992, text:"Guangzhou is the first city in China to ban fireworks due to the air pollution they cause."},
    {year: 1984, text:"The Bhopal disaster in India at Union Carbide’s pesticide plant exposed hundreds of thousands of people to forty tons of toxic methyl " +
            "isocyanate. \n Nearly four thousand died and the US company paid almost $500m in compensation."},
    {year: 1982, text:"Godfrey Reggio’s 'Koyaanisqatsi 'documentary (without words, Philip Glass soundtrack only) juxtaposes images of nature, humanity and heavy industry."},
    {year: 1967, text:"The US Air Quality Act is finally created, nearly twenty years after the Donora smog incident."},
    {year: 1956, text:"UK Clean Air Act is created in response to the 1952 London smog incident."},
    {year: 1952, text:"London smog event.'We estimate about 12,000 excess deaths occurred from December 1952 through February 1953 because of acute and persisting effects of the 1952 London smog.'"},
    {year: 1948, text:"Donora smog in Pennsylvania, USA.  Nearly half the population of the small town were affected and twenty died from the smog of hydrogen fluoride, sulphur dioxide and other toxins."},
    {year: 1930, text:"Sixty people died in the December smog covering the valley of factories lining the River Meuse in Belgium. \n " +
            "It 'led to the first scientific proof for the potential of atmospheric pollution to cause deaths.'\n" +
            "Belgium did not introduce air quality legislation until it was created by the EU."}];


var figureCaptions = [
    {year: 2019, text: "Christian (2019)"},
    {year: 2017, text: "Tandon (2018)"},
    {year: 2015, text: "Chen (2016)"},
    {year: 2005, text:"Emery (2009)"},
    {year: 1992, text:"Yingqi (2011)"},
    {year: 1984, text:"WHO (2016)"},
    {year: 1982, text:"Films For Earth (2011)"},
    {year: 1967, text:"MacKenzie (2016)"},
    {year: 1956, text:"WriteOpinion.com (2011)"},
    {year: 1952, text:"Smogday (2011)"},
    {year: 1948, text:"Kiger (2018)"},
    {year: 1930, text:"National Archies (2008)"}];

storyLine = storyLine.reverse()
figureCaptions = figureCaptions.reverse()

var introDiv = " <div id='introDiv' class='text-left text-light'>\n" +
"        <h3 class='text-light text-center'>Introduction\n</h3>" +
"        <br>\n" +
"        Air Pollution is the presence of chemicals that threaten the health and welfare of people, plants, or animals (Park & Allaby, 2017). \n" +
"        This project sets out to educate and inform its users to the <i>invisible</i> danger of air pollution and it's current state of monitoring \n" +
"        Users will also be able to explore more \n" +
"        The report will follow this <a class=\"text-warning\" href='#' onclick='viewStructure();'>structure</a>\n" +
"        <br><br><i class='text-center' style='margin-left: 40%;'>Scroll down to begin</i>\n" +
"    </div>"

function viewStructure() {
    document.getElementById('introDiv').innerHTML = "    <div id=\"leftHandIcons\" class='text-center text-light' style='font-size: 0.83rem'>\n" +
        "        <h3>Outline of the Project</h3>\n" +
        "        <img style=\"height:5rem; padding-bottom: 2rem; align-content: left\" src=\"assets/img/big_globe_icon.png\"> – <b>Globe View:</b> Visualisation showing global health impact of air pollution <br>\n" +
        "        <img style=\"height:5rem; padding-bottom: 2rem; align-content: left\" src=\"assets/img/world-map.png\"> – <b>Map Level:</b> Visualisation showing current global air quality measurements from available monitoring stations <br>\n" +
        "        <img style=\"height:5rem; padding-bottom: 2rem; align-content: left\" src=\"assets/img/icon_region.png\"> – <b>Region Level:</b> Visualisation showing the changing space-time dynamics of regional air quality <br>\n" +
        "        <img style=\"height:5rem; padding-bottom: 2rem; align-content: left\" src=\"assets/img/street_icon.png\"> – <b>Street Level:</b> Visualisation showing the spatial concentrations of common air pollutants at the street-level <br><i>Scroll down to begin</i>\n" +
        "    </div>"
}

var firstPageLine = [{text: "<h4>We all buy our food and drink...</h4>"}, {text: "<h4>but no one buys their air.</h4>"}, {text:introDiv}];

var originalText = "<h1>Invisible Cities</h1> <h3 class=\"title text-center\">World City Air Quality</h3> <button type=\"button\" onclick=\"getHomePageStory();\" class=\"btn btn-outline-info\">Begin Story</button>"

// var index = 0;

function getHomePage(){
    document.getElementById("introPage").style.display = "none";
    document.getElementById('page1_innertext').style.display = "block";
}

function getHomePageStory() {
    let index = 0;
    $('#introText1').hide().delay(300).fadeIn('slow');
    $('#introText2').hide().delay(3000).fadeIn('slow');
    $('#backButtonBar').hide().delay(5000).fadeIn('slow');
    $('#forwardButtonBar').hide().delay(5500).fadeIn('slow');
        document.getElementById("introPage").style.display = "block";
        document.getElementById('page1_innertext').style.display = "none";
        document.getElementById("introText1").innerHTML = firstPageLine[index].text;
        document.getElementById("introText2").innerHTML = firstPageLine[1].text;
}

function moveForward() {
    let index = 2;
    $('#forwardButtonBar').hide();
    document.getElementById("introPage").style.display = "block";
    document.getElementById('page1_innertext').style.display = "none";
    document.getElementById("introText1").innerHTML = firstPageLine[index].text;
    document.getElementById('introText2').style.display = "none";
}


function getStoryLine(){
    document.getElementById("historyText").style.display = "none";
    let index = 0;
    let imageLink = "../assets/img/StoryImage/StoryImage" + storyLine[index].year + ".jpg";
    document.getElementById("page2story").style.display = "inline-block";
    document.getElementById("page2back").style.display = "inline-block";
    document.getElementById("page2button").style.display = "none";
    document.getElementById("storyImageCaption").innerText =figureCaptions[index].text;
    document.getElementById("storyImage").src=imageLink;
    document.getElementById('timePoint').innerHTML = "Year: " + storyLine[index].year;
    document.getElementById("storyText").innerHTML = storyLine[index].text;


    document.getElementById("next").addEventListener('click', function(e) {
        if (index === storyLine.length-1){
            index=0;
            document.getElementById("page2story").style.display = "none";
            document.getElementById("page2back").style.display = "none";
            document.getElementById("historyText").style.display = "inline-block"
            document.getElementById("page2button").style.display = "inline-block";
            return
        }
        else{
            index = index + 1;
            //get the image
            imageLink = "../assets/img/StoryImage/StoryImage" + storyLine[index].year + ".jpg";
            document.getElementById("storyImageCaption").innerText=figureCaptions[index].text;
            document.getElementById("storyImage").src=imageLink;
            document.getElementById('timePoint').innerHTML = "Year: " + storyLine[index].year;
            document.getElementById('storyText').innerHTML = storyLine[index].text;

        }
    });

    document.getElementById("prev").addEventListener('click', function(e){
        if (index === 0){
            index=0;
            document.getElementById("page2story").style.display = "none";
            document.getElementById("page2back").style.display = "none";
            document.getElementById("historyText").style.display = "inline-block"
            document.getElementById("page2button").style.display = "inline-block";
            return
        }
        else{
            index = index - 1;
            let imageLink = "../assets/img/StoryImage/StoryImage" + storyLine[index].year + ".jpg";
            document.getElementById("storyImageCaption").innerText=figureCaptions[index].text;
            document.getElementById("storyImage").src=imageLink;
            document.getElementById('timePoint').innerHTML = "Year: " + storyLine[index].year;
            document.getElementById('storyText').innerHTML = storyLine[index].text;
        }

    })
}

function hideStoryLine(){
    document.getElementById("page2story").style.display = "none";
    document.getElementById("page2back").style.display = "none";
    document.getElementById("historyText").style.display = "inline-block"
    document.getElementById("page2button").style.display = "inline-block";
    return
}

function getMapStory() {

}
