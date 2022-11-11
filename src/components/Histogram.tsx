import React from 'react';
import Plot from "react-plotly.js";

const Histogram:React.FC<{data: any}>  = (props) => {
    //console.log(props.data,props.data.x, props.data.y);
    return (
      <>
        {props.data && <Plot
          data={[
            { type: "histogram", x: props.data.y},
          ]}
          layout={{ width: 600, height: 400, title: "A Fancy Plot" }}
        />}
      </>
    );
  };

export default Histogram;