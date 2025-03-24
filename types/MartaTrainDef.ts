export type TrainArrival = {
    DESTINATION: string,
    DIRECTION: 'N' | 'S' | 'E' | 'W',
    EVENT_TIME: string,
    IS_REALTIME: 'true' | 'false',
    LINE: 'GOLD' | 'RED' | 'BLUE' | 'GREEN',
    NEXT_ARR: string,
    STATION: string,
    TRAIN_ID: string,
    WAITING_SECONDS: string
    WAITING_TIME: string,
    DELAY: string,
    LATITUDE: string,
    LONGITUDE: string
}
