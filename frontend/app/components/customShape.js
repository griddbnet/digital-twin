'use client';

import React from 'react';
import { IconCylinder } from '@tabler/icons-react'
import { IconFlame } from '@tabler/icons-react'
import {  Layer, Line, Stage, Text } from 'react-konva';

    // <li>Temp: {twinReading[1]}</li>
    // <li>SCFM: {twinReading[2]}</li>
    // <li>GPM: {twinReading[3]}</li>
    // <li>Ambient: {twinReading[4]}</li>
    // <li>Gallons: {twinReading[5]}</li>

export default function CustomShape({ actual, twin }) {

  const actualTemp = actual[1];
  const twinTemp = twin[1];

  const actualScfm = actual[2];
  const twinScfm = twin[2];

  const gpm = actual[3];
  const ambient = actual[4];
  const gallons = actual[5]

  return (
    <div className='relative'>
      <p className='absolute ml-15 left-0'>
        {ambient}°F
      </p>
      <p className='absolute mr-10 right-0'>
      {gpm} gpm
      </p>
      <p className='top-40 absolute ml-50 fon'>
        ACTUAL: {actualTemp}°F <br />
        TWIN: {twinTemp}°F <br /><br />

        {gallons}g
      </p>
      <Stage width={600} height={200} className='absolute top-0'>
        <Layer>
        <Line
          x={265}
          y={30}
          points={[0, 50, 0, 0, 200, 0]}
          tension={0}
          closed={false}
          stroke="blue"
          strokeWidth={8}
        />
        <Line
          x={250}
          y={30}
          points={[0, 50, 0, 0, -200, 0]}
          tension={0}
          closed={false}
          stroke="red"
          strokeWidth={8}
        />
        </Layer>
      </Stage>
      <IconCylinder stroke={1} height={400} width={500} className='z-10' />
      <IconFlame stroke={1} height={150} width={500} color='orangered' fill='orange' className='relative bottom-35' />

      <p className='absolute top-100 ml-20 leading-8'>
        ACTUAL: {actualScfm} <br /> 
        TWIN: {twinScfm}
      </p>

      <Stage width={400} height={100} className='absolute top-90'>
      <Layer>

        <Line
          x={250}
          y={70}
          points={[0, -40, 0, 0, -200, 0]}
          tension={0}
          closed={false}
          stroke="orange"
          strokeWidth={8}
        />

      </Layer>
      </Stage>

    </div>

  );
}