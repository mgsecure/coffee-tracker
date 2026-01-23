import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import ScreenshotsPage from './ScreenshotsPage.jsx'

function ScreenshotsRoute() {
    usePageTitle('Screenshots')

    return (
        <React.Fragment>
            <Nav title='Screenshots'/>

            <ScreenshotsPage/>

            <Footer/>
        </React.Fragment>
    )
}

export default ScreenshotsRoute
