import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useRef } from 'react'
const MAP_CENTER = {lat: 52.530823, lng:13.401819}
const MARKER_POSITION = {lat: 52.530823, lng:13.401819}
const MARKER_POSITION2 = {lat: 52.530856, lng:13.401856}
function Test() {

    
    const markerRef:any = useRef([])
    const onClickShowMarker = () => {
        const marker:any = markerRef.current
        if (marker) {
            marker.openPopup()
        }
    }

    const onChange = (event:any) => {
        console.log(event.target.value);
        const marker:any = markerRef.current[event.target.value]
        if (marker) {
            marker.openPopup()
        }
    }
    return (
        <div className="App">
            <MapContainer
                style={{ width: 500, height: 500 }}
                center={MAP_CENTER}
                zoom={13}
            >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker ref={(element) => markerRef.current[0] = element} position={MARKER_POSITION}>
                    <Popup>Hello I'm a popup!</Popup>
                </Marker>
                <Marker ref={(element) => markerRef.current[1] = element} position={MARKER_POSITION2}>
                    <Popup>Hello I'm a popup2!</Popup>
                </Marker>
            </MapContainer>
            <button onClick={onClickShowMarker}>Show marker</button>
            <select onChange={onChange}>
                <option value={0}>1</option>
                <option value={1}>2</option>
            </select>
        </div>
    )
}

export default Test;