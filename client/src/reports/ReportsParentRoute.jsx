import React, {useContext} from 'react'
import {Outlet} from 'react-router-dom'
import {FilterProvider} from '../context/FilterContext.jsx'
import {coffeeFilterFields} from '../data/filterFields.js'
import DataProvider from './ReportsDataProvider.jsx'
import DBContext from '../app/DBContext.jsx'

export default function ReportsParentRoute() {
    const {userProfile = {}} = useContext(DBContext)

    return (
    <FilterProvider filterFields={coffeeFilterFields}>
        <DataProvider allEntries={[]} profile={userProfile}>
            <Outlet/>
        </DataProvider>
    </FilterProvider>

)
}