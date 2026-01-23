import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import searchEntriesForText from '../filters/searchEntriesForText'

export function BrewsDataProvider({children, profile}) {
    const globalContext = useContext(DataContext)
    const {mappedBrews} = useContext(DataContext)

    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const allEntries = useMemo(() => {
        return profile.brews || []
    }, [profile.brews])

    const mappedEntries = useMemo(() => {
       return  [...mappedBrews]
    },[mappedBrews])

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, mappedEntries)
    }, [mappedEntries, search])

    const visibleEntries = useMemo(() => {

        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries
        })
        const searched = searchEntriesForText(search, filtered)

        const sorted = [...searched]
        if (sort) {
            sorted.sort((a, b) => {
                if (sort === 'name') {
                    return a.fullName.localeCompare(b.fullName)
                        || dayjs(b.brewedAt).valueOf() - dayjs(a.brewedAt).valueOf()
                } else if (sort === 'rating') {
                    return (b.ratings?.rating || 0) - (a.ratings?.rating || 0)
                        || a.fullName.localeCompare(b.fullName)
                } else if (sort === 'dateAdded') {
                    return dayjs(b.addedAt).valueOf() - dayjs(a.addedAt).valueOf()
                } else {
                    return dayjs(b.brewedAt || b.addedAt).valueOf() - dayjs(a.brewedAt || b.addedAt).valueOf()
                }
            })
        } else {
            sorted.sort((a, b) => {
                return dayjs(b.brewedAt || b.addedAt).valueOf() - dayjs(a.brewedAt || a.addedAt).valueOf()
            })
        }
        return sorted
    }, [advancedFilterGroups, mappedEntries, search, sort])

    const grinderList = useMemo(() => {
        return (profile.equipment?.filter(e => e.type === 'Grinder') || [])
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
    }, [profile.equipment])

    const machineList = useMemo(() => {
        return (profile.equipment?.filter(e => e.type !== 'Grinder') || [])
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
    }, [profile.equipment])

    const coffeesList = useMemo(() => {
        return ([...profile.coffees || []])
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
    }, [profile.coffees])

    const value = useMemo(() => ({
        ...globalContext,
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll,
    }), [
        globalContext,
        allEntries,
        mappedEntries,
        searchedEntries,
        visibleEntries,
        expandAll,
        coffeesList,
    ])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default BrewsDataProvider
