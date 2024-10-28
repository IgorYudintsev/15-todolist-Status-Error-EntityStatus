export type ThemeMode = "dark" | "light"

type InitialState = typeof initialState
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
//                       'бездействие'  это для крутилок

const initialState = {
    themeMode: "light" as ThemeMode,
    status: 'idle' as RequestStatus,  // это для крутилок
    error: null as string | null,   // это передаем для всплывашки Ошибок внизу
}

export const appReducer = (state: InitialState = initialState, action: ActionsType): InitialState => {
    switch (action.type) {
        case "CHANGE_THEME": {
            return {...state, themeMode: action.payload.themeMode}
        }

        case "SET_STATUS": {
            return {...state, status: action.payload.status}
        }

        case "SET_ERROR": {
            return {...state, error: action.payload.error}
        }
        default:
            return state
    }
}

// Action creators
export const changeThemeAC = (themeMode: ThemeMode) => {
    return {
        type: "CHANGE_THEME",
        payload: {themeMode},
    } as const
}

export const setAppStatusAC = (status: RequestStatus) => {
    return {
        type: "SET_STATUS",
        payload: {status},
    } as const
}

export const setAppErrorAC = (error: string | null) => {
    return {
        type: "SET_ERROR",
        payload: {error},
    } as const
}


// Actions types
type ChangeThemeActionType = ReturnType<typeof changeThemeAC>
type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
type SetAppErrorACType=ReturnType<typeof setAppErrorAC>

type ActionsType = ChangeThemeActionType | SetAppStatusACType | SetAppErrorACType
