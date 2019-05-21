allText = {"1": "\"Hello this is the air <a href='#page2'>LINK</a> pollution story\"", "2": "NEW this is the air <a href='http://www.bbc.com'>LINK</a> pollution story"}

function getStory(id) {

    document.getElementById('page1_innertext').innerHTML = allText[id]
}


