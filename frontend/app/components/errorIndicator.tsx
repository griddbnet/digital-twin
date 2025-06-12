'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import SnackbarContent from '@mui/material/SnackbarContent';


export default function ErrorIndicator(props: { errorMsg: string, display: boolean }) {

    const { errorMsg, display } = props;


    return (
        <Stack>
            {display ? <SnackbarContent
                message={errorMsg}
                sx={{
                    position: 'unset',
                    margin: 4,
                    backgroundColor: '#cc0000',
                    minWidth: "100px !important",
                    maxWidth: "100px !important"
                }}
            /> :
                <></>

            }

        </Stack>
    )
}