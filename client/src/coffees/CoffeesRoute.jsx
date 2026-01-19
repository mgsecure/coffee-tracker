import React, {useContext} from 'react'
import {coffeeFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './CoffeesDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import CoffeesPage from './CoffeesPage.jsx'
import DBContext from '../app/DBContext.jsx'

export default function CoffeesRoute() {
    usePageTitle('Coffees')
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={coffeeFilterFields}>
            <DataProvider allEntries={espressoBeans} profile={userProfile}>
                <CoffeesPage/>
            </DataProvider>
        </FilterProvider>
    )
}

