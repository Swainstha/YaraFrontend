import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";

const CustomMarker:React.FC<{isActive: boolean, data: any, map:any}> = (props) => {
    const [refReady, setRefReady] = useState(false);
    let popupRef:any = useRef();
  
    useEffect(() => {
      if (refReady && props.isActive) {
        popupRef.openOn(props.map);
      }
    }, [props.isActive, refReady, props.map]);
  
    return (
      <Marker position={props.data.position}>
        <Popup
          ref={(r:any) => {
            popupRef = r;
            setRefReady(true);
          }}
        >
          Yupperz
        </Popup>
      </Marker>
    );
  };
  
  export default CustomMarker;