/**
 * This is a graph component that returns a Histogram plot
 * @param {GraphDataModel|null} props.compareData- the x and y values for a specific parameter of the compared location
 * @param {LocationModel|null} props.compLocation - the location data of the compared location
 * @param {GraphDataModel|null} props.data - the x and y values for a specific parameter of the chosen location
 * @param {LocationModel} props.location - the location data of the chosen location
 * @param {ParameterModel} props.parameter - the data for the chosen parameter
 * @returns {typeof Histogram}
 */

import React from 'react';

import Plot from "react-plotly.js";

import { GraphDataModel, LocationModel, ParameterModel } from '../../models/models';

const Histogram:React.FC<{compareData: GraphDataModel|null, compLocation: LocationModel|null, data: GraphDataModel|null,  location: LocationModel|null,parameter: ParameterModel|null}>  = (props) => {
    const data: any = [];
    if(props.data && props.data.y && Array.isArray(props.data.y)){
      data.push({type: "histogram", name: props.location?.name, x: props.data.y, opacity: 0.6,marker: {color: 'green'}})
    }

    if(props.compareData && props.compareData.y && Array.isArray(props.compareData.y)){
      data.push({type: "histogram", name: props.compLocation?.name, x: props.compareData.y, opacity: 0.5,marker: {color: 'red'}})
    }

    return (
      <div className="hist-container">
        {props.data && Array.isArray(props.data.y) && props.data.y.length > 0 ?<Plot
          className="plot"
          data={data}
          layout={{ barmode: "overlay",width: 600, height: 400, title: `Histogram of ${props.parameter?.name.toUpperCase()}`, xaxis:{title: `Values of ${props.parameter?.name.toUpperCase()}`}, yaxis: {title:"Frequency"}}}
        />:<p>No Data is available</p>}
      </div>
    );
  };

export default Histogram;