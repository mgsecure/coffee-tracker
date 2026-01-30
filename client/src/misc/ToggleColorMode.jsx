import React, {useContext} from 'react'
import {useTheme} from '@mui/material/styles'
import ColorModeContext from '../app/ColorModeContext.jsx'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LightModeIcon from '@mui/icons-material/LightMode'
import AppContext from '../app/AppContext.jsx'

function ToggleColorMode() {
    const {adminEnabled} = useContext(AppContext)
    const {colorMode} = useContext(ColorModeContext)
    const theme = useTheme()

    if (!adminEnabled) return null

    return (
        <Tooltip title={`Toggle color mode to ${theme.palette.mode === 'dark' ? 'light' : 'dark'}`} arrow
                 disableFocusListener>
            <IconButton onClick={colorMode.toggleColorMode} color='inherit'>
                <LightModeIcon fontSize='small'  style={{color: theme.palette.text.secondary}}/>
            </IconButton>
        </Tooltip>
    )
}

export default ToggleColorMode