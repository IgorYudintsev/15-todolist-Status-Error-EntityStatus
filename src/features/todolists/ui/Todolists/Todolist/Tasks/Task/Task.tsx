import { EditableSpan } from "common/components"
import { TaskStatus } from "common/enums"
import { useAppDispatch } from "common/hooks"
import { DomainTask } from "../../../../../api/tasksApi.types"
import { removeTaskTC, updateTaskTC } from "../../../../../model/tasks-reducer"
import { DomainTodolist } from "../../../../../model/todolists-reducer"
import { getListItemSx } from "./Task.styles"
import { ChangeEvent } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const Task = ({ task, todolist }: Props) => {
  const dispatch = useAppDispatch()
  console.log(todolist.entityStatus)


  const removeTaskHandler = () => {
    dispatch(removeTaskTC({ taskId: task.id, todolistId: todolist.id }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    dispatch(updateTaskTC({ taskId: task.id, todolistId: todolist.id, domainModel: { status } }))
  }

  const changeTaskTitleHandler = (title: string) => {
    dispatch(updateTaskTC({ taskId: task.id, todolistId: todolist.id, domainModel: { title } }))
  }

  return (
    <ListItem key={task.id} sx={getListItemSx(task.status === TaskStatus.Completed)}>
      <div >
        <Checkbox checked={task.status === TaskStatus.Completed} onChange={changeTaskStatusHandler} disabled={todolist.entityStatus==='loading'} />
        <EditableSpan value={task.title} onChange={changeTaskTitleHandler} disabled={todolist.entityStatus==='loading'} />
      </div>
      <IconButton onClick={removeTaskHandler} disabled={todolist.entityStatus==='loading'}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
