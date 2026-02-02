import React, {useContext, useMemo} from 'react'
import querystring from 'query-string'
import AuthContext from './AuthContext.jsx'

function Tracker({feature, ...extraParams}) {
    const {isAdmin} = useContext(AuthContext)

    // disable for rafl testing/reporting
    if (import.meta.env.DEV || isAdmin) return null
    //if (import.meta.env.DEV) return null

    const url = useMemo(() => {
        const randomStuff = (Math.random()).toString(36).substring(2, 10)
        const file = files[feature] || 'bean.gif'
        const ref = document.referrer || 'none'
        const page = window.location.href.replace(/.*\/#\/(\w+)\?*.*/, '$1')
        const query = querystring.stringify({trk: feature, r: randomStuff, w: screen.width, ref, page, ...extraParams})
        return `https://coffee-tracker.com/i/${file}?${query}`
    }, [extraParams, feature])

    // <Tracker feature='search' search={search}/>
    // <Tracker feature='lock' id={entry.id} search={search}/>

    return <img alt='coffee-tracker.com' src={url} width={0} height={0}/>
}

const files = {
    coffee: 'bean.gif',
}

export default React.memo(Tracker)
