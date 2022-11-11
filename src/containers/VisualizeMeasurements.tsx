import React from 'react';
import {getMeasurements, getCitiesByCountry, getLatestMeasurements, getLocationsByCity} from '../store/openaq';

import {useEffect, useState,useLayoutEffect} from 'react'
import Bargraph from '../components/Bargraph';
import TimeSeriesgraph from '../components/TimeSeriesGraph';
import Histogram from '../components/Histogram';

const VisualizeMeasurements:React.FC<{city: string|null, location: string|null}> = (props) => {
  const parameters:string[] = ["pm10","pm25","o3","co","no2","so2"];
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedParameter, setSelectedParameter] = useState<string>(parameters[0]);
  const [measurements, setMeasurements] = useState<any>(null);

  useEffect(() => {
    if(selectedParameter && props.city && props.location) {
        getMeasurements('DE', props.city, props.location, selectedParameter).then(response => {
            if(response && response.data) {
                setMeasurements(response.data.results)
            }
        })
    }
  },[selectedParameter, props.location, props.city])

  useEffect(() => {
    if(measurements && Array.isArray(measurements)) {
        const xData:any[] = [];
        const yData:any[] = [];
        measurements.map((data:any) => {
            xData.push(data.date.local)
            yData.push(data.value)
        })
        console.log(xData)
        setGraphData({x: xData, y: yData});
    }
  },[measurements])

  const selectParameter = (event: any) => {
    setSelectedParameter(event.target.value)
  }


  return (
    
    <>
        <select id="cars" onChange={selectParameter}>
        {parameters && parameters.map(param => {
          return <option key={param} value={param}>{param}</option>
        })}
        </select>
        <Histogram data={graphData}/>
    </>
  )
};

export default VisualizeMeasurements;