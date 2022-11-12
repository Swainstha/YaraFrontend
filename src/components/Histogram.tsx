import React from 'react';
import Plot from "react-plotly.js";

const Histogram:React.FC<{data: any, parameter: any}>  = (props) => {
    //console.log(props.data,props.data.x, props.data.y);
    return (
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        {props.data && Array.isArray(props.data.y) && props.data.y.length > 0 ?<Plot
          className="plot"
          data={[
            { type: "histogram", x: props.data.y},
          ]}
          layout={{ width: 600, height: 400, title: `Histogram of ${props.parameter?.name.toUpperCase()}`, xaxis:{title: `Values of ${props.parameter?.name.toUpperCase()}`}, yaxis: {title:"Frequency"}}}
        />:<p>No Data is available</p>}
      </div>
    );
  };

export default Histogram;