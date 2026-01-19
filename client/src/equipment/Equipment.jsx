import React, {useContext, useDeferredValue, useState} from 'react'
import EquipmentCard from './EquipmentCard.jsx'
import AddNewItemCard from '../profile/AddNewItemCard.jsx'
import Grid from '@mui/material/Grid'
import DataContext from '../context/DataContext.jsx'
import NoMatchingEntriesCard from '../profile/NoMatchingEntriesCard.jsx'
import {motion, AnimatePresence} from 'framer-motion'

export default function Equipment() {
    const {visibleEntries = [], allEntriesCount} = useContext(DataContext)
    const [expanded, setExpanded] = useState(undefined)
    const defExpanded = useDeferredValue(expanded)

    return (

        <div style={{
            minWidth: '320px', height: '100%',
            padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 0
        }}>
            <div style={{marginBottom: 10}}/>

            <div style={{maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto'}}>

                <Grid container spacing={'6px'} columns={1}
                      style={{margin: '0px 4px'}}>
                    <AnimatePresence>

                        <Grid size={{xs: 4, sm: 4, md: 4}} key={'add-item-card'}>
                            {visibleEntries?.length === 0
                                ? <NoMatchingEntriesCard type={'Gear'} entriesCount={visibleEntries.length}
                                                         allEntriesCount={allEntriesCount}/>
                                : <AddNewItemCard type={'Gear'} count={visibleEntries.length}/>
                            }
                        </Grid>
                        {visibleEntries?.length > 0 &&
                            [...visibleEntries]
                                .filter(x => x)
                                .map((machine) =>
                                    <Grid
                                        size={{xs: 4, sm: 4, md: 4}}
                                        key={machine.id}
                                          component={motion.div}
                                          layout
                                          initial={{opacity: 0}}
                                          animate={{opacity: 1}}
                                          exit={{opacity: 0}}
                                          transition={{type: 'spring', stiffness: 400, damping: 40}}
                                    >
                                        <EquipmentCard
                                            entry={machine}
                                            expanded={machine.id === defExpanded}
                                            onExpand={setExpanded}
                                        />
                                    </Grid>
                                )}
                    </AnimatePresence>
                </Grid>

            </div>
        </div>
    )
}