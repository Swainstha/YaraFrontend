import React from "react";
import Plot from "react-plotly.js";
const TimeSeriesgraph:React.FC<{data: any}>  = (props) => {
  //console.log(props.data,props.data.x, props.data.y);
  return (
    <>
      {props.data && <Plot
        data={[
          { type: "scatter", x: props.data.x, y: props.data.y, name: "PM10 Plot", line: {color: '#17BECF'}, mode: "lines"},
        ]}
        layout={{ width: 600, height: 400, title: "A Fancy Plot" }}
      />}
    </>
  );
};

export default TimeSeriesgraph;
