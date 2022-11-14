/**
 * This is a component where parameters, start date, end date, limit can be chosen along with
 * other cities for comparision and the data received can be visualized in different graphs
 * @param {string} props.city- chosen city
 * @param {LocationModel|null} props.location - location data of the chosen location
 * @param {LocationModel[]} props.locations - array of locations of the chosen city
 * @returns {typeof VisualizeMeasurements}
 */

import React from "react";
import { useEffect, useState} from "react";

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {CircularProgress, Grid, MenuItem, FormControl, InputLabel, TextField, IconButton } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment, {Moment} from 'moment';
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from '@mui/icons-material/Close';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import DataAnalysis from '../modules/DataAnalysis';
import Histogram from "../modules/Histogram";
import TimeSeriesgraph from "../modules/TimeSeriesGraph";

import { getMeasurements} from "../../services/openaq";
import {LocationModel, GraphDataModel, ParameterModel} from '../../models/models';

import 'react-notifications/lib/notifications.css';

const VisualizeMeasurements: React.FC<{
  city: string;
  handleClose: () => void;
  location: LocationModel|null;
  locations: LocationModel[]
}> = (props) => {

  const limits: string[] = ["100", "200", "500", "1000"];

  const [compGraphData, setCompGraphData] = useState<GraphDataModel|null>(null);
  const [endDate, setEndDate] = React.useState<Moment | null>(null);
  const [graphData, setGraphData] = useState<GraphDataModel|null>(null);
  const [graphType, setGraphType] = useState<string>("timeSeries");
  const [loading, setLoading] = useState<boolean>(false);
  const [parameters, setParameters]= useState<ParameterModel[]|null>(null);
  const [selectedLimit, setSelectedLimit] = useState<string>("100");
  const [selectedLocation, setSelectedLocation] = useState<LocationModel|null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [selectedParameter, setSelectedParameter] = useState<ParameterModel|null>(null);
  const [selectedParameterId, setSelectedParameterId] = useState<string>('');
  const [startDate, setStartDate] = React.useState<Moment | null>(null);

  const Graph:any = {"histogram": <Histogram location={props.location} compLocation={selectedLocation} data={graphData} compareData={compGraphData} parameter={selectedParameter}/>, 
                  "timeSeries": <TimeSeriesgraph location={props.location} compLocation={selectedLocation} data={graphData} compareData={compGraphData} parameter={selectedParameter}/>}

  //set the available parameters(PM10, PM25, SO2 etc) for a selected location of a city
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

  //set the location data given a location id
  useEffect(() => {
    if(selectedLocationId) {
      const loc = props.locations.find(locss => locss.id === parseInt(selectedLocationId));
      if(loc) {
        setSelectedLocation(loc);
      }
    } else {
      setSelectedLocation(null);
    }
  },[selectedLocationId]);

  //set the parameter data given a parameter id
  useEffect(() => {
    if(selectedParameterId) {
      const parameter = parameters?.find(param => param.id === selectedParameterId);
      if(parameter) {
        setSelectedParameter(parameter);
      }
    }
  },[selectedParameterId])

  //get the measurements for a specific location given start date, parameter and limit
  useEffect(() => {
    if (selectedParameter && props.city && props.location && startDate && selectedLimit) {
      //suppose the end date as now if no end date is provided
      let end_date = moment(Date.now());
      if(endDate ) {
        end_date = endDate;
      }
      setLoading(true);
      getMeasurements("DE", props.city, props.location.id, selectedParameter.id, startDate, end_date, selectedLimit).then(
        (response) => {
          if (response && response.data && Array.isArray(response.data.results)) {
            setGraphData(createGraphData(response.data.results));
          }
          setLoading(false);
        }
      );
      if(selectedLocation) {
        getMeasurements("DE", props.city, selectedLocation.id, selectedParameter.id, startDate, end_date, selectedLimit).then(
          (response) => {
            if (response && response.data && Array.isArray(response.data.results)) {
              setCompGraphData(createGraphData(response.data.results));
              if(response.data.results.length === 0){
                NotificationManager.info(`Data is not available for ${selectedParameter.name} for location ${selectedLocation.name}`);
              }
            }
          }
        );
      }
    }
  }, [selectedParameter, startDate, endDate, selectedLimit]);

  //get the measurements for a different location for comparision with the chosen location
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
              if(response.data.results.length === 0){
                NotificationManager.info(`Data is not available for ${selectedParameter.name} for location ${selectedLocation.name}`);
              }
            }
          }
        );
      } else {
        setCompGraphData(null);
      }
    }
  }, [selectedLocation]);

  //create data for plotting given a set of measurements for a parameter
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
      <div className="close">
      <IconButton onClick={props.handleClose}>
            <CloseIcon />
        </IconButton>
      </div>
      <div className="param-container">
        <div className="param-container__child">
          <p>City: {props.city}</p>
          <p>Location: {props.location?.name}</p>
        </div>
        <div className="param-container__child">
        <FormControl size="small">
          <InputLabel id="compare">Compare with</InputLabel>
          <Select labelId="compare" className="param-container__compare" size="small" value={selectedLocationId}  onChange={getLocation} label="Locations">
          <MenuItem key={0} value={''}>{'No Location'}</MenuItem>
          {props.locations && Array.isArray(props.locations) && props.locations.map((loc:LocationModel, index:number) => {
          
            return <MenuItem key={loc.id} value={loc.id}>{loc.name}</MenuItem>
          })}
          </Select>
          </FormControl>
        </div>
      </div>
      <div className="param-container">
        <FormControl size="small">
          <InputLabel id="parameter">Parameter</InputLabel>
          <Select
            id="parameters"
            value={selectedParameterId}
            label="Parameters"
            onChange={selectParameter}
            size="small"
            className="param-container__select"

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
            className="param-container__select"
            renderInput={(params) => <TextField className="param-container__select" size="small" {...params} />}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            maxDate = {moment(Date.now())}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            className="param-container__select"
            renderInput={(params) => <TextField className="param-container__select" size="small" {...params} />}
          />
        </LocalizationProvider>
        <FormControl>
          <InputLabel id="limits">Limits</InputLabel>
          <Select
            id="limits"
            value={selectedLimit}
            label="Limits"
            onChange={selectLimit}
            size="small"
            className="param-container__select"
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
        <FormControl>
            <InputLabel id="graphType">GraphType</InputLabel>
            <Select
              label-id="graphType"
              value={graphType}
              label="Graph Type"
              onChange={handleTypeChange}
              size="small"
              className="param-container__select"
            >
              <MenuItem key={"timeSeries"} value={"timeSeries"}>Time Series</MenuItem>
              <MenuItem key={"histogram"} value={"histogram"}>Histogram</MenuItem>
            </Select>
          </FormControl>
      </div>
      <Grid container>
        <Grid item xs={12} sm={12} md={9} lg={9}>
          {loading?<div className="circular-progress"><CircularProgress/></div>:Graph[graphType]}
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <DataAnalysis location={props.location} compLocation={selectedLocation} data={graphData} compareData={compGraphData} parameter={selectedParameter} />
        </Grid>
      </Grid>
      <NotificationContainer/>
    </>
  );
};

export default VisualizeMeasurements;
