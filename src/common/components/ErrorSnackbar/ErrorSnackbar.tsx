import {SyntheticEvent, useEffect, useState} from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import {useAppDispatch, useAppSelector} from "common/hooks";
import {selectError, selectStatus} from "app/appSelectors";
import {setAppErrorAC} from "app/app-reducer";

export const ErrorSnackbar = () => {
    const error = useAppSelector(selectError)
    const dispatch = useAppDispatch()

    //const [open, setOpen] = useState(true)

    const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
        // console.log(event)
        // dispatch(setAppErrorAC('TEST ERROR MESSAGE'))
        if (reason === 'clickaway') {
            return
        }
        dispatch(setAppErrorAC(null))
        }

    return (
        <Snackbar open={error!==null} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" variant="filled" sx={{width: '100%'}}>
                {error}
            </Alert>
        </Snackbar>
    )
}

//--------------------------------------------------------------------------------

// import { SyntheticEvent, useState } from 'react'
// import Alert from '@mui/material/Alert'
// import Snackbar from '@mui/material/Snackbar'
//
// export const ErrorSnackbar = () => {
//     const [open, setOpen] = useState(true)
//     console.log(open)
//     const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
//         console.log(event)
//         if (reason === 'clickaway') {
//             return
//         }
//
//         setOpen(false)
//     }
//
//     return (
//         <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//             <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
//                 Error message
//             </Alert>
//         </Snackbar>
//     )
// }