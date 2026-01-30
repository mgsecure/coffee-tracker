import React, {useContext} from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import SurveyPage from './SurveyPage.jsx'
import ColorModeProvider, {getRootStyle} from '../app/ColorModeContext.jsx'
import {ThemeProvider} from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import {openInNewTab} from '../util/openInNewTab.js'

export default function SurveyRoute() {
    usePageTitle('Survey')

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
            <Paper elevation={0} square sx={{minHeight: '100vh'}}>

                <Nav title='Survey' hideMenu={true}/>

                <SurveyPage/>

                <Footer before={footerBefore}/>

            </Paper>
        </ThemeProvider>
    )
}
