//import axios from "../utils/axios";
import axios from 'axios';
const headers =  {
    'Content-Type': 'application/json',
  }
export const getMeasurements = (country: string, city: string, location: string, parameter: string) => {
    const url = 'https://api.openaq.org/v2/measurements';
    
    return axios.get(`${url}?date_from=2021-07-21T00%3A00%3A00%2B00%3A00&date_to=2022-09-28T23%3A00%3A00%2B00%3A00&limit=500&page=1&offset=0&sort=desc&parameter=${parameter}&radius=10&country_id=${country}&city=${city}&location_id=${location}&order_by=datetime`, {headers: headers})
}

export const getLatestMeasurements = (city:string, parameter: string) => {
    const url = `https://api.openaq.org/v2/latest?city=${city}&parameter=${parameter}`;
    return axios.get(url);
}

export const getCitiesByCountry = (country: string) => {
    const url = `https://api.openaq.org/v2/cities?country_id=${country}&sort=asc`;
    return axios.get(url);
}

export const getLocationsByCity = (country:string, city: string) => {
    const url = `https://api.openaq.org/v2/locations?country_id=${country}&city=${city}&sort=asc`;
    return axios.get(url);
}