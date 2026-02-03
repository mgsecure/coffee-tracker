import React, {useContext, useMemo} from 'react'
import DataContext from '../../context/DataContext.jsx'
import dayjs from 'dayjs'
import minMax from 'dayjs/plugin/minMax'
import useData from '../../util/useData.jsx'
import cleanObject from '../../util/cleanObject'
import {setDeep, setDeepAdd, setDeepPush, setDeepUnique} from '../../util/setDeep.js'
import filterEntriesAdvanced from '../../filters/filterEntriesAdvanced'
import searchEntriesForText from '../../filters/searchEntriesForText'
import FilterContext from '../../context/FilterContext.jsx'

dayjs.extend(minMax)

export function SurveyResultsDataProvider({children}) {

    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters
    const {data = {}, loading, error} = useData({url: '/data/surveySubmissionsSamples.json'})

    const totalSubmissions = data?.surveySubmissions?.length || 0

    const mappedEntries = useMemo(() => {
        if (!data || loading || error) return []
        return data.surveySubmissions || []
            .map(entry => {
                return {
                    ...entry
                }
            })
            .sort((a, b) => dayjs(a.addedAt).valueOf() - dayjs(b.addedAt).valueOf())
    }, [data, error, loading])

    const visibleEntries = useMemo(() => {
        return filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries
        })
    }, [advancedFilterGroups, mappedEntries])

    const surveySummary = useMemo(() => {
        if (!data || loading || error) return {}
        return (data.surveySubmissions || [])
            .reduce((acc, entry) => {
                const surveyDate = dayjs(entry.addedAt).format('YYYY-MM-DD')
                setDeepAdd(acc, ['surveyCount'], 1)
                setDeepAdd(acc, ['daily', surveyDate, 'newSurveyCount'], 1)
                setDeep(acc, ['daily', surveyDate, 'cummulativeSurveyCount'], acc.surveyCount)

                setDeepAdd(acc, ['userExperienceLevel', entry.userExperienceLevel], 1)
                setDeepAdd(acc, ['userGenerallyShop', entry.userGenerallyShop], 1)
                entry.userGenerallyShop === 'Other' && setDeepAdd(acc, ['userGenerallyShopOther', entry.userGenerallyShopOther], 1)
                setDeepAdd(acc, ['userMethodsCount', entry.userMethods?.length], 1)
                if (entry.userMethods?.length > 0) {
                    entry.userMethods?.forEach(method => {
                        setDeepAdd(acc, ['userMethods', method], 1)
                    })
                }
                entry.userMethods === 'Other' && setDeepAdd(acc, ['userMethodsOther', entry.userMethodsOther], 1)
                setDeepAdd(acc, ['userCoffeesPerDay', entry.userCoffeesPerDay], 1)
                setDeepAdd(acc, ['userRecordsDetails', entry.userRecordsDetails], 1)

                return acc
            }, {})
    }, [data, error, loading])

    console.log('surveySummary', surveySummary  )

    const value = useMemo(() => ({
        data,
        loading,
        error
    }), [data, loading, error])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default SurveyResultsDataProvider

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
