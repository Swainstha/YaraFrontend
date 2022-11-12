import React from "react";
import {
  getMeasurements,
} from "../store/openaq";

import { useEffect, useState, useLayoutEffect } from "react";
import Bargraph from "../components/Bargraph";
import TimeSeriesgraph from "../components/TimeSeriesGraph";
import Histogram from "../components/Histogram";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MenuItem, FormLabel, Button, FormControl, InputLabel, FormControlLabel, RadioGroup,Radio } from "@mui/material";
//import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, {Moment} from 'moment';
const VisualizeMeasurements: React.FC<{
  city: string | null;
  location: any;
}> = (props) => {

  const [startDate, setStartDate] = React.useState<Moment | null>(null);
  const [endDate, setEndDate] = React.useState<Moment | null>(null);
  const [parameters, setParameters]= useState<any>();
  const limits: string[] = ["100", "200", "500", "1000"];
  const [graphData, setGraphData] = useState<any>(null);
  const [selectedParameter, setSelectedParameter] = useState<any>('');
  const [measurements, setMeasurements] = useState<any>(null);
  const [selectedLimit, setSelectedLimit] = useState<string>("100");
  const [graphType, setGraphType] = useState<string>("timeSeries");

  const Graph:any = {"histogram": <Histogram data={graphData} parameter={selectedParameter?selectedParameter:""}/>, 
                  "timeSeries": <TimeSeriesgraph data={graphData} parameter={selectedParameter?selectedParameter:""}/>}

  useEffect(() => {
    if(props.location && Array.isArray(props.location.parameters)) {
      const params:any = [];
      props.location.parameters.map((param: any) => {
        params.push({id:param.parameter, name: param.displayName, unit: param.unit})
      })
      setParameters(params);
      //console.log(params)
      //if(params.length > 0) {
      //  setSelectedParameter(params[0]);
      //}
    }
  },[props.location]);
  useEffect(() => {
    if (selectedParameter && props.city && props.location && startDate && selectedLimit) {
      let end_date = moment(Date.now());
      if(endDate ) {
        end_date = endDate;
      }
      getMeasurements("DE", props.city, props.location.id, selectedParameter.id, startDate, end_date, selectedLimit).then(
        (response) => {
          if (response && response.data) {
            setMeasurements(response.data.results);
          }
        }
      );
    }
  }, [selectedParameter, startDate, endDate, selectedLimit]);

  useEffect(() => {
    if (measurements && Array.isArray(measurements)) {
      const xData: any[] = [];
      const yData: any[] = [];
      measurements.map((data: any) => {
        xData.push(data.date.local);
        yData.push(data.value);
      });
      //console.log(xData);
      setGraphData({ x: xData, y: yData });
    }
  }, [measurements]);

  const selectParameter = (event: SelectChangeEvent) => {
    setSelectedParameter(event.target.value);
  };

  const selectLimit = (event: SelectChangeEvent) => {
    setSelectedLimit(event.target.value)
  }

  const handleTypeChange = (event:any) => {
    setGraphType(event.target.value)
    //console.log(event.target.value)
  }

  return (
    <>
    <div className="param-container">
      <p>City: {props.city}</p>
      <p>Location: {props.location?.name}</p>
    </div>
    <div className="param-container">
      <FormControl>
        <InputLabel id="demo-simple-select-label">Parameter</InputLabel>
          <Select
            id="parameters"
            value={selectedParameter}
            label="Parameters"
            onChange={selectParameter}
            size="small"
            className="map-container__left--select"
            style={{width: '100px'}}
          >
          {parameters &&
            parameters.map((param:any) => {
              return (
                <MenuItem key={param.id} value={param}>
                  {param.name.toUpperCase()}
                </MenuItem>
              );
            })}
          </Select>  
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            
            label="Start Date"
            value={startDate}
            maxDate = {moment(Date.now())}
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            maxDate = {moment(Date.now())}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        </LocalizationProvider>
        <FormControl>
        <InputLabel id="demo-simple-select-label">Limits</InputLabel>
          <Select
            id="limits"
            value={selectedLimit}
            label="Limits"
            onChange={selectLimit}
            size="small"
            className="map-container__left--select"
            style={{width: '100px'}}
          >
          {limits &&
            limits.map((limit) => {
              return (
                <MenuItem key={limit} value={limit}>
                  {limit}
                </MenuItem>
              );
            })}
          </Select>  
        </FormControl>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '80% 20%'}}>
        {Graph[graphType]}
        <div>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Graph Type</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={graphType}
              onChange={handleTypeChange}
            >
              <FormControlLabel value="timeSeries" control={<Radio />} label="Time Series" />
              <FormControlLabel value="histogram" control={<Radio />} label="Histogram" />
            </RadioGroup>
          </FormControl>
        </div>
      </div>
    </>
  );
};

export default VisualizeMeasurements;
