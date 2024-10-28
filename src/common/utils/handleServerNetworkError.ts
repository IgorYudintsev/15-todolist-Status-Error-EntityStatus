import {setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {AppDispatch} from "app/store";

export const handleServerNetworkError=(payload:{dispatch:AppDispatch,message:string})=>{
    const{dispatch,message}=payload
    dispatch(setAppStatusAC('failed'))
    dispatch(setAppErrorAC(message))
}