import React from 'react';
import Plot from "react-plotly.js";

const Histogram:React.FC<{data: any}>  = (props) => {
    //console.log(props.data,props.data.x, props.data.y);
    return (
      <div>
        {props.data && <Plot
          className="plot"
          data={[
            { type: "histogram", x: props.data.y},
          ]}
          layout={{ width: 600, height: 400, title: "A Fancy Plot"}}
        />}
      </div>
    );
  };

export default Histogram;