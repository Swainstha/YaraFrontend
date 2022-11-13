import React from "react";

import Plot from "react-plotly.js";

import { GraphDataModel, LocationModel, ParameterModel } from '../../models/models';

const TimeSeriesgraph:React.FC<{data: GraphDataModel|null, compareData: GraphDataModel|null, parameter: ParameterModel|null, location: LocationModel|null, compLocation: LocationModel|null}>  = (props) => {
  //console.log(props.data,props.data.x, props.data.y);
  const data: any = [];
  if(props.data && props.data.y && Array.isArray(props.data.y)){
    data.push({type: "scatter", mode:"lines", name: props.location?.name, x: props.data.x, y: props.data.y, opacity: 0.6,line: {color: 'green'}})
  }

    if(props.compareData && props.compareData.y && Array.isArray(props.compareData.y)){
      data.push({type: "scatter", mode: "lines", name: props.compLocation?.name, x: props.compareData.x, y: props.compareData.y, opacity: 0.5,line: {color: 'red'}})
    }

  return (
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
      {props.data && Array.isArray(props.data.y) && props.data.y.length > 0 ?<Plot
        data={data}
        layout={{ width: 600, height: 400,yaxis: {title: `${props.parameter?.name.toUpperCase()} in ${props.parameter?.unit}`}, title: `Plot of ${props.parameter?.name.toUpperCase()} in ${props.parameter?.unit} vs Date` }}
      />:<p>No Data is available</p>}
    </div>
  );
};

export default TimeSeriesgraph;
