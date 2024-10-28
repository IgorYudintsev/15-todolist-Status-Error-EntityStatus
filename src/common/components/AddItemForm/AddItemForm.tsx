import {ChangeEvent, KeyboardEvent, useState} from "react"
import TextField from "@mui/material/TextField"
import AddBoxIcon from "@mui/icons-material/AddBox"
import IconButton from "@mui/material/IconButton"
import {RequestStatus} from "app/app-reducer";

type Props = {
  addItem: (title: string) => void
  entityStatus?:RequestStatus
  }

export const AddItemForm = ({ addItem,entityStatus }: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)


  const addItemHandler = () => {
    if (title.trim() !== "") {
      addItem(title.trim())
      setTitle("")
    } else {
      setError("Title is required")
    }
  }

  const changeItemHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
  }

  const addItemOnKeyUpHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    setError(null)
    if (event.key === "Enter") {
      addItemHandler()
    }
  }
  return (
    <div>
      <TextField
        label="Enter a title"
        variant={"outlined"}
        value={title}
        size={"small"}
        error={!!error}
        helperText={error}
        onChange={changeItemHandler}
        onKeyUp={addItemOnKeyUpHandler}
      />
      <IconButton onClick={addItemHandler} color={"primary"}
                  disabled={entityStatus==='loading'}
      >
        <AddBoxIcon />
      </IconButton>
    </div>
  )
}
