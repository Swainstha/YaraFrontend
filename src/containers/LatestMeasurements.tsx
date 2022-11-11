import React from 'react';
import {getMeasurements, getCitiesByCountry, getLatestMeasurements} from '../store/openaq';

import {useEffect, useState,useLayoutEffect} from 'react'
import Bargraph from '../components/Bargraph';

const LatestMeasurements = () => {
  const parameters:string[] = ["pm10","pm25","o3","co","no2","so2"];
  const [cities, setCities] = useState<string[]>([]);
  const [bargraph, setBargraph] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<string|null>(null);
  const [selectedParameter, setSelectedParameter] = useState<string>(parameters[0]);
  const [latestMeasurements, setLatestMeasurements] = useState<any>(null);


  useLayoutEffect(() => {
    getCitiesByCountry("DE").then((response) => {
      const cities = response.data.results.map((city: { city: any; }) => {return city.city});
      console.log(cities);
      setCities(cities);
      getLatestMeasurements(cities[0], selectedParameter).then(response => {
        setLatestMeasurements(response.data.results);
      })
    })
  },[]);

  useEffect(() => {
    console.log("Inside latest measurements")
    if(latestMeasurements && Array.isArray(latestMeasurements)) { 
      const xData:any = [];
      const yData:any = [];
      latestMeasurements.map((data: any) =>  {
        const value = data.measurements.find((x:any) => x.parameter === selectedParameter);
        xData.push(data.location);
        yData.push(value?.value);
      })
      setBargraph({x: xData,y:yData});
    }
  },[latestMeasurements])

  useEffect(() => {
    if(selectedCity && selectedParameter) {
      getLatestMeasurements(selectedCity, selectedParameter).then(response => {
        setLatestMeasurements(response.data.results);
      })
    }

  },[selectedCity, selectedParameter])

  const getLatestDataByCity = (event: any) => {
    setSelectedCity(event.target.value);
  }

  const selectParameter = (event: any) => {
    setSelectedParameter(event.target.value)
  }
  return (
    <div className="App">
      <select defaultValue={cities.length>0?cities[0]:""} id="cars" onChange={getLatestDataByCity}>
        {cities && cities.map(city => {
          return <option key={city} value={city}>{city}</option>
        })}
        </select>
        <select id="cars" onChange={selectParameter}>
        {parameters && parameters.map(param => {
          return <option key={param} value={param}>{param}</option>
        })}
        </select>

        <Bargraph data={bargraph} />
    </div>
  )
};

export default LatestMeasurements;