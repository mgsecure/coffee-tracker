import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {BugReportOutlined} from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import AppContext from '../app/AppContext'

function ToggleBetaButton() {
    const {beta, setBeta, adminEnabled} = useContext(AppContext)

    const handleClick = useCallback(() => {
        setBeta(!beta)
    }, [beta, setBeta])

    if (!adminEnabled) return null

    const color = beta ? '#82c70a' : '#3b3b3b'
    return (
        <Tooltip title={`Toggle Beta Features ${beta ? 'Off' : 'On'}`} arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <BugReportOutlined fontSize='small' style={{color:color}}/>
            </IconButton>
        </Tooltip>
    )
}

export default ToggleBetaButton
