import React from 'react';

import Plot from "react-plotly.js";

import { GraphDataModel, LocationModel, ParameterModel } from '../../models/models';

const Histogram:React.FC<{data: GraphDataModel|null, compareData: GraphDataModel|null, parameter: ParameterModel|null, location: LocationModel|null, compLocation: LocationModel|null}>  = (props) => {
    //console.log(props.data,props.data.x, props.data.y);
    const data: any = [];
    if(props.data && props.data.y && Array.isArray(props.data.y)){
      data.push({type: "histogram", name: props.location?.name, x: props.data.y, opacity: 0.6,marker: {color: 'green'}})
    }

    if(props.compareData && props.compareData.y && Array.isArray(props.compareData.y)){
      data.push({type: "histogram", name: props.compLocation?.name, x: props.compareData.y, opacity: 0.5,marker: {color: 'red'}})
    }

    return (
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
        {props.data && Array.isArray(props.data.y) && props.data.y.length > 0 ?<Plot
          className="plot"
          data={data}
          layout={{ barmode: "overlay",width: 600, height: 400, title: `Histogram of ${props.parameter?.name.toUpperCase()}`, xaxis:{title: `Values of ${props.parameter?.name.toUpperCase()}`}, yaxis: {title:"Frequency"}}}
        />:<p>No Data is available</p>}
      </div>
    );
  };

export default Histogram;