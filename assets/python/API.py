import requests
import json
from geojson import Point, Feature, FeatureCollection, dump

# function to request through API and get response as a JSON file
# require requests & json package
def getJSONR(url): 
    try:
        ua = {'user-agent':'Chrome/71.0.3578.98'}
        r = requests.get(url, headers = ua, timeout=30)
        r.raise_for_status() # raise error if r.status_code != 200
        r.encoding = r.apparent_encoding
        js = json.loads(r.text)
        return js
    except Exception as e:
        return e

# functions to get air quality data from the JSON response of World's Air Pollution API
def getGEO(js):
    try:
        geo = []
        lat = js['data']['city']['geo'][0]
        lng = js['data']['city']['geo'][1]
        geo.append(lat)
        geo.append(lng)
        return geo
    except Exception as e:
        geo = [-1, -1]
        return geo
    
def getTIME(js):
    try:
        time = js['data']['time']['s']
        return time
    except Exception as e:
        return "error"
    
def getAQI(js):
    try:
        aqi = js['data']['aqi']
        return aqi
    except Exception as e:
        return -1

def getPM10(js):
    try:
        pm10 = js['data']['iaqi']['pm10']['v']
        return pm10
    except Exception as e:
        return -1

def getPM25(js):
    try:
        pm25 = js['data']['iaqi']['pm25']['v']
        return pm25
    except Exception as e:
        return -1

def getNO2(js):
    try:
        no2 = js['data']['iaqi']['no2']['v']
        return no2
    except Exception as e:
        return -1

def getO3(js):
    try:
        o3 = js['data']['iaqi']['o3']['v']
        return o3
    except Exception as e:
        return -1
    
def getSO2(js):
    try:
        so2 = js['data']['iaqi']['so2']['v']
        return so2
    except Exception as e:
        return -1

def getCO(js):
    try:
        co = js['data']['iaqi']['co']['v']
        return co
    except Exception as e:
        return -1

# city list
city_list = ['Shanghai',
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
 'Kampala']

# initialise a features list for the geojson object
features = []

for i in range(0,len(city_list)):
    try:
        url = 'https://api.waqi.info/feed/'\
        +city_list[i]\
        +'/?token=c4103eeb230f7e9cd437f3ea4a2fe03216563895'
        js = getJSONR(url)
        features.append(Feature(geometry=Point((getGEO(js)[0], getGEO(js)[1])), 
                        properties={"city": city_list[i],
                                    "time": getTIME(js),
                                    "aqi": getAQI(js),
                                    "pm10": getPM10(js),
                                    "pm25": getPM25(js),
                                    "no2": getNO2(js),
                                    "o3": getO3(js),
                                    "so2": getSO2(js),
                                    "co": getCO(js)}))
    except Exception as e:
        continue
        
APIgeojson = FeatureCollection(features)
with open('APIdata.geojson', 'w') as f:
   dump(APIgeojson, f)