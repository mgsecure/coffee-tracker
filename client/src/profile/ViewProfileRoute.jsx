import React, {useContext} from 'react'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from '../brews/BrewsDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import ViewProfile from './ViewProfile.jsx'
import DBContext from '../app/DBContext.jsx'

export default function ViewProfileRoute() {
    const {userProfile = {}} = useContext(DBContext)

    usePageTitle('My Setup')
    return (
        <FilterProvider filterFields={[]}>
            <DataProvider allEntries={espressoBeans} profile={userProfile}>
                <ViewProfile/>
            </DataProvider>
        </FilterProvider>
    )
}