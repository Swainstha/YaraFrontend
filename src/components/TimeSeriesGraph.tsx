import { Button } from "@mui/material";
import React from "react";
import Plot from "react-plotly.js";
const TimeSeriesgraph:React.FC<{data: any, parameter: any}>  = (props) => {
  //console.log(props.data,props.data.x, props.data.y);
  return (
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
      {props.data && Array.isArray(props.data.y) && props.data.y.length > 0 ?<Plot
        data={[
          { type: "scatter", x: props.data.x, y: props.data.y, name: `Plot of ${props.parameter?.name.toUpperCase()}`, line: {color: '#17BECF'},  xaxis:"as"}
        ]}
        layout={{ width: 600, height: 400,yaxis: {title: `${props.parameter?.name.toUpperCase()} in ${props.parameter?.unit}`}, title: `Plot of ${props.parameter?.name.toUpperCase()} in ${props.parameter?.unit} vs Date` }}
      />:<p>No Data is available</p>}
    </div>
  );
};

export default TimeSeriesgraph;
