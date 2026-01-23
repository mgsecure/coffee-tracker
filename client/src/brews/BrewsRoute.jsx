import React, {useContext} from 'react'
import {brewFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import BrewsPage from './BrewsPage.jsx'
import DBContext from '../app/DBContext.jsx'
import GlobalDataProvider from '../shared/GlobalDataProvider.jsx'
import DataProvider from './BrewsDataProvider.jsx'

function BrewsRoute() {
    usePageTitle('Brews')
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={brewFilterFields}>
            <GlobalDataProvider>
                <DataProvider profile={userProfile}>
                    <BrewsPage/>
                </DataProvider>
            </GlobalDataProvider>
        </FilterProvider>
    )
}

export default BrewsRoute
