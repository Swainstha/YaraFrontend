import React, { useRef } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
//import 'leaflet/dist/leaflet.css';
import {getMeasurements, getCitiesByCountry, getLatestMeasurements, getLocationsByCity} from '../store/openaq';

import {useEffect, useState,useLayoutEffect} from 'react'
import Modal from "../components/Modal";
import VisualizeMeasurements from "./VisualizeMeasurements";

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem, FormLabel, Button } from "@mui/material";
const MapComponent = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const markerRef:any = useRef([]);
    const [home, setHome] = useState({lat: 52.530823, lng:13.401819})
    const parameters:string[] = ["pm10","pm25","o3","co","no2","so2"];
    const [cities, setCities] = useState<string[]>([]);
    const [locations, setLocations] = useState<any>([]);
    const [graphData, setGraphData] = useState<any>(null);
    const [selectedCity, setSelectedCity] = useState<string|null>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const [selectedLocationIndex, setSelectedLocationIndex] = useState<number|null>(null);
    const [selectedParameter, setSelectedParameter] = useState<string>(parameters[0]);
    

    useLayoutEffect(() => {
        getCitiesByCountry("DE").then((response) => {
          const cities = response.data.results.map((city: { city: any; }) => {return city.city});
          setCities(cities);
          if(cities.length > 0){
            setSelectedCity(cities[0])
          }
        })
      },[]);

      useEffect(() => {
        if(selectedCity) {
          markerRef.current = [];
          getLocationsByCity("DE", selectedCity).then(response => {
            const locs = response.data.results.map((location:any) => {
                return {id: location.id, coordinates: location.coordinates, parameters: location.parameters, name: location.name, city: location.city}
            })
            //console.log(locs);
            setLocations(locs);
            const locsss = response.data.results;
            if(Array.isArray(locsss) && locsss.length >0) {
                setHome({lat: locsss[0].coordinates.latitude, lng: locsss[0].coordinates.longitude});
                setSelectedLocationIndex(0);
            }
          })
        }
      },[selectedCity])

    const selectCity = (event: any) => {
        setSelectedCity(event.target.value);
    }

    const viewDataByLocation = (location: any) => {
      setSelectedLocation(location);
      setIsModalOpen(true);
    }

    function MapMove(props:any) {
        //console.log(props.center)
        const map = useMap();
        map.flyTo(props.center, map.getZoom())
        return null
      }
    const handleClose = () => {
      setIsModalOpen(false);
    }

    
    const OnClickShowMarker:React.FC<{loc:number}>= (props) => {
      const map = useMap();
      useEffect(() => {
        if(locations && Array.isArray(locations) && locations.length>0) {
          if(locations[props.loc]){
            map.flyTo({lat:locations[props.loc].coordinates.latitude,lng:locations[props.loc].coordinates.longitude}, 10)
          }
      }
      },[props.loc])
      return null;
    }

    const getLocation = (event:any) => {
      const marker:any = markerRef.current[event.target.value];
      setSelectedLocationIndex(event.target.value)
        console.log("Here", event.target.value)
        if (marker) {
            marker.openPopup();
        }
    }
  return (
    <div className="map-container">
      <div className="map-container__left">
      <FormLabel id="demo-radio-buttons-group-label">Cities</FormLabel>
        <div>
        
        <Select
          id="cities"
          value={selectedCity}
          label="Cities"
          onChange={selectCity}
          size="small"
          className="map-container__left--select"
          style={{minWidth: '200px'}}
        >
          {cities && cities.map(city => {
        
        return <MenuItem key={city} value={city}>{city}</MenuItem>
      })}
        </Select>
        </div>
        <FormLabel id="demo-radio-buttons-group-label">Locations</FormLabel>
        <div>
        <Select className="map-container__left--select" size="small" value={selectedLocationIndex}  onChange={getLocation} label="Locations" style={{minWidth: '200px'}}>
        {locations && locations.map((loc:any, index:number) => {
        
          return <MenuItem key={loc.id} value={index}>{loc.name}</MenuItem>
        })}
        </Select>
        </div>
      </div>
      <MapContainer center={[home.lat, home.lng]} zoom={8} scrollWheelZoom={false} className="map-container__right">
        <MapMove center={home} />
        {selectedCity && selectedLocationIndex && <OnClickShowMarker loc={selectedLocationIndex}/>}
      
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations && Array.isArray(locations) && locations.map((loc:any, index) => {
            return <Marker key={loc.id} ref={(element) => markerRef.current[index] = element} position={[loc.coordinates.latitude, loc.coordinates.longitude]}>
              <Popup>
                <h3>{loc.name}</h3>
                {
                  Array.isArray(loc.parameters) &&loc.parameters.map((param:any) => {
                    return (
                      <p key={param.displayName}>{param.displayName}: {param.lastValue} {param.unit}</p>
                    )
                  })
                }

                <Button size="small" variant="contained" onClick={() => viewDataByLocation(loc)}>View Data</Button>
              </Popup>
          </Marker>
        })}

      </MapContainer>
      <Modal open={isModalOpen} handleClose={handleClose}>
        <VisualizeMeasurements city={selectedCity} location={selectedLocation}/>
      </Modal>
    </div>
  );
};

export default MapComponent;
