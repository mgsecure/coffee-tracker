import React from 'react'
import Box from '@mui/material/Box'
import screensCoffees from './screens/ct-screens-coffees.png'
import screensCoffeesOpen from './screens/ct-screens-coffee-open.png'
import screensBrews from './screens/ct-screens-brews.png'
import yieldTimer from './screens/ct-screens-yield-timer.png'

function ScreenshotsPage() {

    const boxShadow = '1px 3px 3px 0px rgba(0, 0, 0, 0.6), 1px 3px 4px 2px rgba(0, 0, 0, 0.4), 1px 3px 6px 4px rgba(0, 0, 0, 0.2)'

    return (
        <React.Fragment>

            <div style={{margin: '16px 0px 8px', fontSize: '1.5rem', fontWeight: 700}}>Coffees Main Page</div>
            <Box component='img' alt='Coffee Tracker - Coffees Page' src={screensCoffees}
                 style={{width: '100%', boxShadow}}/>

            <div style={{margin: '40px 0 8px', fontSize: '1.5rem', fontWeight: 700}}>Coffee Details</div>
            <Box component='img' alt='Coffee Tracker - Coffee Details' src={screensCoffeesOpen}
                 style={{width: '100%', boxShadow}}/>

            <div style={{margin: '40px 0 8px', fontSize: '1.5rem', fontWeight: 700}}>Brew Page</div>
            <Box component='img' alt='Coffee Tracker - Brews Page' src={screensBrews}
                 style={{width: '100%', boxShadow}}/>

            <div style={{margin: '40px 0 8px', fontSize: '1.5rem', fontWeight: 700}}>Yield Calculator / Timer</div>
            <Box component='img' alt='Coffee Tracker - Yield Calculator / Timer' src={yieldTimer}
                 style={{width: '100%', boxShadow}}/>

        </React.Fragment>
    )
}

export default ScreenshotsPage
