import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import EspressoBeanEntries from './EspressoBeanEntries.jsx'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import DataContext from '../context/DataContext.jsx'
import {beanSortFields} from '../data/sortFields'
import NoMatchingEntriesCard from '../shared/NoMatchingEntriesCard.jsx'
import IntroCopy from '../misc/IntroCopy.jsx'

export default function EspressoBeans() {
    const {isMobile} = useWindowSize()
    const {visibleEntries = [], loading, allEntriesCount} = useContext(DataContext)

    const extras = (
        <React.Fragment>
            <SearchBox label='Espresso Beans' extraFilters={[]} keepOpen={false} entryCount={visibleEntries.length}/>
            <ViewFilterButtons entryType={'Bean'} sortValues={beanSortFields} advancedEnabled={true}
                               compactMode={false} resetAll={true} expandAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='r/espresso beans' titleMobile='r/espresso' extras={extras}/>

            <div style={{margin: 8, padding: 4, paddingBottom: 32, width: '100%', maxWidth: 800}}>

                <IntroCopy pageName={'espressoBeans'} maxWidth={800}/>

                {!loading && visibleEntries.length === 0 &&
                    <NoMatchingEntriesCard type={'roaster'} entriesCount={visibleEntries.length}
                                           allEntriesCount={allEntriesCount} addNew={false}/>
                }
                <EspressoBeanEntries/>
            </div>
            <Tracker feature='espressoBeans'/>
        </React.Fragment>
    )
}