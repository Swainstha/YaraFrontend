import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

const Locations:React.FC<{locations:any, markerRef:any, viewDataByLocation:any}> = (props) => {
    useEffect(() => {
        console.log("Change here")
    },[props]);
    return<>
    {
        Array.isArray(props.locations) && props.locations.map((loc:any, index) => {
            return <Marker key={loc.id} ref={(element) => props.markerRef.current[index] = element} position={[loc.coordinates.latitude, loc.coordinates.longitude]}>
              <Popup>
                <p>{loc.name}</p>
                {
                  Array.isArray(loc.parameters) &&loc.parameters.map((param:any) => {
                    return (
                      <p>{param.displayName}: {param.lastValue} {param.unit}</p>
                    )
                  })
                }
                <button onClick={() => props.viewDataByLocation(loc.id, loc.city)}>View Data</button>
              </Popup>
          </Marker>
        })}
    </>
}

export default Locations;