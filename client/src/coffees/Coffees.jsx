import React, {useContext, useDeferredValue, useState} from 'react'
import AddNewItemCard from '../shared/AddNewItemCard.jsx'
import Grid from '@mui/material/Grid'
import DataContext from '../context/DataContext.jsx'
import {motion, AnimatePresence} from 'framer-motion'
import CoffeeCard from './CoffeeCard.jsx'
import FilterContext from '../context/FilterContext.jsx'
import FilterDisplayAdvanced from '../filters/FilterDisplayAdvanced.jsx'
import NoMatchingEntriesCard from '../shared/NoMatchingEntriesCard.jsx'
import useWindowSize from '../util/useWindowSize.jsx'

export default function Coffees() {
    const {visibleEntries = [], allEntriesCount} = useContext(DataContext)

    const {filters} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const defExpanded = useDeferredValue(expanded)

    const {isMobile} = useWindowSize()

    return (
        <div style={{
            minWidth: '320px', height: '100%',
            padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 0
        }}>
            <div style={{marginBottom: 10}}>
                <FilterDisplayAdvanced/>
            </div>

            <div style={{margin: isMobile ? '0px 3px' : '0px 6px'}}>
                <Grid container spacing={'6px'} columns={1}>
                    <AnimatePresence>
                        <Grid size={{xs: 4, sm: 4, md: 4}} key={'add-bean-card'}>
                            {visibleEntries.length === 0
                                ? <NoMatchingEntriesCard type={'coffee'} entriesCount={visibleEntries.length}
                                                         allEntriesCount={allEntriesCount}/>
                                : <AddNewItemCard type={'Coffee'} count={visibleEntries.length}/>
                            }
                        </Grid>
                        {visibleEntries?.length > 0 &&
                            visibleEntries.filter(x => x)
                                .map((entry) =>
                                    <Grid
                                        size={{xs: 4, sm: 4, md: 4}}
                                        key={entry.id}
                                        component={motion.div}
                                        layout
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{type: 'spring', stiffness: 400, damping: 40}}
                                    >
                                        <CoffeeCard
                                            entry={entry}
                                            expanded={entry.id === defExpanded}
                                            onExpand={setExpanded}
                                        />
                                    </Grid>
                                )}
                    </AnimatePresence>
                </Grid>

                <div style={{display: 'block', clear: 'both'}}/>

            </div>
        </div>
    )
}