import React, {useContext} from 'react'
import {Outlet} from 'react-router-dom'
import GlobalDataProvider from '../shared/GlobalDataProvider.jsx'
import DataProvider from './CoffeesDataProvider.jsx'
import DBContext from '../app/DBContext.jsx'
import {coffeeFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'

export default function CoffeesParentRoute() {
    const {userProfile = {}} = useContext(DBContext)

    return (
        <FilterProvider filterFields={coffeeFilterFields}>
            <GlobalDataProvider>
                <DataProvider profile={userProfile}>
                    <Outlet/>
                </DataProvider>
            </GlobalDataProvider>
        </FilterProvider>
    )
}