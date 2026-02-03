import React from 'react'
import usePageTitle from '../../util/usePageTitle'
import SurveyResultsPage from './SurveyResultsPage.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import Nav from '../../nav/Nav.jsx'
import Tracker from '../../app/Tracker.jsx'
import Footer from '../../nav/Footer.jsx'
import SurveyResultsDataProvider from './SurveyResultsDataProvider.jsx'
import {coffeeFilterFields} from '../../data/filterFields.js'
import {FilterProvider} from '../../context/FilterContext.jsx'

export default function SurveyResultsRoute() {
    usePageTitle('Survey Results')
    const {isMobile} = useWindowSize()

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const footerBefore = (
        <></>
    )

    return (
        <FilterProvider filterFields={coffeeFilterFields}>
            <SurveyResultsDataProvider>
                <Nav title='Survey Results' titleMobile='Results' extras={extras}/>

                <SurveyResultsPage/>

                <Tracker feature='surveyResults'/>
                <Footer before={footerBefore}/>
            </SurveyResultsDataProvider>
        </FilterProvider>
    )
}

