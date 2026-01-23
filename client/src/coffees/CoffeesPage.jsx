import React, {useContext, useEffect} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import DataContext from '../context/DataContext.jsx'
import {coffeeSortFields} from '../data/sortFields'
import Coffees from './Coffees.jsx'
import Footer from '../nav/Footer.jsx'
import DemoBar from '../shared/DemoBar.jsx'
import AuthContext from '../app/AuthContext.jsx'
import MustBeLoggedIn from '../shared/MustBeLoggedIn.jsx'
import DBContext from '../app/DBContext.jsx'
import {useSearchParams} from 'react-router-dom'
import FilterContext from '../context/FilterContext.jsx'

export default function CoffeesPage() {
    const {isMobile} = useWindowSize()
    const {visibleEntries = []} = useContext(DataContext)
    const {isLoggedIn} = useContext(AuthContext)
    const {profileLoaded, demoEnabled, demo, setDemo} = useContext(DBContext)
    const {filters, removeFilters} = useContext(FilterContext)

    const [searchParams] = useSearchParams()
    const demoFlag = searchParams.get('demo')
    useEffect(() => {
        if (demoFlag && !demo) {
            setDemo(true)
            filters.demo && removeFilters(['demo'])
        }
    })

    const extras = (
        <React.Fragment>
            <SearchBox label='Coffees' extraFilters={[]} keepOpen={false} entryCount={visibleEntries.length}/>
            <ViewFilterButtons entryType={'Coffee'} sortValues={coffeeSortFields} advancedEnabled={false}
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const footerBefore = (
        <></>
    )

    return (
        <React.Fragment>
            <Nav title='My Coffees' titleMobile='Coffees' extras={extras}/>

            <DemoBar/>

            {profileLoaded && !isLoggedIn && !demoEnabled
                ? <MustBeLoggedIn actionText={'track your coffees'}/>
                : <Coffees/>
            }

            <Tracker feature='coffees'/>
            <Footer before={footerBefore}/>

        </React.Fragment>
    )
}