import React from 'react'
import {beanFilterFields} from '../data/filterFields'
import {FilterProvider} from '../context/FilterContext.jsx'
import usePageTitle from '../util/usePageTitle'
import DataProvider from './EspressoBeansDataProvider.jsx'
import espressoBeans from '../data/espressoBeansDatabase.json'
import EspressoBeans from './EspressoBeans.jsx'

function EspressoBeansRoute() {
    usePageTitle('espresso beans database')

    return (
        <FilterProvider filterFields={beanFilterFields}>
            <DataProvider allEntries={espressoBeans}>
                <EspressoBeans/>
            </DataProvider>
        </FilterProvider>
    )
}

export default EspressoBeansRoute
