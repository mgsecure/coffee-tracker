import React, {useContext} from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import ScreenshotsPage from './ScreenshotsPage.jsx'
import ColorModeProvider, {getRootStyle} from '../app/ColorModeContext.jsx'
import {ThemeProvider} from '@mui/material/styles'
import Link from '@mui/material/Link'
import {openInNewTab} from '../util/openInNewTab.js'

function ScreenshotsRoute() {
    usePageTitle('Screenshots')

    const {lightTheme} = useContext(ColorModeProvider)
    const style = getRootStyle(lightTheme)

    const footerBefore = (
        <div style={{marginTop: 30, fontWeight: 600}}>
            <Link onClick={() => openInNewTab('/')}>Visit Site</Link>
        </div>
    )

    return (
        <ThemeProvider theme={lightTheme}>
            <style>{style}</style>
            <Nav title='Screenshots' hideMenu={true}/>

            <ScreenshotsPage/>

            <Footer before={footerBefore}/>

        </ThemeProvider>
    )
}

export default ScreenshotsRoute
