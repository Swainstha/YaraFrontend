/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import logo from './logo.svg';
import './App.css';


import LatestMeasurements from './containers/LatestMeasurements';
import VisualizeMeasurements from './containers/VisualizeMeasurements';
import MapComponent from './containers/MapComponent';
import Test from './containers/Test'

const  App = () => {
  return(<div>
    <MapComponent />
    
  </div>)
}

export default App;
