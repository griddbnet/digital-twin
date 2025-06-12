'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';

import { pushToBoilerCont, readContainer } from '../actions';
import { BOILER_CONT, marks } from '../constants';

function getAriaValueText(value: number) {
  return `${value}°F`;
}

export default function TempSlider() {

  const [sliderVal, setSliderVal] = React.useState<number>(0);
  const handleSlider = async ( element: Event,newVal: number | number[]) => {
    setSliderVal(newVal as number);
  }

  const pushToCloud = () => {
    const now = new Date();
    const data = [];
    data.push(now);
    data.push(sliderVal);
    pushToBoilerCont(data);
  }


  React.useEffect(() => {
    const fetchData = async () => {
      const json = await readContainer(BOILER_CONT, 1000, false)
    //  console.log("Response for read container: ", json)
    if (json.rows) {
      const latestRow = json.rows[0] //sorted by ts, so this is always newest
      console.log("current temp: ", latestRow[1]);
      const currentBoilerTemp = latestRow[1];
      setSliderVal(currentBoilerTemp)
    }

    }

    fetchData().catch(console.error)
  }, [])



  return (
    <Stack sx={{ height: 420 }} padding={5} spacing={2} direction="column" >

    
      <Slider
        
        aria-label='Boiler Temperature'
        getAriaLabel={() => 'Temperature'}
        orientation="vertical"
        valueLabelFormat={getAriaValueText}
        valueLabelDisplay="on"
        marks={marks}
        min={0}
        max={212}
        onChangeCommitted={pushToCloud}
        onChange={handleSlider}
        value={sliderVal}
        color='info'
        sx={{
          '& .MuiSlider-markLabel': {
            color: 'white',
          },
        }}
      />

    </Stack>
  );
};
