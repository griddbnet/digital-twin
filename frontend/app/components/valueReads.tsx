'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import ErrorIndicator from './errorIndicator';
import CustomShape from './customShape';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';


import { readContainer } from '../actions';
import { ACTUAL_CONT, TWIN_CONT } from '../constants';
import { checkForDiscrepency } from '../utils';


export default function ValueReads() {


    const [displayTemp, setDisplayTemp] = React.useState(false);
    const [displayScfm, setDisplayScfm] = React.useState(false);
    const [actualReading, setActualReading] = React.useState([]);
    const [twinReading, setTwinReading] = React.useState([]);
    React.useEffect(() => {

        const fetchData = async (container: string) => {
            const json = await readContainer(container, 1000, false)
            //     console.log("Response for read : " + container, json.rows)
            if (json.rows !== undefined) {
                if (container === ACTUAL_CONT) {
                    setActualReading(json.rows[0])
                } else if (container === TWIN_CONT) {
                    setTwinReading(json.rows[0])
                }
            }

        }

        setInterval(() => {
            fetchData(ACTUAL_CONT).catch(console.error)
            fetchData(TWIN_CONT).catch(console.error)
        }, 1000)
    }, [])

    React.useEffect(() => {
        const actualTemp = actualReading[1];
        const twinTemp = twinReading[1];
        const actualScfm = actualReading[2];
        const twinScfm = twinReading[2];

        const tempDiscrepency = checkForDiscrepency(actualTemp, twinTemp);
        const scfmDiscrepency = checkForDiscrepency(actualScfm, twinScfm);

        if (tempDiscrepency !== null) {
            setDisplayTemp(true);
        } else {
            setDisplayTemp(false);
        }

        if (scfmDiscrepency !== null) {
            setDisplayScfm(true);
        } else {
            setDisplayScfm(false);
        }

    }, [actualReading, twinReading])


    return (
        <Stack sx={{ height: 500 }} padding={5} spacing={2} direction="row">
            <Stack>
                <CustomShape 
                    actual={actualReading}
                    twin={twinReading}
                />
            </Stack>

            <Grid >
                <Box>
                    <ErrorIndicator
                        errorMsg='Temp Anomaly'
                        display={displayTemp}
                    />
                    <ErrorIndicator
                        errorMsg='scfm Anomaly'
                        display={displayScfm}
                    />
                </Box>
            </Grid>

        </Stack>
    )
}