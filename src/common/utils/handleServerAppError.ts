import {setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {AppDispatch} from "app/store";

export const handleServerAppError = (payload: { dispatch: AppDispatch, messages:string[]
}) => {
    const {dispatch, messages} = payload
    dispatch(setAppErrorAC(messages.length !== 0 ? messages[0] : 'Some error occurred'))
    dispatch(setAppStatusAC('failed'))
}


// export const handleServerAppError = (payload: { dispatch: AppDispatch, length: number, message: string }) => {
//     const {dispatch, length, message} = payload
//
//     // if (length!==0) {
//     //     dispatch(setAppErrorAC(message))
//     // } else {
//     //     dispatch(setAppErrorAC('Some error occurred'))
//     // }
//
//     dispatch(setAppErrorAC(length !== 0 ? message : 'Some error occurred'))
//     dispatch(setAppStatusAC('failed'))
// }