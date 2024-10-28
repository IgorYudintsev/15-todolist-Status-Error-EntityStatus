import {Dispatch} from "redux"
import {RootState} from "../../../app/store"
import {tasksApi} from "../api/tasksApi"
import {DomainTask, UpdateTaskDomainModel, UpdateTaskModel} from "../api/tasksApi.types"
import {AddTodolistActionType, changeTodolistEntityStatusAC, RemoveTodolistActionType} from "./todolists-reducer"
import {setAppErrorAC, setAppStatusAC} from "app/app-reducer";
import {ResultCode} from "common/enums";
import {handleServerNetworkError} from "common/utils/handleServerNetworkError";
import {handleServerAppError} from "common/utils/handleServerAppError";

export type TasksStateType = {
    [key: string]: DomainTask[]
}

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "SET-TASKS": {
            const stateCopy = {...state}
            stateCopy[action.payload.todolistId] = action.payload.tasks
            return stateCopy
        }
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter((t) => t.id !== action.payload.taskId),
            }
        }

        case "ADD-TASK": {
            const newTask = action.payload.task
            return {...state, [newTask.todoListId]: [newTask, ...state[newTask.todoListId]]}
        }

        case "UPDATE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
                    t.id === action.payload.taskId
                        ? {
                            ...t,
                            ...action.payload.domainModel,
                        }
                        : t,
                ),
            }
        }

        case "ADD-TODOLIST":
            return {...state, [action.payload.todolist.id]: []}
        case "REMOVE-TODOLIST": {
            let copyState = {...state}
            delete copyState[action.payload.id]
            return copyState
        }
        default:
            return state
    }
}

// Action creators
export const setTasksAC = (payload: { todolistId: string; tasks: DomainTask[] }) => {
    return {
        type: "SET-TASKS",
        payload,
    } as const
}

export const removeTaskAC = (payload: { taskId: string; todolistId: string }) => {
    return {
        type: "REMOVE-TASK",
        payload,
    } as const
}

export const addTaskAC = (payload: { task: DomainTask }) => {
    return {type: "ADD-TASK", payload} as const
}
export const updateTaskAC = (payload: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) => {
    return {
        type: "UPDATE-TASK",
        payload,
    } as const
}

// Actions types
export type SetTasksActionType = ReturnType<typeof setTasksAC>
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>

// Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    tasksApi.getTasks(todolistId).then((res) => {
        const tasks = res.data.items
        dispatch(setTasksAC({todolistId, tasks}))
        dispatch(setAppStatusAC('succeeded'))
    })
        .catch((e) => {
            dispatch(setAppStatusAC('failed'))
        })
}

export const removeTaskTC = (arg: { taskId: string; todolistId: string }) => (dispatch: Dispatch) => {
  dispatch(changeTodolistEntityStatusAC({id:arg.todolistId, entityStatus: 'loading'}))
    tasksApi.deleteTask(arg)
        .then((res) => {
            dispatch(removeTaskAC(arg))
            dispatch(changeTodolistEntityStatusAC({id:arg.todolistId, entityStatus: 'succeeded'}))
        })
        .catch((e) => {
            handleServerNetworkError({dispatch, message: e.message})
            // dispatch(setAppStatusAC('failed'))
        })
}

// export const addTaskTC = (arg: { title: string; todolistId: string }) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC('loading'))
//     tasksApi.createTask(arg)
//         .then((res) => {
//             console.log(res.data)
//             dispatch(addTaskAC({task: res.data.data.item}))
//             dispatch(setAppStatusAC('succeeded'))
//         })
//         .catch((e) => {
//             dispatch(setAppStatusAC('failed'))
//         })
// }

export const addTaskTC = (arg: { title: string; todolistId: string }) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    tasksApi.createTask(arg)
        .then(res => {
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                // if (res.data.messages.length) {
                //     dispatch(setAppErrorAC(res.data.messages[0]))
                // } else {
                //     dispatch(setAppErrorAC('Some error occurred'))
                // }

                //сократили код
                // dispatch(setAppErrorAC(res.data.messages.length ? res.data.messages[0] : 'Some error occurred'))
                // dispatch(setAppStatusAC('failed'))

                const messages = res.data.messages
                //TODO: вынесли в отдельную функцию
                handleServerAppError({dispatch, messages})


            }
        })
        .catch((e) => {
            // dispatch(setAppStatusAC('failed'))
            // dispatch(setAppErrorAC(e.message))
            handleServerNetworkError({dispatch, message: e.message})
        })
}


export const updateTaskTC =
    (arg: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) =>
        (dispatch: Dispatch, getState: () => RootState) => {
            const {taskId, todolistId, domainModel} = arg

            const allTasksFromState = getState().tasks
            const tasksForCurrentTodolist = allTasksFromState[todolistId]
            const task = tasksForCurrentTodolist.find((t) => t.id === taskId)

            if (task) {
                const model: UpdateTaskModel = {
                    status: task.status,
                    title: task.title,
                    deadline: task.deadline,
                    description: task.description,
                    priority: task.priority,
                    startDate: task.startDate,
                    ...domainModel,
                }

                dispatch(setAppStatusAC('loading'))
                tasksApi.updateTask({taskId, todolistId, model})
                    .then((res) => {
                        if (res.data.resultCode === ResultCode.Success) {
                            dispatch(setAppStatusAC('succeeded'))
                            dispatch(updateTaskAC(arg))
                        } else {
                            const messages = res.data.messages
                            //TODO: вынесли в отдельную функцию
                            handleServerAppError({dispatch, messages})

                            // if (res.data.messages.length) {
                            //     dispatch(setAppErrorAC(res.data.messages[0]))
                            // } else {
                            //     dispatch(setAppErrorAC('Some error occurred'))
                            // }
                            // dispatch(setAppStatusAC('failed'))
                        }
                    })
                    .catch((e) => {
                        //TODO: вынесли в отдельную функцию
                        handleServerNetworkError({dispatch, message: e.message})
                        // dispatch(setAppStatusAC('failed'))
                        // dispatch(setAppErrorAC(e.message))
                    })
            }
        }

type ActionsType =
    | RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTasksActionType
