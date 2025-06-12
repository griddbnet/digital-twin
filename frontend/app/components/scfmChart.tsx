'use client';

import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { readContainer } from '../actions';
import { ACTUAL_CONT, TWIN_CONT } from '../constants';
import { griddbRowsToObj } from '../utils';

type Schema = {
    columns: { name: "string", type: "string", timePrecision?: "string" },
    rows: any[]
}

export default function SCFMChart() {
    const [actualReading, setActualReading] = React.useState<Schema>({
        columns: {
            name: 'string',
            type: 'string'
        },
        rows: []
    });
    const [twinReading, setTwinReading] = React.useState<Schema>({
        columns: {
            name: 'string',
            type: 'string'
        },
        rows: []
    });

    const [actualDataset, setActualDataset] = React.useState([{
        ts: "",
        temp: 0.0,
        scfm: 0.0,
        gpm: 0.0,
        ambient: 0.0,
        gallons: 0

    }]);
    const [twinDataset, setTwinDataset] = React.useState([{
        ts: "",
        temp: 0.0,
        scfm: 0.0,
        gpm: 0.0,
        ambient: 0.0,
        gallons: 0

    }]);

    const [combinedDataset, setCombinedDataset] = React.useState([{}])

    React.useEffect(() => {
        const fetchData = async (container: string) => {
            const json = await readContainer(container, 100, true)
         //   console.log("Response for read : " + container, json)
            if (container === ACTUAL_CONT) {
                setActualReading(json)
            } else if (container === TWIN_CONT) {
                setTwinReading(json)
            }

        }

        setInterval(() => {
            fetchData(ACTUAL_CONT).catch(console.error)
            fetchData(TWIN_CONT).catch(console.error)
        }, 1000)


    }, [])

    React.useEffect(() => {
        const actualCols = actualReading.columns;
        const actualRows = actualReading.rows;

        if (actualRows !== undefined && actualCols  !== undefined) {
            const actualDS = griddbRowsToObj(true, actualCols, actualRows);
      //      console.log("Actual DS: ", actualDS);
    
            setActualDataset(actualDS)
   
        }

    }, [actualReading])

    React.useEffect(() => {

        const twinCols = twinReading.columns;
        const twinRows = twinReading.rows;

        if (twinRows !== undefined && twinCols !== undefined) {
            const twinDS = griddbRowsToObj(false, twinCols, twinRows);
       //     console.log("Twin DS: ", twinDS);
            setTwinDataset(twinDS)
        }

    }, [twinReading])

    React.useEffect(() => {
        const newObj = []
        newObj.push(...actualDataset)
        newObj.push(...twinDataset);
        setCombinedDataset(newObj);
        //console.log('combinedDataset: ', combinedDataset)
    }, [twinDataset])


    return (
        <>
            {
                combinedDataset.length < 2 ? <></> :
                    <LineChart
                        dataset={combinedDataset}
                        xAxis={[
                            {
                                id: "timestamp",
                                dataKey: 'ts',
                                scaleType: "time",
                                valueFormatter: (date) => {
                                    return date.getMinutes().toString()
                                },
                            },
                        ]}
                        yAxis={[
                            {
                                scaleType: 'sqrt',
                                max: 2000
                            }
                        ]}
                        series={[
                            {
                                id: 'scfm',
                                label: 'SCFM',
                                dataKey: 'scfm',
                                area: false,
                                showMark: false,
                            },
                            {
                                id: 'twin-scfm',
                                label: 'Twin SCFM',
                                dataKey: 'twin_scfm',
                                area: false,
                                showMark: false,
                            },
                        ]}
                        slotProps={{
                            legend: {
                              labelStyle: {
                                fontSize: 14,
                                fill: 'gray',
                              },
                            },
                          }}
                        height={450}
                        sx={() => ({
                            '& .MuiLineElement-root': {
                                strokeWidth: 6,
                                strokeDasharray: '15 3',
                              },
                            [`.${axisClasses.root}`]: {
                                [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                                    stroke: '#CCE1F6',
                                    strokeWidth: 3,
                                },
                                [`.${axisClasses.tickLabel}`]: {
                                    fill: '#CCE1F6',
                                },
                            },
                            width: 1
                        }
                    )}
                    />
            }


        </>
    );
}