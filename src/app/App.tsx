import CssBaseline from "@mui/material/CssBaseline"
import {ThemeProvider} from "@mui/material/styles"
import React from "react"
import {ErrorSnackbar, Header} from "common/components"
import {useAppSelector} from "common/hooks"
import {getTheme} from "common/theme"
import {selectStatus, selectThemeMode} from "./appSelectors"
import {Main} from "./Main"

export const App = () => {
    const themeMode = useAppSelector(selectThemeMode)

    return (
        <ThemeProvider theme={getTheme(themeMode)}>
            <CssBaseline/>
            <Header/>
            <Main/>
            <ErrorSnackbar/>
        </ThemeProvider>
    )
}
