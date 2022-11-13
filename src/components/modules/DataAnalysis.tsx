import React, { useEffect, useState } from 'react';

import { GraphDataModel, LocationModel, ParameterModel } from '../../models/models';

const DataAnalysis:React.FC<{compareData: GraphDataModel|null, compLocation: LocationModel|null, data: GraphDataModel|null,  location: LocationModel|null,parameter: ParameterModel|null}>  = (props) => {
    
    const [dataStats, setDataStats] = useState<any>(null);
    const [compDataStats, setCompDataStats] = useState<any>(null);
    useEffect(() => {
        if(props.data && Array.isArray(props.data.y) && props.data.y.length >0) {
            setDataStats(getStandardDeviation(props.data));
        }
    },[props.data]);

    useEffect(() => {
        if(props.compareData && Array.isArray(props.compareData.y) && props.compareData.y.length >0) {
            setCompDataStats(getStandardDeviation(props.compareData));
        } else {
            setCompDataStats(null)
        }
    },[props.compareData]);

    const getStandardDeviation = (graphData: GraphDataModel) => {
        const n = graphData.y.length
        const mean = graphData.y.reduce((a, b) => a + b) / n
        const sd = Math.sqrt(graphData.y.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
        const min = Math.min(...graphData.y);
        const max = Math.max(...graphData.y);
        return {n, mean, sd, min, max}
      }

    return (
        <div className="data-analysis">
            {dataStats && <div className="data-analysis__child">
                <p>Location: {props.location?.name}</p>
                <p>Data length: {dataStats.n}</p>
                <p>Mean: {dataStats.mean.toFixed(2)} {props.parameter?.unit}</p>
                <p>SD: {dataStats.sd.toFixed(2)} {props.parameter?.unit}</p>
                <p>Max value: {dataStats.max} {props.parameter?.unit}</p>
                <p>Min value: {dataStats.min} {props.parameter?.unit}</p>
            </div>}
            {compDataStats && <div className="data-analysis__child">
                <p>Location: {props.compLocation?.name}</p>
                <p>Data length: {compDataStats.n}</p>
                <p>Mean: {compDataStats.mean.toFixed(2)} {props.parameter?.unit}</p>
                <p>SD: {compDataStats.sd.toFixed(2)} {props.parameter?.unit}</p>
                <p>Max value: {compDataStats.max} {props.parameter?.unit}</p>
                <p>Min value: {compDataStats.min} {props.parameter?.unit}</p>
            </div>}

        </div>
    )
}

export default DataAnalysis;