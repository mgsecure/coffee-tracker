import React from 'react'
import Footer from '../nav/Footer'
import Nav from '../nav/Nav'
import usePageTitle from '../util/usePageTitle'
import SurveyPage from './SurveyPage.jsx'

export default function SurveyRoute() {

    usePageTitle('Survey')

    return (
        <React.Fragment>
            <Nav title='Survey'/>

            <SurveyPage/>

            <Footer/>
        </React.Fragment>
    )
}
