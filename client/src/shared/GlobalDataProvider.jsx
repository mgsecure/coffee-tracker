import React, {useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import DBContext from '../app/DBContext.jsx'
import {setDeep, setDeepUnique} from '../util/setDeep'

let doseUnits = {g: 0}
let temperatureUnits = {'C': 0}

export function GlobalDataProvider({children}) {
    const {userProfile: profile = {}} = useContext(DBContext)

    const equipment = profile.brews?.reduce((acc, brew) => {
        setDeepUnique(acc, [brew.coffee?.id, 'grinders'], brew.grinder?.id)
        setDeepUnique(acc, [brew.coffee?.id, 'machines'], brew.machine?.id)
        return acc
    }, {})

    const mappedBrews = useMemo(() => {
        return (profile.brews || [])
            .map(entry => {
                const coffee = profile.coffees?.find(g => g.id === entry.coffee?.id) || entry.coffee || {}
                const grinder = profile.equipment?.find(g => g.id === entry.grinder?.id) || entry.grinder || {}
                const machine = profile.equipment?.find(g => g.id === entry.machine?.id) || entry.machine || {}

                const multipleEquipment = {
                    grinders: equipment[entry.coffee?.id].grinders?.length > 1,
                    machines: equipment[entry?.coffee?.id].machines?.length > 1
                }

                const tempUnit = entry.temperatureUnit?.substring(1, 2)
                if (tempUnit) temperatureUnits[tempUnit] = (temperatureUnits[tempUnit] || 0) + 1
                if (entry.doseUnit) doseUnits[entry.doseUnit] = (doseUnits[entry.doseUnit] || 0) + 1

                return {
                    ...entry,
                    originalEntry: {...entry},
                    fullName: coffee.fullName || 'Unknown Coffee',
                    coffeeName: coffee.name || 'Unknown Coffee',
                    roasterName: coffee.roaster?.name || 'Unknown Roaster',
                    grinderName: grinder?.fullName || 'Unknown Grinder',
                    machineName: machine?.fullName || 'Unknown Machine',
                    modifiedAt: entry.modifiedAt || entry.addedAt,
                    brewedAt: entry.brewedAt || entry.addedAt,
                    restedDays: Math.max(dayjs(entry.addedAt).diff(dayjs(entry.roastDate), 'day'), 0),
                    isFlagged: entry.flagged ? 'Yes' : 'No',
                    multipleEquipment,
                    fuzzy: removeAccents([
                        entry.fullName
                    ].join(','))
                }
            })
    }, [equipment, profile.brews, profile.coffees, profile.equipment])

    const modeDoseUnit = Object.entries(doseUnits).reduce((a, b) =>
        b[1] > a[1] || (b[1] === a[1] && b[0] < a[0]) ? b : a
    )[0]

    const modeTempUnit = Object.entries(temperatureUnits).reduce((a, b) =>
        b[1] > a[1] || (b[1] === a[1] && b[0] < a[0]) ? b : a
    )[0]
    const modeTemperatureUnit = `º${modeTempUnit}`

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
        mappedBrews,
        grinderList,
        machineList,
        coffeesList,
        modeDoseUnit,
        modeTemperatureUnit
    }), [
        mappedBrews,
        grinderList,
        machineList,
        coffeesList,
        modeDoseUnit,
        modeTemperatureUnit
    ])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default GlobalDataProvider
