// function to get text response from API
function getJSONR(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send();
    var response = JSON.parse(xhr.responseText);
    return response;
}
// function to create geojson data file 1
function Geojson(features) {
    this.type = "FeatureCollection";
    this.features = features;
}
// function to create geojson data file 2
function Geopoints(city,coord,time,aqi,pm10,pm25,no2,o3,so2,co) {
    this.type = "Feature";
    this.geometry = {
        "type": "Point",
        "coordinates": coord
    };
    this.properties = {
        "city": city,
        "time": time,
        "aqi": aqi,
        "pm10": pm10,
        "pm25": pm25,
        "no2": no2,
        "o3": o3,
        "so2": so2,
        "co": co,
    };
}
// initialise an array to store feature data in geojson file
var features = [];

var city_list = ['Shanghai',
    'Beijing',
    'Tianjin',
    'Guangzhou',
    'Shenzhen',
    'Wuhan',
    'Dongguan',
    'Chongqing',
    'Chengdu',
    'Nanjing',
    'Taipei',
    'Kaohsiung',
    'Taichung',
    'tainan',
    'banqiao',
    'Hong Kong',
    'Macao',
    'Busan',
    'Incheon',
    'Daejeon',
    'Ulsan',
    'Daegu',
    'Gwangju',
    'Suwon',
    'Goyang',
    'Seongnam',
    'Yokohama',
    'Osaka',
    'Nagoya',
    'Sapporo',
    'Kobe',
    'Kyoto',
    'Fukuoka',
    'Kawasaki',
    'saitama',
    'Moscow',
    'Dhaka',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Ahmedabad',
    'Hyderabad',
    'Pune',
    'Kanpur',
    'Bangkok',
    'Mueang Samut Prakan',
    'nonthaburi',
    'Vientiane',
    'Kota Bharu',
    'Kuala Lumpur',
    'klang',
    'Johor Bahru',
    'Ho Chi Minh City',
    'Hanoi',
    'Bandar Seri Begawan',
    'Jakarta',
    'Medan',
    'Bekasi',
    'Palembang',
    'Tangerang',
    'Colombo',
    'galkissa',
    'moratuwa',
    'Negombo',
    'Astana',
    'Bishkek',
    'Montreal',
    'Toronto',
    'Vancouver',
    'Calgary',
    'Ottawa',
    'Edmonton',
    'Mississauga',
    'Winnipeg',
    'scarborough',
    'Auckland',
    'Wellington',
    'Christchurch',
    'Manukau',
    'waitakere',
    'North Shore',
    'Hamilton',
    'Lower Hutt',
    'Melbourne',
    'Brisbane',
    'Perth',
    'Adelaide',
    'Newcastle',
    'Wollongong',
    'Logan',
    'Chicago',
    'houston',
    'Philadelphia',
    'manhattan',
    'Phoenix',
    'Lima',
    'Callao',
    'Santiago',
    'Antofagasta',
    'Valparaíso',
    'Talcahuano',
    'temuco',
    'Iquique',
    'Concepción',
    'Mexico City',
    'iztapalapa',
    'Ecatepec de Morelos',
    'Guadalajara',
    'Puebla',
    'Ciudad Juárez',
    'Tijuana',
    'Bogotá',
    'Medellín',
    'Willemstad',
    'newport',
    'Buenos Aires',
    'San Salvador',
    'Guatemala City',
    'Paris',
    'Marseille',
    'Lyon',
    'Toulouse',
    'Nice',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Bordeaux',
    'Lille',
    'Tallinn',
    'Tartu',
    'Narva',
    'Madrid',
    'Barcelona',
    'Valencia',
    'Seville',
    'Málaga',
    'Murcia',
    'Palma de Mallorca',
    'Las Palmas de Gran Canaria',
    'bilbao',
    'City of London',
    'Zurich',
    'Basel',
    'Bern',
    'Lausanne',
    'Prague',
    'Brno',
    'Ostrava',
    'Pilsen',
    'Olomouc',
    'Rome',
    'Milan',
    'Naples',
    'Turin',
    'Bratislava',
    'Nitra',
    'Oslo',
    'Bergen',
    'Trondheim',
    'Stavanger',
    'Drammen',
    'Vienna',
    'Graz',
    'Linz',
    'Salzburg',
    'Innsbruck',
    'Nicosia',
    'Limassol',
    'Larnaca',
    'Famagusta',
    'Paphos',
    'Warsaw',
    'Krakow',
    'Gdańsk',
    'Szczecin',
    'Bydgoszcz',
    'Lublin',
    'Katowice',
    'Brussels',
    'Antwerp',
    'Ghent',
    'Charleroi',
    'Liège',
    'Amsterdam',
    'Rotterdam',
    'Utrecht',
    'Eindhoven',
    'Tilburg',
    'Groningen',
    'Almere',
    'Breda',
    'Nijmegen',
    'Copenhagen',
    'frederiksberg',
    'Vilnius',
    'Kaunas',
    'Budapest',
    'Debrecen',
    'Miskolc',
    'szeged',
    'Pécs',
    'Bucharest',
    'Cluj-Napoca',
    'Craiova',
    'Dublin',
    'Zagreb',
    'Split',
    'Rijeka',
    'Osijek',
    'Ljubljana',
    'Maribor',
    'Celje',
    'Kranj',
    'Velenje',
    'Birkirkara',
    'qormi',
    'Mosta',
    'Berlin',
    'Hamburg',
    'Munich',
    'Cologne',
    'Essen',
    'Stuttgart',
    'Dortmund',
    'Bremen',
    'Helsinki',
    'Espoo',
    'Tampere',
    'Vantaa',
    'Turku',
    'Oulu',
    'Lahti',
    'Kuopio',
    'Jyvaskyla',
    'Pori',
    'Noumea',
    'Stockholm',
    'Malmo',
    'Uppsala',
    'Sofia',
    'Plovdiv',
    'Varna',
    'Burgas',
    'Rousse',
    'Belgrade',
    'Novi Sad',
    'zemun',
    'Sarajevo',
    'Zenica',
    'Tuzla',
    'Skopje',
    'Bitola',
    'Kumanovo',
    'Prilep',
    'Tetovo',
    'Reykjavik',
    'Kopavogur',
    'Akureyri',
    'Lisbon',
    'Porto',
    'Amadora',
    'Braga',
    'Setúbal',
    'Athens',
    'Kiev',
    'Dnipro',
    'Haifa',
    'Tel Aviv',
    'West Jerusalem',
    'Ashdod',
    'Ankara',
    'Izmir',
    'Bursa',
    'Adana',
    'Gaziantep',
    'Konya',
    'Antalya',
    'Tehran',
    'Mashhad',
    'Isfahan',
    'Karaj',
    'Tabriz',
    'Dubai',
    'Manama',
    'Al Muharraq',
    'Amman',
    'Zarqa',
    'Irbid',
    'russeifa',
    'Baghdad',
    'Jeddah',
    'Medina',
    'Riyadh',
    'Mecca',
    'Soweto',
    'Pretoria',
    'Addis Ababa',
    'Kampala'];

// for loop to request API data
for (let i = 0; i < city_list.length; i++) {
    var url = 'https://api.waqi.info/feed/' +
        city_list[i] +
        '/?token=c4103eeb230f7e9cd437f3ea4a2fe03216563895';
    var response = getJSONR(url);
    // geolocation data:
    try {
        var coord = response.data.city.geo;
    }
    catch (err) {
        var coord = [NaN,NaN];
    }
    // time data:
    try {
        var time = response.data.time.s;
    }
    catch (err) {
        var time = NaN;
    }
    // aqi data:
    try {
        var aqi = response.data.aqi;
    }
    catch (err) {
        var aqi = NaN;
    }
    // pm10 data:
    try {
        var pm10 = response.data.iaqi.pm10.v;
    }
    catch (err) {
        var pm10 = NaN;
    }
    // pm25 data:
    try {
        var pm25 = response.data.iaqi.pm25.v;
    }
    catch (err) {
        var pm25 = NaN;
    }
    // no2 data:
    try {
        var no2 = response.data.iaqi.no2.v;
    }
    catch (err) {
        var no2 = NaN;
    }
    // o3 data:
    try {
        var o3 = response.data.iaqi.o3.v;
    }
    catch (err) {
        var o3 = NaN;
    }
    // so2 data:
    try {
        var so2 = response.data.iaqi.so2.v;
    }
    catch (err) {
        var so2 = NaN;
    }
    // co data:
    try {
        var co = response.data.iaqi.co.v;
    }
    catch (err) {
        var co = NaN;
    }
    var point = new Geopoints(city_list[i],
        coord,
        time,
        aqi,
        pm10,
        pm25,
        no2,
        o3,
        so2,
        co
    );
    features.push(point);
}

var geojsonDATA = new Geojson(features);
// console.log(geojsonDATA);
// // var stringDATA = JSON.stringify(geojsonDATA);
// // console.log(stringDATA);