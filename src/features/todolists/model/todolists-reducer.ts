import {Dispatch} from "redux"
import {todolistsApi} from "../api/todolistsApi"
import {Todolist} from "../api/todolistsApi.types"
import {RequestStatus, setAppStatusAC} from "app/app-reducer";
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {handleServerAppError} from "common/utils/handleServerAppError";
import {ResultCode} from "common/enums";
import {updateTaskAC} from "./tasks-reducer";

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
    filter: FilterValuesType
    entityStatus: RequestStatus    // чтобы дисэблить-пытаемся избежать конфликтов.
}

//TODO: entityStatus -чтобы избежать конфликтов: чтобы нельзя было несколько раз щелкнуть по кнопке, пока не пришел ответ с сервера
// -задисэблим кнопку

const initialState: DomainTodolist[] = []

export const todolistsReducer = (state: DomainTodolist[] = initialState, action: ActionsType): DomainTodolist[] => {
    switch (action.type) {
        case "SET-TODOLISTS": {
            return action.todolists.map((tl) => ({
                ...tl, filter: "all",
                entityStatus: 'idle'
            }))
        }

        case "REMOVE-TODOLIST": {
            return state.filter((tl) => tl.id !== action.payload.id)
        }

        case "ADD-TODOLIST": {
            const newTodolist: DomainTodolist = {
                ...action.payload.todolist,
                filter: "all",
                entityStatus: 'idle'

            }
            return [newTodolist, ...state]
        }

        case "CHANGE-TODOLIST-TITLE": {
            return state.map((tl) => (tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl))
        }

        case "CHANGE-TODOLIST-FILTER": {
            return state.map((tl) => (tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl))
        }
        case "CHANGE-TODOLIST-ENTITY-STATUS": {
            return state.map((tl => tl.id === action.payload.id ? {
                ...tl,
                entityStatus: action.payload.entityStatus
            } : tl))
        }

        default:
            return state
    }
}

// Action creators
export const removeTodolistAC = (id: string) => {
    return {type: "REMOVE-TODOLIST", payload: {id}} as const
}

export const addTodolistAC = (todolist: Todolist) => {
    return {type: "ADD-TODOLIST", payload: {todolist}} as const
}

export const changeTodolistTitleAC = (payload: { id: string; title: string }) => {
    return {type: "CHANGE-TODOLIST-TITLE", payload} as const
}

export const changeTodolistFilterAC = (payload: { id: string; filter: FilterValuesType }) => {
    return {type: "CHANGE-TODOLIST-FILTER", payload} as const
}

export const setTodolistsAC = (todolists: Todolist[]) => {
    return {type: "SET-TODOLISTS", todolists} as const
}

// Actions types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type changeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>


// Thunks

export const changeTodolistEntityStatusAC = (payload: {
    id: string
    entityStatus: RequestStatus
}) => {
    return {type: 'CHANGE-TODOLIST-ENTITY-STATUS', payload} as const
}


export const fetchTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsApi.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e) => {
            dispatch(setAppStatusAC('failed'))
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsApi.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                const messages = res.data.messages
                //TODO: вынесли в отдельную функцию
                handleServerAppError({dispatch, messages})
            }
        })
        .catch((e) => {
            handleServerNetworkError({dispatch, message: e.message})
        })
}


// export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC('loading'))
//     todolistsApi.createTodolist(title)
//         .then((res) => {
//             dispatch(addTodolistAC(res.data.data.item))
//             dispatch(setAppStatusAC('succeeded'))
//             console.log(res.data)
//             // handleServerAppError({dispatch,})
//         })
//         .catch((e) => {
//             // dispatch(setAppStatusAC('failed'))
//             handleServerNetworkError({dispatch, message: e.message})
//         })
// }

export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC({id, entityStatus: 'loading'}))
    todolistsApi.deleteTodolist(id)
        .then((res) => {
            dispatch(removeTodolistAC(id))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e) => {
            dispatch(changeTodolistEntityStatusAC({id, entityStatus: 'succeeded'}))
            handleServerNetworkError({dispatch, message: e.message})
            // dispatch(setAppStatusAC('failed'))
        })
}

export const updateTodolistTitleTC = (arg: { id: string; title: string }) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsApi.updateTodolist(arg)
        .then((res) => {
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(changeTodolistTitleAC(arg))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                const messages = res.data.messages
                //TODO: вынесли в отдельную функцию
                handleServerAppError({dispatch, messages})
            }
        })
        .catch((e) => {
            handleServerNetworkError({dispatch, message: e.message})
        })
}

type ActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType
    | changeTodolistEntityStatusActionType
