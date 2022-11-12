export interface CoordinatesModel {
    latitude: number,
    longitude: number
}

export interface ParameterModel {
    id: string,
    name: string,
    unit: string,
}

export interface LocationModel {
    city: string
    coordinates: CoordinatesModel,
    id: number,
    lastUpdated: string, //YYYY-MM-DD HH:MM:SS format
    name: string,
    parameters: ParameterModel[], 
}

export interface HomeCoordModel {
    lat: number,
    lng: number
}

export interface MeasurementModel {

}

export interface GraphDataModel {
    x: string[],
    y: number[]
}