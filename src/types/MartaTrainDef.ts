export type AllTrainInfo = {
    Trains: TrainInfo[]
}

export type TrainInfo = {
    Destination: string,
    Direction: 'S' | 'N' | 'E' | 'W',
    EventTime: string,
    IsRealTime: boolean,
    Line: 'GOLD' | 'RED' | 'BLUE' | 'GREEN',
    NextArrival: string,
    Station: string,
    TrainId: number,
    WaitingSeconds: number
    WaitingTime: string,
    Delay: 'string',
    Laitude: number,
    Longitude: number
}