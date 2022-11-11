import React from "react";
import Plot from "react-plotly.js";
const Bargraph:React.FC<{data: any}>  = (props) => {
    //console.log(data.data,data.x, data.y);
  return (
    <>
      {props.data && <Plot
        data={[
          { type: "bar", x: props.data.x, y: props.data.y},
        ]}
        layout={{ width: 600, height: 400, title: "A Fancy Plot" }}
      />}
    </>
  );
};

export default Bargraph;
