export interface Station {
    value: string;
    stationName: string;
}

// List of all MARTA Rail Stations
export const MARTAStations: Station[] = [
    { value: 'AIRPORT STATION', stationName: 'Airport' },
    { value: 'ARTS CENTER STATION', stationName: 'Arts center' },
    { value: 'ASHBY STATION', stationName: 'Ashby' },
    { value: 'AVONDALE STATION', stationName: 'Avondale' },
    { value: 'BANKHEAD STATION', stationName: 'Bankhead' },
    { value: 'BROOKHAVEN STATION', stationName: 'Brookhaven / Oglethorpe' },
    { value: 'BUCKHEAD STATION', stationName: 'Buckhead' },
    { value: 'CHAMBLEE STATION', stationName: 'Chamblee' },
    { value: 'CIVIC CENTER STATION', stationName: 'Civic Center' },
    { value: 'COLLEGE PARK STATION', stationName: 'College Park' },
    { value: 'DECATUR STATION', stationName: 'Decatur' },
    { value: 'DORAVILLE STATION', stationName: 'Doraville' },
    { value: 'EAST LAKE STATION', stationName: 'East Lake' },
    { value: 'EAST POINT STATION', stationName: 'East Point' },
    { value: 'EDGEWOOD CANDLER PARK STATION', stationName: 'Edgewood / Candler Park' },
    { value: 'FIVE POINTS STATION', stationName: 'Five Points' },
    { value: 'GARNETT STATION', stationName: 'Garnett' },
    { value: 'GEORGIA STATE STATION', stationName: 'Georgia State' },
    { value: 'OMNI DOME STATION', stationName: 'GWCC / CNN Center' },
    { value: 'HAMILTON E HOLMES STATION', stationName: 'Hamilton E. Holmes' },
    { value: 'INDIAN CREEK STATION', stationName: 'Indian Creek' },
    { value: 'INMAN PARK STATION', stationName: 'Inman Park / Reynoldstown' },
    { value: 'KENSINGTON STATION', stationName: 'Kensington' },
    { value: 'KING MEMORIAL STATION', stationName: 'King Memorial' },
    { value: 'LAKEWOOD STATION', stationName: 'Lakewood / Ft. McPherson' },
    { value: 'LENOX STATION', stationName: 'Lenox' },
    { value: 'LINDBERGH STATION', stationName: 'Lindbergh Center' },
    { value: 'MEDICAL CENTER STATION', stationName: 'Medical Center' },
    { value: 'MIDTOWN STATION', stationName: 'Midtown' },
    { value: 'NORTH AVE STATION', stationName: 'North Ave' },
    { value: 'NORTH SPRINGS STATION', stationName: 'North Springs' },
    { value: 'OAKLAND CITY STATION', stationName: 'Oakland City' },
    { value: 'PEACHTREE CENTER STATION', stationName: 'Peachtree Center' },
    { value: 'SANDY SPRINGS STATION', stationName: 'Sandy Springs' },
    { value: 'VINE CITY STATION', stationName: 'Vine City' },
    { value: 'WEST END STATION', stationName: 'West End' },
    { value: 'WEST LAKE STATION', stationName: 'West Lake' },
];

// translation with help of ChatGPT and some research on local usage
// duration is the amount of time to show the translation
// duration is longer for primary/secondary languages
export const ArrivingTranslation = [
    { lang: 'English', text: 'Arriving', duration: 5500 },
    { lang: 'Spanish', text: 'Llegando', duration: 3500 },
    { lang: 'Korean', text: '곧 도착', duration: 2500 },
    { lang: 'Chinese', text: '即將抵達', duration: 2500 },
    { lang: 'French', text: 'Arrivée', duration: 2500 },
    { lang: 'Japanese', text: 'まもなく、電車が参ります', duration: 2500 },
    { lang: 'Vietnamese', text: 'Đang đến', duration: 2500 },
];
