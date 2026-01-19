import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import AppContext from './AppContext.jsx'
import SystemUpdateIcon from '@mui/icons-material/SystemUpdate'

function VersionChecker() {

    const {updateRequired, updateAvailable} = useContext(AppContext)

    const handleClick = useCallback(() => location.reload(), [])

    if (!updateAvailable && !updateRequired) return null

    if (updateRequired) return (
        <Backdrop
            sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
            open={true} onClick={null}
        >
            <div style={{
                width: 300,
                padding: 40,
                backgroundColor: '#000',
                textAlign: 'center',
                border: '1px solid #bbb',
                fontWeight: 700
            }}>
                A new version of the site is available.
                Please reload the page to continue.<br/><br/>
                <div>
                    <Button variant='contained' color='secondary' onClick={handleClick} style={{color: '#000'}}>
                        Reload
                    </Button>
                </div>

            </div>
        </Backdrop>
    )

    if (updateAvailable) return (
        <React.Fragment>
            <Tooltip title='New Version Available' arrow disableFocusListener>
                <IconButton
                    onClick={handleClick}
                    style={{color: '#08a108', margin: '6px 0px 0px 4px', height: 36, width: 36}}
                >
                    <SystemUpdateIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )


}

export default VersionChecker
