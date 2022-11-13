/**
 * This is a component to select cities and display the locations of the given city in a map.
 * Locations of the chosen city can also be selected from the dropdown menu after which a popup
 * of the chosen location marker is displayed along with the latest values of the different parameters
 * @returns {typeof DisplayMap}
 */

import React, { useRef } from "react";
import {useEffect, useState,useLayoutEffect} from 'react';

import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { Button, FormLabel, MenuItem} from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Modal from "../components/elements/Modal";
import VisualizeMeasurements from "../components/templates/VisualizeMeasurements";

import { getTimeInFormat, getDateInFormat } from "../utils/utilities";

import {getCitiesByCountry, getLocationsByCity} from '../store/openaq';
import { HomeCoordModel, LocationModel} from "../models/models";

const DisplayMap = () => {

  const markerRef:any = useRef([]);
  
  const [cities, setCities] = useState<string[]>([]);
  const [home, setHome] = useState<HomeCoordModel>({lat: 52.530823, lng:13.401819})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState<LocationModel[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationModel|null>(null);
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<string>('');
    

  //get the german cities
  useLayoutEffect(() => {
      getCitiesByCountry("DE").then((response) => {
        const cities = response.data.results.map((city: { city: any; }) => {return city.city});
        setCities(cities);
        if(cities.length > 0){
          setSelectedCity(cities[0])
        }
      })
    },[]);

  //get the locations for a selected city along with the latest measurements for 
  //all the parameters available in that location
  useEffect(() => {
    if(selectedCity) {
      markerRef.current = [];
      getLocationsByCity("DE", selectedCity).then(response => {
        const locs:LocationModel[] = response.data.results.map((location:any) => {
          let newDate;
          if(location.lastUpdated) {
            newDate =  new Date(location.lastUpdated);
            newDate = getDateInFormat(newDate) + " " + getTimeInFormat(newDate)
          } else {
            newDate = ""
          }
          return {id: location.id, lastUpdated: newDate, coordinates: location.coordinates, parameters: location.parameters, name: location.name, city: location.city}
        })
        setLocations(locs);
        const locsss = response.data.results;
        if(Array.isArray(locsss) && locsss.length >0) {
            setHome({lat: locsss[0].coordinates.latitude, lng: locsss[0].coordinates.longitude});
            setSelectedLocationIndex("0");
        }
      })
    }
  },[selectedCity]);

  const selectCity = (event: SelectChangeEvent) => {
      setSelectedCity(event.target.value);
  }

  //open the modal when a marker for a location is selected
  const viewDataByLocation = (location: LocationModel) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  }

  //move the map to a different city
  const MapMove:React.FC<{center:HomeCoordModel}>=(props) => {
      const map = useMap();
      map.flyTo(props.center, map.getZoom())
      return null
  }
  const handleClose = () => {
    setIsModalOpen(false);
  }

  //move the map to a different location as center when the location is selected in the dropdown
  const OnClickShowMarker:React.FC<{locIndex:number}>= (props) => {
    const map = useMap();
    useEffect(() => {
      if(locations && Array.isArray(locations) && locations.length>0) {
        if(locations[props.locIndex]){
          map.flyTo({lat:locations[props.locIndex].coordinates.latitude,lng:locations[props.locIndex].coordinates.longitude}, 10)
        }
    }
    },[props.locIndex])
    return null;
  }

  //open the popup of the selected location marker
  const getLocation = (event:SelectChangeEvent) => {
    const marker:any = markerRef.current[event.target.value];
    setSelectedLocationIndex(event.target.value)
    if (marker) {
        marker.openPopup();
    }
  }

  return (
    <div className="map-container">
      <div className="map-container__left">
        <p>Country: Germany</p>
        <FormLabel >Cities</FormLabel>
        <div>
          <Select
            id="cities"
            value={selectedCity}
            label="Cities"
            onChange={selectCity}
            size="small"
            className="map-container__left--select"
          >
            {cities && cities.map(city => {
              return <MenuItem key={city} value={city}>{city}</MenuItem>
            })}
          </Select>
        </div>
        <FormLabel id="locations">Locations</FormLabel>
        <div>
          <Select className="map-container__left--select" size="small" value={selectedLocationIndex}  onChange={getLocation} label="Locations">
            {locations && locations.map((loc:LocationModel, index:number) => {
            
              return <MenuItem key={loc.id} value={index.toString()}>{loc.name}</MenuItem>
            })}
          </Select>
        </div>
      </div>
      <MapContainer center={[home.lat, home.lng]} zoom={8} scrollWheelZoom={false} className="map-container__right">
        <MapMove center={home} />
        {selectedCity && selectedLocationIndex !== "" && <OnClickShowMarker locIndex={parseInt(selectedLocationIndex)}/>}
      
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations && Array.isArray(locations) && locations.map((loc:LocationModel, index) => {
            return <Marker key={loc.id} ref={(element) => markerRef.current[index] = element} position={[loc.coordinates.latitude, loc.coordinates.longitude]}>
              <Popup>
                <h3>{loc.name}</h3>
                <h4>{"Last Updated"}: {loc.lastUpdated}</h4>
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
        <VisualizeMeasurements city={selectedCity} location={selectedLocation} locations={locations}/>
      </Modal>
    </div>
  );
};

export default DisplayMap;
