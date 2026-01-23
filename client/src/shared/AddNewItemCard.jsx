import React, {useCallback, useState} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ItemDrawer from './ItemDrawer.jsx'
import {useTheme} from '@mui/material/styles'

export default function AddNewItemCard({label, type = 'Entry', count = 0, defaultValue}) {
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const handleCardClick = useCallback(() => {
        setOpen(true)
    }, [])

    return (
        <React.Fragment>

            <ItemDrawer open={open} setOpen={setOpen} type={type} defaultValue={defaultValue}
                        action={'add'}/>

            <Card
                onClick={handleCardClick} sx={{}}
                style={{
                    backgroundColor: theme.palette.card?.add,
                    color: '#fff',
                    boxShadow: 'unset',
                    placeItems: 'center',
                    cursor: 'pointer',
                }}>
                <CardContent style={{display: 'flex', placeContent: 'center', width: '100%', padding: 15}}>
                    <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        textAlign: 'center',
                    }}>
                        {label || `Add ${count > 0 ? 'New ' : ''}${type}`}
                    </div>
                </CardContent>

            </Card>

        </React.Fragment>

    )
}
