import React from "react";
import { useEffect, useState} from "react";

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { MenuItem, FormLabel, FormControl, InputLabel, FormControlLabel, RadioGroup,Radio, TextField } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment, {Moment} from 'moment';
import Select, { SelectChangeEvent } from "@mui/material/Select";

import Histogram from "../components/Histogram";
import TimeSeriesgraph from "../components/TimeSeriesGraph";

import { getMeasurements} from "../store/openaq";
import {LocationModel, GraphDataModel, ParameterModel} from '../models/models'

const VisualizeMeasurements: React.FC<{
  city: string;
  location: LocationModel|null;
  locations: LocationModel[]
}> = (props) => {

  const limits: string[] = ["100", "200", "500", "1000"];

  const [compGraphData, setCompGraphData] = useState<GraphDataModel|null>(null);
  const [endDate, setEndDate] = React.useState<Moment | null>(null);
  const [graphData, setGraphData] = useState<GraphDataModel|null>(null);
  const [graphType, setGraphType] = useState<string>("timeSeries");
  const [parameters, setParameters]= useState<ParameterModel[]|null>(null);
  const [selectedLimit, setSelectedLimit] = useState<string>("100");
  const [selectedLocation, setSelectedLocation] = useState<LocationModel|null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedParameter, setSelectedParameter] = useState<ParameterModel|null>(null);
  const [selectedParameterId, setSelectedParameterId] = useState<string>('');
  const [startDate, setStartDate] = React.useState<Moment | null>(null);

  const Graph:any = {"histogram": <Histogram location={props.location} compLocation={selectedLocation} data={graphData} compareData={compGraphData} parameter={selectedParameter?selectedParameter:""}/>, 
                  "timeSeries": <TimeSeriesgraph location={props.location} compLocation={selectedLocation} data={graphData} compareData={compGraphData} parameter={selectedParameter?selectedParameter:""}/>}

  useEffect(() => {
    if(props.location && Array.isArray(props.location.parameters)) {
      const params:any = [];
      props.location.parameters.map((param: any) => {
        params.push({id:param.parameter, name: param.displayName, unit: param.unit})
      })
      setParameters(params);
      setSelectedParameter(null);
      setSelectedParameterId('');
      setSelectedLocation(null);
      setSelectedLocationId('')
    }
  },[props.location]);

  useEffect(() => {
    if(selectedLocationId) {
      const loc = props.locations.find(locss => locss.id === parseInt(selectedLocationId));
      if(loc) {
        setSelectedLocation(loc);
      }
    }
  },[selectedLocationId]);

  useEffect(() => {
    if(selectedParameterId) {
      const parameter = parameters?.find(param => param.id === selectedParameterId);
      if(parameter) {
        setSelectedParameter(parameter);
      }
    }
  },[selectedParameterId])

  useEffect(() => {
    if (selectedParameter && props.city && props.location && startDate && selectedLimit) {
      let parameter = props.location
      let end_date = moment(Date.now());
      if(endDate ) {
        end_date = endDate;
      }
      getMeasurements("DE", props.city, props.location.id, selectedParameter.id, startDate, end_date, selectedLimit).then(
        (response) => {
          if (response && response.data && Array.isArray(response.data.results)) {
            setGraphData(createGraphData(response.data.results));
          }
        }
      );
      if(selectedLocation) {
        getMeasurements("DE", props.city, selectedLocation.id, selectedParameter.id, startDate, end_date, selectedLimit).then(
          (response) => {
            if (response && response.data && Array.isArray(response.data.results)) {
              setCompGraphData(createGraphData(response.data.results));
            }
          }
        );
      }
    }
  }, [selectedParameter, startDate, endDate, selectedLimit]);

  useEffect(() => {
    if (selectedParameter && props.city && props.location && startDate && selectedLimit) {
      let end_date = moment(Date.now());
      if(endDate ) {
        end_date = endDate;
      }
      if(selectedLocation) {
        getMeasurements("DE", props.city, selectedLocation.id, selectedParameter.id, startDate, end_date, selectedLimit).then(
          (response) => {
            if (response && response.data && Array.isArray(response.data.results)) {
              setCompGraphData(createGraphData(response.data.results));
            }
          }
        );
      } else {
        setCompGraphData(null);
      }
    }
  }, [selectedLocation]);

  const createGraphData = (data:any) => {
    const xData: string[] = [];
    const yData: number[] = [];
    if(Array.isArray(data)) {
      data.map((d: any) => {
        xData.push(d.date.local);
        yData.push(d.value);
      });
    } 
    return({ x: xData, y: yData });
  }

  /*useEffect(() => {
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
    if(compMeasurements && Array.isArray(compMeasurements)) {
      const xData: any[] = [];
      const yData: any[] = [];
      compMeasurements.map((data: any) => {
        xData.push(data.date.local);
        yData.push(data.value);
      });
      //console.log(xData);
      setCompGraphData({ x: xData, y: yData });
    }
  }, [measurements, compMeasurements]);*/

  const selectParameter = (event: SelectChangeEvent) => {
    setSelectedParameterId(event.target.value);
  };

  const selectLimit = (event: SelectChangeEvent) => {
    setSelectedLimit(event.target.value)
  }

  const handleTypeChange = (event:any) => {
    setGraphType(event.target.value)
  }

  const getLocation = (event:SelectChangeEvent) => {
    setSelectedLocationId(event.target.value);
  }

  return (
    <>
    <div className="param-container">
      <div className="param-container__child">
        <p>City: {props.city}</p>
        <p>Location: {props.location?.name}</p>
      </div>
      <div className="param-container__child">
        <p>Compare Locations</p>
        <Select className="map-container__left--select" size="small" value={selectedLocation?.toString()}  onChange={getLocation} label="Locations" style={{minWidth: '200px'}}>
        <MenuItem key={0} value={''}>{'No Location'}</MenuItem>
        {props.locations && Array.isArray(props.locations) && props.locations.map((loc:LocationModel, index:number) => {
        
          return <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
        })}
        </Select>
      </div>
    </div>
    <div className="param-container">
      <FormControl>
        <InputLabel id="demo-simple-select-label">Parameter</InputLabel>
          <Select
            id="parameters"
            value={selectedParameterId}
            label="Parameters"
            onChange={selectParameter}
            size="small"
            className="map-container__left--select"
            style={{width: '100px'}}
          >
          {parameters &&
            parameters.map((param:ParameterModel) => {
              return (
                <MenuItem key={param.id} value={param.id}>
                  {param?.name.toUpperCase()}
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
