//import axios from "../utils/axios";
import axios from '../utils/axios';
import { Moment } from 'moment';

export const getMeasurements = (country: string, city: string, location: number, parameter: string, startDate: Moment|null, endDate: Moment|null, selectedLimit: string) => {
    const url = `/v2/measurements?date_from=${startDate?.toISOString()}&date_to=${endDate?.toISOString()}&limit=${selectedLimit}&page=1&offset=0&sort=desc&parameter=${parameter}&radius=10&country_id=${country}&city=${city}&location_id=${location}&order_by=datetime`;
    return axios.get(url);
}

export const getCitiesByCountry = (country: string) => {
    const url = `/v2/cities?country_id=${country}&sort=asc`;
    return axios.get(url);
}

export const getLocationsByCity = (country:string, city: string) => {
    const url = `/v2/locations?country_id=${country}&city=${city}&sort=asc`;
    return axios.get(url);
}