import React from 'react'
import usePageTitle from '../util/usePageTitle'
import CoffeesPage from './CoffeesPage.jsx'

export default function CoffeesRoute() {
    usePageTitle('Coffees')

    return (
                <CoffeesPage/>
    )
}

