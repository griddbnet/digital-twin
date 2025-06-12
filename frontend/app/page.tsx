'use server';

import React from 'react';
import TempSlider from './components/tempSlider';
import ValueReads from './components/valueReads';
import SCFMChart from './components/scfmChart';
import TempChart from './components/tempChart'

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';


export default async function App() {

  return (

    <Box >
      <Grid container spacing={2} display="flex" justifyContent="center" alignItems="center" >
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }} >
          <SCFMChart />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 6 }} >
          <TempChart />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 5 }}  >
          <ValueReads />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 2 }} paddingLeft={1} >
          <TempSlider />
        </Grid>
      </Grid>
    </Box>
  );
};