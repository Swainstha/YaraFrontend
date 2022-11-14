/**
 * This is a graph component that returns a Histogram plot
 * @param {GraphDataModel|null} props.compareData- the x and y values for a specific parameter of the compared location
 * @param {LocationModel|null} props.compLocation - the location data of the compared location
 * @param {GraphDataModel|null} props.data - the x and y values for a specific parameter of the chosen location
 * @param {LocationModel} props.location - the location data of the chosen location
 * @param {ParameterModel} props.parameter - the data for the chosen parameter
 * @returns {typeof Histogram}
 */

import React,{useState, useEffect} from 'react';

import Plot from "react-plotly.js";

import useWindowDimensions from "../../hooks/useWindowDimensions";

import { GraphDataModel, LocationModel, ParameterModel } from '../../models/models';

const Histogram:React.FC<{compareData: GraphDataModel|null, compLocation: LocationModel|null, data: GraphDataModel|null,  location: LocationModel|null,parameter: ParameterModel|null}>  = (props) => {
  
  const { height, width } = useWindowDimensions();

  const [size, setSize] = useState<number|undefined>();

  useEffect(() => {
    let newWidth = (width*4)/5;
    if(width > 1500) {
      newWidth = (width *1.5)/5;
      
    } else if(width > 1200) {
      newWidth = (width *2.5)/5;
      
    } else if(width > 900) {
      newWidth = (width * 3)/5;
    } else {
      newWidth = (width*4)/5;
    }
    setSize(newWidth);
  },[width]);

    const data: any = [];
    if(props.data && props.data.y && Array.isArray(props.data.y)){
      data.push({type: "histogram", name: props.location?.name, x: props.data.y, opacity: 0.6,marker: {color: 'green'}})
    }

    if(props.compareData && props.compareData.y && Array.isArray(props.compareData.y)){
      data.push({type: "histogram", name: props.compLocation?.name, x: props.compareData.y, opacity: 0.5,marker: {color: 'red'}})
    }

    return (
      <div className="hist-container">
        {props.data && size && Array.isArray(props.data.y) && props.data.y.length > 0 ?<Plot
          className="plot"
          data={data}
          
          layout={{ barmode: "overlay", width: size, title: `Histogram of ${props.parameter?.name.toUpperCase()}`, xaxis:{title: `Values of ${props.parameter?.name.toUpperCase()}`}, yaxis: {title:"Frequency"}}}
        />:props.parameter?<p>No Data is available</p>:<p>Start by choosing a parameter and a start date</p>}
      </div>
    );
  };

export default Histogram;