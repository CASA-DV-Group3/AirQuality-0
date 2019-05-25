var storyLine = [
    {year: 2019, text: "Second inquest into death of Ella Kissi-Debrah in London reveals reluctant action despite awareness," +
            "'There is momentum for change and it is fundamental that air pollution is brought down to within lawful limits.'"},
    {year: 2017, text:"New Delhi in India bans fireworks during Diwali to prevent a repeat of the \"airpocalypse\" the previous " +
            "year caused by the extra smoke and chemicals."},
    {year: 2015, text:"Chai Jing's self-funded 'Under the Dome' documentary features a mother’s worries about raising her new-born daughter in the polluted air of a major Chinese city."},
    {year: 2005, text:"Authorities admit air pollution will be a problem at the Beijing Olympics.\n" +
            "'Controlling only local sources in Beijing will not be sufficient to attain the air quality goal set for the Beijing Olympics." +
            "There is an urgent need for regional air quality management studies and new emission control strategies'"},
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
            "Belgium did not introduce air quality legislation until it was created by the EU."},];



var firstPageLine = [{text: "We all buy our food and drink, but no-one buys air.  Some truly pay a far higher price with each breath."},
                    {text: "Next page"}];

var originalText = "<h1>Invisible Cities</h1> <h3 class=\"title text-center\">World City Air Quality</h3> <button type=\"button\" onclick=\"getHomePageStory();\" class=\"btn btn-outline-info\">Begin Story</button>"

// var index = 0;

function getHomePage(){
    document.getElementById("introPage").style.display = "none";
    document.getElementById('page1_innertext').style.display = "block";
}

function getHomePageStory() {
    let index = 0;
    if (index !== firstPageLine.length-1) {
        console.log("here")
        document.getElementById("introPage").style.display = "block";
        document.getElementById('page1_innertext').style.display = "none";
        document.getElementById("introText").innerHTML = firstPageLine[index].text;
    }
    if (index >= firstPageLine.length-1) {
        index = 0;
    }
    document.getElementById("introNext").addEventListener('click', function(e) {
        index = index + 1;
        if (index >= firstPageLine.length){
            console.log("no here")
            index = 0;
            document.getElementById("introPage").style.display = "none";
            document.getElementById('page1_innertext').style.display = "block";
            return
        }
        else {
            document.getElementById('introText').innerHTML = firstPageLine[index].text;

        }

    });

    document.getElementById("introPrev").addEventListener('click', function(e){
        if (index === 0){
            document.getElementById("introPage").style.display = "none";
            document.getElementById('page1_innertext').style.display = "block";
            return
        }
        else {
            index = index - 1;
            document.getElementById('introText').innerHTML = firstPageLine[index].text;
        }
    })
}


function getStoryLine(){
    document.getElementById("historyText").style.display = "none";
    let index = 0;
    let imageLink = "../assets/img/StoryImage/StoryImage" + storyLine[index].year + ".jpg";
    document.getElementById("page2story").style.display = "block";
    document.getElementById("page2back").style.display = "block";
    document.getElementById("page2button").style.display = "none";

    document.getElementById("storyImage").src=imageLink;
    document.getElementById('timePoint').innerHTML = storyLine[index].year;
    document.getElementById("storyText").innerHTML = storyLine[index].text;


    document.getElementById("next").addEventListener('click', function(e) {
        if (index === storyLine.length-1){
            index=0;
            document.getElementById("page2story").style.display = "none";
            document.getElementById("page2back").style.display = "none";
            document.getElementById("historyText").style.display = "block"
            document.getElementById("page2button").style.display = "block";
            return
        }
        else{
            index = index + 1;
            //get the image
            imageLink = "../assets/img/StoryImage/StoryImage" + storyLine[index].year + ".jpg";

            document.getElementById("storyImage").src=imageLink;
            document.getElementById('timePoint').innerHTML = storyLine[index].year;
            document.getElementById('storyText').innerHTML = storyLine[index].text;

        }
    });

    document.getElementById("prev").addEventListener('click', function(e){
        if (index === 0){
            inedx=0;
            document.getElementById("page2story").style.display = "none";
            document.getElementById("page2back").style.display = "none";
            document.getElementById("historyText").style.display = "block"
            document.getElementById("page2button").style.display = "block";
            return
        }
        else{
            index = index - 1;

            let imageLink = "assets/img/StoryImage/StoryImage" + storyLine[index].year + ".jpg";

            document.getElementById("storyImage").src=imageLink;
            document.getElementById('timePoint').innerHTML = storyLine[index].year;
            document.getElementById('storyText').innerHTML = storyLine[index].text;
        }

    })
}

function hideStoryLine(){
    document.getElementById("page2story").style.display = "none";
    document.getElementById("page2back").style.display = "none";
    document.getElementById("historyText").style.display = "block"
    document.getElementById("page2button").style.display = "block";
    return
}

