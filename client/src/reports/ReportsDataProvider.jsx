import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import roasters from '../data/roasters.json'
import useData from '../util/useData.jsx'
import cleanObject from '../util/cleanObject'
import {countryCodeCountries} from '../data/countryCodeCountries'

dayjs.extend(minMax)

export function ReportsDataProvider({children, profile}) {

    const {data: siteStats, loading, error} = useData({url: '/data/statsSiteFull.json'})


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

    const brewsList = useMemo(() => {
        return ([...profile.brews || []])
            .sort((a, b) => a.fullName.localeCompare(b.fullName))
    }, [profile.coffees])

    const roastersList = useMemo(() => {
        const userList = ([...profile.coffees || []])
            .map(coffee => cleanObject(coffee.roaster))
            .filter(x => x && x.id && x.name)
        return getUniqueObjectsByKey([...roasters, ...userList], 'id')
            .sort((a, b) => a.name?.localeCompare(b.name))
    }, [profile.coffees])

    const value = useMemo(() => ({
        grinderList,
        machineList,
        brewsList,
        coffeesList,
        roastersList,
        siteStats,
        loading,
        error,
        countryCodeCountries
    }), [grinderList, machineList, brewsList, coffeesList, roastersList, siteStats, loading, error])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default ReportsDataProvider

function getUniqueObjectsByKey(arr, key) {
    const uniqueIds = new Set()
    return arr.filter(item => {
        if (!uniqueIds.has(item[key])) {
            uniqueIds.add(item[key])
            return true
        }
        return false
    })
}
