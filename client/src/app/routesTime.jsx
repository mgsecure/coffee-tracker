import React, {Suspense} from 'react'
import {Outlet} from 'react-router-dom'

import ErrorBoundary from './ErrorBoundary'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import EnvAppBar from '../misc/EnvAppBar.jsx'

const style = {
    maxWidth: 800,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}

const AppShell = () => (
    <React.Fragment>
        <EnvAppBar/>
        <div style={{...style, fontFamily: 'Roboto, system-ui, sans-serif'}}>
            <Outlet/>
        </div>
    </React.Fragment>

)

export default [{
    element: <AppShell/>,
    errorElement: <ErrorBoundary/>,
    //HydrateFallback: () => <LoadingDisplay/>,
    HydrateFallback: () => {
    },
    children: [
        {
            path: '/',
            name: 'homepage',
            lazy: async () => {
                const {default: TimeRoute} = await import('../alice/TimeRoute.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><TimeRoute/></Suspense>}
            }
        },
        {
            path: '/time',
            name: 'time',
            lazy: async () => {
                const {default: TimeRoute} = await import('../alice/TimeRoute.jsx')
                return {element: <Suspense><TimeRoute/></Suspense>}
            }
        },
        {
            path: '*',
            name: '404 not found',
            lazy: async () => {
                const {default: NotFound} = await import('./NotFound.jsx')
                return {element: <Suspense fallback={<LoadingDisplay/>}><NotFound/></Suspense>}
            }
        }
    ].map(route => ({...route, errorElement: <ErrorBoundary/>}))
}]

